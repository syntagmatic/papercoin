var print_qr = function(doc, x, y, size, text) {
	var qr = new qrcode(4, 'H'); qr.addData(text); qr.make();
	var m = qr.getModuleCount();
	var s = size / m;
	doc.setFillColor(0);
	for (var r = 0; r < m; r++) {
		for (var c = 0; c < m; c++) {
			if (qr.isDark(r, c)) {
				doc.rect(x + c*s, y + r*s, s, s, 'F');
			}
		}
	}
}

var wallet = function(doc, x, y) {
	var addr = new Address();

	doc.setLineWidth(0.4);
	/* main rectangle */
	doc.line(x + 0, y + 64, x + 64, y + 128);
	doc.line(x + 64, y + 128, x + 128, y + 64);
	doc.line(x + 128, y + 64, x + 64, y + 0);
	doc.line(x + 64, y + 0, x + 0, y + 64);

	doc.setLineWidth(0.2);
	/* folding lines */
	doc.rect(x + 32, y + 32, 64, 64);
	doc.line(x + 32, y + 48, x + 96, y + 48);
	doc.line(x + 32, y + 80, x + 96, y + 80);
	doc.line(x + 64, y + 48, x + 64, y + 80);

	/* black bars */
	doc.setFillColor(0);
	doc.rect(x + 48, y + 16, 32, 16, 'F');
	doc.rect(x + 48, y + 96, 32, 16, 'F');

	/* folding circles */
	doc.setFillColor(255);
	doc.circle(x + 32, y + 64, 1.5, 'FD');
	doc.circle(x + 96, y + 64, 1.5, 'FD');
	doc.circle(x + 64, y + 32, 1.5, 'FD');
	doc.circle(x + 64, y + 96, 1.5, 'FD');
	doc.circle(x + 48, y + 48, 1.5, 'FD');
	doc.circle(x + 48, y + 80, 1.5, 'FD');
	doc.circle(x + 64, y + 64, 1.5, 'FD');

	/* folding circles text */
	doc.setFillColor(0);
	doc.setFontSize(7);
	doc.setFont('helvetica', 'normal');
	doc.text(x + 32-0.7, y + 64+0.8, '1');
	doc.text(x + 96-0.7, y + 64+0.8, '2');
	doc.text(x + 64-0.7, y + 32+0.8, '3');
	doc.text(x + 64-0.8, y + 96+0.8, '4');
	doc.text(x + 48-0.7, y + 48+0.8, '5');
	doc.text(x + 48-0.8, y + 80+0.8, '6');
	doc.text(x + 64-0.7, y + 64+0.8, '7');

	/* url */
	doc.setFontSize(7);
	doc.text(x + 73.25, y + 50.5, 'papercoin.org');

	/* remarks */
	doc.setFontSize(5);
	doc.text(x + 44.5, y + 52, 'remarks:');

	/* public address */
	doc.setFontSize(4.2);
	doc.setFont('courier', 'normal');
	doc.text(x + 65, y + 79, addr.pub);

	/* private key */
	doc.setFontSize(7);
	doc.text(x + 53.5, y + 116, addr.priv.slice(0,14));
	doc.text(x + 57.5, y + 119, addr.priv.slice(14, 23));
	doc.text(x +   62, y + 122, addr.priv.slice(23, 26));
	doc.text(x +   62, y +   7, addr.priv.slice(26, 29));
	doc.text(x + 57.5, y +  10, addr.priv.slice(29, 38));
	doc.text(x +   54, y +  13, addr.priv.slice(38));

	/* qr code */
	print_qr(doc, x + 67.5, y + 52, 25.0, addr.pub);
};

var papercoin = function() {

	var doc = new jsPDF();

	doc.setFontSize(7);
	doc.text(142, 10, 'You are welcome to donate to');
	doc.setFontSize(8);
	doc.text(130, 15, '14NeoVzxm6AESTzPKdANmvuZzDxBDNBma7');
	doc.setFontSize(7);
	doc.text(144, 20, 'if you like this idea, thanks!');
	print_qr(doc, 147, 25, 25.0, '14NeoVzxm6AESTzPKdANmvuZzDxBDNBma7');

	wallet(doc, 9, 12);
	wallet(doc, 73, 76);
	wallet(doc, 9, 140);

	doc.save('papercoin.pdf');

	return false;
};
