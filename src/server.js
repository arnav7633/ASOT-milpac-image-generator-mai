const fs = require("fs");
const express = require("express");
const app = express();
const port = 42069;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const imageGenerator = require("./index.js");
const path = require("path");
const certGenerator = require("./cert");
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
app.post("/create-cert", jsonParser, async (req, res) => {
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
    "group-captain": 16,
  };
  const slide = SlideNumbers[data.cert];
  await certGenerator(data);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  res
    .status(200)
    .sendFile(path.resolve(__dirname + `/../certs/output${slide - 1}.png`));
  console.log(path.resolve(__dirname, "/../certs/"));
  await new Promise((resolve) => setTimeout(resolve, 5000));
  fs.copyFileSync(
    path.resolve(__dirname + `/../certs/output${slide - 1}.png`),
    path.resolve(__dirname + `/../certificates/${data.name} - ${data.cert}.png`)
  );
  fs.rmSync(path.resolve(__dirname + "/../certs/"), {
    recursive: true,
    force: true,
  });
});
app.get("/certificates", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/certificate.html"));
});
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
