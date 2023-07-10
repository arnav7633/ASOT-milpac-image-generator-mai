custom-soffice-to-pdf
=====

Inspired from [@janek26](https://github.com/janek26)'s [office-to-pdf](https://www.npmjs.com/package/office-to-pdf) package.

LibreOffice required and more specifically `soffice`. 
Test if the command `soffice` is available in your console or specify the command to run.


## Example:
```js
var toPdf = require("custom-soffice-to-pdf")
var fs = require("fs")
var wordBuffer = fs.readFileSync("./test.docx")

toPdf(wordBuffer).then(
  (pdfBuffer) => {
    fs.writeFileSync("./test.pdf", pdfBuffer)
  }, (err) => {
    console.log(err)
  }
)

```

in Node >v7 you can do (very pretty):

```js
import toPdf from 'custom-soffice-to-pdf'

var pdfBuffer = await toPdf(wordBuffer)

```

as you see toPdf just returns a promise


## Specify which command to use:

Just pass another argument with the command to run instead of `soffice`
```js
import toPdf from 'custom-soffice-to-pdf'

var pdfBuffer = await toPdf(wordBuffer, 'c:\Program Files\LibreOffice\program\soffice')

```