// BigInteger monkey patching
BigInteger.valueOf = nbv;

/**
 * Returns a byte array representation of the big integer.
 *
 * This returns the absolute of the contained value in big endian
 * form. A value of zero results in an empty array.
 */
BigInteger.prototype.toByteArrayUnsigned = function () {
  var ba = this.abs().toByteArray();
  if (ba.length) {
    if (ba[0] == 0) {
      ba = ba.slice(1);
    }
    return ba.map(function (v) {
      return (v < 0) ? v + 256 : v;
    });
  } else {
    // Empty array, nothing to do
    return ba;
  }
};

/**
 * Turns a byte array into a big integer.
 *
 * This function will interpret a byte array as a big integer in big
 * endian notation and ignore leading zeros.
 */
BigInteger.fromByteArrayUnsigned = function (ba) {
  if (!ba.length) {
    return ba.valueOf(0);
  } else if (ba[0] & 0x80) {
    // Prepend a zero so the BigInteger class doesn't mistake this
    // for a negative integer.
    return new BigInteger([0].concat(ba));
  } else {
    return new BigInteger(ba);
  }
};

/**
 * Converts big integer to signed byte representation.
 *
 * The format for this value uses a the most significant bit as a sign
 * bit. If the most significant bit is already occupied by the
 * absolute value, an extra byte is prepended and the sign bit is set
 * there.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0x81
 *    127 =>     0x7f
 *   -127 =>     0xff
 *    128 =>   0x0080
 *   -128 =>   0x8080
 *    255 =>   0x00ff
 *   -255 =>   0x80ff
 *  16300 =>   0x3fac
 * -16300 =>   0xbfac
 *  62300 => 0x00f35c
 * -62300 => 0x80f35c
 */
BigInteger.prototype.toByteArraySigned = function () {
  var val = this.abs().toByteArrayUnsigned();
  var neg = this.compareTo(BigInteger.ZERO) < 0;

  if (neg) {
    if (val[0] & 0x80) {
      val.unshift(0x80);
    } else {
      val[0] |= 0x80;
    }
  } else {
    if (val[0] & 0x80) {
      val.unshift(0x00);
    }
  }

  return val;
};

/**
 * Parse a signed big integer byte representation.
 *
 * For details on the format please see BigInteger.toByteArraySigned.
 */
BigInteger.fromByteArraySigned = function (ba) {
  // Check for negative value
  if (ba[0] & 0x80) {
    // Remove sign bit
    ba[0] &= 0x7f;

    return BigInteger.fromByteArrayUnsigned(ba).negate();
  } else {
    return BigInteger.fromByteArrayUnsigned(ba);
  }
};

var Base58 = {
	alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
	base: BigInteger.valueOf(58),
	encode: function (input) {
		var bi = BigInteger.fromByteArrayUnsigned(input);
		var chars = [];
		while (bi.compareTo(Base58.base) >= 0) {
			var mod = bi.mod(Base58.base);
			chars.unshift(Base58.alphabet[mod.intValue()]);
			bi = bi.subtract(mod).divide(Base58.base);
		}
		chars.unshift(Base58.alphabet[bi.intValue()]);
		for (var i = 0; i < input.length; i++) {
			if (input[i] == 0x00) {
				chars.unshift(Base58.alphabet[0]);
			} else break;
		}
		return chars.join('');
	}
};

var integerToBytes = function(i, len) {
	var bytes = i.toByteArrayUnsigned();
	if (len < bytes.length) {
		bytes = bytes.slice(bytes.length-len);
	} else while (len > bytes.length) {
		bytes.unshift(0);
	}
	return bytes;
};

ECPointFp.prototype.getEncoded = function () {
	var x = this.getX().toBigInteger();
	var y = this.getY().toBigInteger();
	var enc = integerToBytes(x, 32);
	enc.unshift(0x04);
	enc = enc.concat(integerToBytes(y, 32));
	return enc;
};

var getBigRandom = function(limit) {
	var rng = new SecureRandom();
	return new BigInteger(limit.bitLength(), rng).mod(limit.subtract(BigInteger.ONE)).add(BigInteger.ONE);
};

var Address = function() {

	var ecparams = getSECCurveByName("secp256k1");
	var priv = getBigRandom(ecparams.getN());
	var pub = ecparams.getG().multiply(priv).getEncoded(false);

	var hash = Crypto.RIPEMD160(Crypto.SHA256(pub, {asBytes: true}), {asBytes: true});
	hash.unshift(0x00); // version
	var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});
	var bytes = hash.concat(checksum.slice(0,4));
	this.pub = Base58.encode(bytes);

	hash = priv.toByteArrayUnsigned();
	while (hash.length < 32) hash.unshift(0);
	hash.unshift(0x80); // version
	checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes: true}), {asBytes: true});
	bytes = hash.concat(checksum.slice(0,4));
	this.priv = Base58.encode(bytes);
}
