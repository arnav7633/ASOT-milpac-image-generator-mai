const Conv = require("file-format-converter");

(async() => {
await Conv.PowerPointToPdf(__dirname + "/output.pptx", __dirname + "/out.pdf")
})()
