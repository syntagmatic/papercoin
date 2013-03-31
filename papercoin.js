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
	doc.rect(x + 0, y + 0, 64, 128);

	doc.setLineWidth(0.2);
	/* folding lines */
	doc.line(x +  0, y + 32, x + 64, y + 32);
	doc.line(x +  0, y + 96, x + 64, y + 96);
	doc.line(x +  0, y + 48, x + 64, y + 48);
	doc.line(x +  0, y + 80, x + 64, y + 80);
	doc.line(x + 32, y + 48, x + 32, y + 80);

	/* black bars */
	doc.setFillColor(0);
	doc.rect(x + 16, y + 16, 32, 16, 'F');
	doc.rect(x + 16, y + 96, 32, 16, 'F');

	/* sticking triangles */
	doc.triangle(x + 1, y + 63, x + 2, y + 64, x + 1, y + 65, 'F');
	doc.triangle(x + 63, y + 63, x + 62, y + 64, x + 63, y + 65, 'F');

	/* folding circles */
	doc.setFillColor(255);
	doc.circle(x + 32, y + 32, 1.5, 'FD');
	doc.circle(x + 32, y + 96, 1.5, 'FD');
	doc.circle(x + 16, y + 48, 1.5, 'FD');
	doc.circle(x + 16, y + 80, 1.5, 'FD');
	doc.circle(x + 32, y + 64, 1.5, 'FD');

	/* folding circles text */
	doc.setFillColor(0);
	doc.setFontSize(7);
	doc.setFont('helvetica', 'normal');
	doc.text(x + 32-0.7, y + 32+0.8, '1');
	doc.text(x + 32-0.8, y + 96+0.8, '2');
	doc.text(x + 16-0.7, y + 48+0.8, '3');
	doc.text(x + 16-0.8, y + 80+0.8, '4');
	doc.text(x + 32-0.7, y + 64+0.8, '5');

	/* url */
	doc.setFontSize(7);
	doc.text(x + 41.25, y + 50.5, 'papercoin.org');

	/* remarks */
	doc.setFontSize(5);
	doc.text(x + 12.5, y + 52, 'remarks:');

	/* public address */
	doc.setFontSize(4.2);
	doc.setFont('courier', 'normal');
	doc.text(x + 33, y + 79, addr.pub);

	/* private key */
	doc.setFontSize(7);
	doc.text(x + 22.5, y + 123.5, addr.priv.slice(0,13));
	doc.text(x + 22.5, y + 126.5, addr.priv.slice(13, 26));
	doc.text(x + 22.5, y +   3, addr.priv.slice(26, 39));
	doc.text(x + 22.5, y +   6, addr.priv.slice(39));

	/* qr code */
	print_qr(doc, x + 35.5, y + 52, 25.0, addr.pub);
};

var papercoin = function() {

	var doc = new jsPDF('l');

	doc.setFontSize(36);
	doc.text(20.5, 20, 'PaperCoin');
	doc.setFontSize(24);
	doc.text(117, 20, '"The first origami that can buy you a pizza"');
	doc.setFontSize(12);
	doc.text(20.5, 30, 'You are welcome to donate to 14NeoVzxm6AESTzPKdANmvuZzDxBDNBma7 if you like this idea, thanks!');
	print_qr(doc, 245.5, 25, 31.0, '14NeoVzxm6AESTzPKdANmvuZzDxBDNBma7');
	doc.setFontSize(10);
	doc.text(20.5, 44, 'Steps:');
	doc.text(20.5, 48, '1. Cut-out along the thick lines.');
	doc.text(20.5, 52, '2. Fold (180 degrees) along the thin lines following the number order in circles.');
	doc.text(20.5, 56, '3. Use a sticky tape to attach the two sides marked with triangles.');

	wallet(doc, 17.5, 20.5+41);
	wallet(doc, 17.5+64+2, 20.5+41);
	wallet(doc, 17.5+2*64+4, 20.5+41);
	wallet(doc, 17.5+3*64+6, 20.5+41);

	doc.save('papercoin.pdf');

	return false;
};
