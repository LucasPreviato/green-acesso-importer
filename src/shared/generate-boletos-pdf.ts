import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

const doc = new PDFDocument();
const filePath = path.join(__dirname, 'boletos.pdf');
doc.pipe(fs.createWriteStream(filePath));

const nomes = ['MARCIA', 'JOSE', 'MARCOS'];

nomes.forEach((nome, i) => {
  if (i > 0) doc.addPage();
  doc.fontSize(24).text(`BOLETO DE ${nome}`, { align: 'center' });
});

doc.end();
console.log('PDF gerado em:', filePath);
