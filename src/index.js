const util = require("util");
const PDFDocument = require("pdf-lib").PDFDocument;
const fs = require("fs");
const path = require("path");

const readdir = util.promisify(fs.readdir);

async function merge() {
  const directoryPath = path.join(__dirname, "../pdf");
  let pdfFiles;

  try {
    pdfFiles = await readdir(directoryPath);
  } catch (e) {
    console.error(e);
  }

  const pdfsToMerge = [];
  for (const file of pdfFiles) {
    if (file.endsWith("pdf")) {
      pdfsToMerge.push(fs.readFileSync(path.join(__dirname, `../pdf/${file}`)));
    }
  }
  console.log(pdfsToMerge.length);
  const mergedPdf = await PDFDocument.create();
  for (const pdfBytes of pdfsToMerge) {
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const buf = await mergedPdf.save(); // Uint8Array

  let fileName = "merged.pdf";
  fs.open(fileName, "w", function (err, fd) {
    fs.write(fd, buf, 0, buf.length, null, function (err) {
      fs.close(fd, function () {
        console.log("wrote the file successfully");
      });
    });
  });
}

(async () => await merge())();
