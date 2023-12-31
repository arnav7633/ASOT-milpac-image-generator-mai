const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");
const converter = require("file-format-converter");
async function main(data) {
  // Load the docx file as binary content
  const content = fs.readFileSync(
    path.resolve(__dirname, "../templates/Bulk Template.pptx"),
    "binary"
  );

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
  doc.render(data);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  // buf is a nodejs Buffer, you can either write it to a
  // file or res.send it with express for example.
  fs.writeFileSync(path.resolve(__dirname, "../output.pptx"), buf);
  const imgData = await converter.powerpointToImages(
    __dirname + "/../output.pptx",
    __dirname + "/../certs/"
  );
  for (const img of imgData) {
    console.log(img);
  }
}
module.exports = main;
//main({ name: "Private Fulcrum", signaturer: "MAJ Trew", date: "3 July 2023" });