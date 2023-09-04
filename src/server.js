const express = require("express");
const app = express();
const port = 42069;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const imageGenerator = require("./index.js");
const path = require("path");
const certGenerator = require("./cert");
const fs = require("fs");
const generate_box = require("./box.js");
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/index.html"));
});
app.get("/certificates", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/certificate.html"));
});
app.post("/update", jsonParser, async (req, res) => {
  let data = req.body;
  console.log(data);
  let errored = false;
  if (!data) return res.sendStatus(400);
  console.log(data.RifleManBadge != "PTE(P)");
  //  if(!data.RifleManBadge || data.RifleManBadge != "PTE" & data.RifleManBadge != "PTE(P)") return res.status(400).send("No Rifleman Badge, or invalid badge");
  //  if(!data.rank) return res.status(400).send("No rank");
  if (!data.Uniform) return res.status(400).send("No uniform");
  if (!data.name) return res.status(400).send("No name");
  if (data.RifleManBadge)
    data.RifleManBadge =
      data.RifleManBadge === "PTE(P)" ? "Master Rifleman" : "Rifleman";
  await imageGenerator(data).catch((err) => {
    console.log("error caught");
    errored = true;
    console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  });
  if (errored) return;
  console.log("err");
  console.log(__dirname);
  res
    .status(200)
    .sendFile(path.resolve(__dirname + `/../milpac/${data.name}.png`));
});
app.post("/create-cert", async (req, res) => {
  let data = req.body;
  console.log(data);
  let errored = false;
  if (!data) return res.sendStatus(400);
  const SlideNumbers = {
    reenlist: 1,
    ltcol: 2,
    major: 3,
    captain: 4,
    lieutenant: 5,
    "wing-commander": 6,
    "squadron-leader": 7,
    flt: 8,
    wo1: 9,
    wo2: 10,
    sgt: 11,
    cpl: 12,
    lcpl: 13,
    pte: 14,
    enlist: 15,
    "group-captain":16,
  };
  const slide = SlideNumbers[date.cert];
  await certGenerator(date);
});
app.get("/get-medals", (req, res) => {
  res.send({
    files: fs.readdirSync(__dirname + "/../medal-box-images/medals"),
  });
});
app.get("/box", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/box.html"));
});
app.post("/generate-box", jsonParser, async (req, res) => {
  let data = req.body;
  console.log(data);
  let errored = false;
  if (!data) return res.sendStatus(400);
  await generate_box(data);
  res
    .status(200)
    .sendFile(
      path.resolve(__dirname + `/../medal-box-images/boxes/${data.name}.png`)
    );
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});