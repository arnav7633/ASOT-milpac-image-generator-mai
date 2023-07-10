const canvas = require("canvas");
const { createCanvas, loadImage } = canvas;
const fs = require("fs");
const { glob } = require("glob");
const medalJSON = require("../medals.json");
canvas.registerFont(require("@canvas-fonts/times-new-roman"), {
  family: "Times New Roman",
});


const main = async (data) => {
  try {
    const canvas = createCanvas(1398, 1000);
    const ctx = canvas.getContext("2d");
    if (data.Uniform == "Brown") {
      const image = await loadImage(__dirname + "/../base-brown-uni.png");
      ctx.drawImage(image, 0, 0, 1398, 1000);

      //rank
      if (data.rank) {
        let rank;
        //check the old ranks
        if (fs.existsSync(__dirname + `/../imge/Rank/${data.rank}.png`)) {
          rank = await loadImage(__dirname + `/../imge/Rank/${data.rank}.png`);
        }

        //check new six's ranks
        if (
          fs.existsSync(
            __dirname +
              `/../imge/Rank/Six_s New Officer Ranks Army/${data.rank}.png`
          )
        ) {
          rank = await loadImage(
            __dirname +
              `/../imge/Rank/Six_s New Officer Ranks Army/${data.rank}.png`
          );
        }
        if (!rank) return console.log("Rank not found");
        ctx.drawImage(rank, 0, 0, 1398, 1000);
      }
    }

    //Airforce
    if (data.Uniform == "Blue") {
      const image = await loadImage(__dirname + "/../blue_base_uni.png");
      ctx.drawImage(image, 0, 0, 1398, 1000);

      const rank = await loadImage(
        __dirname + `/../imge/Rank/${data.rank}.png`
      );
      ctx.drawImage(rank, 0, 0, 1398, 1000);
    }

    //UNIVERSAL STUFF
    //RifleMan Badge

    if (data.RifleManBadge) {
      const RifleManBadge = await loadImage(
        __dirname + `/../imge/Embellishments/${data.RifleManBadge}.png`
      );

      ctx.drawImage(RifleManBadge, 0, 0, 1398, 1000);
    }
    //draw ./imge/Embelishments/Name tag.png
    // const image2 = await loadImage(
    // __dirname + "/../imge/Embellishments/Name Tag.png"
    //);
    //  ctx.drawImage(image2, 351, 477, 210, 57);
    //write name on image2
    ctx.font = "bold 20px Times New Roman";
    //text should be white in colour
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    let size = ctx.measureText(data.name).width;
    let counter = 0;
    while (size > 120) {
      counter++;
      console.log(20 - counter);
      ctx.font = `bold ${20 - counter}px Times New Roman`;
      size = ctx.measureText(data.name).width;
    }
    ctx.fillText(data.name, 475, 512);
    //corp badge
    const corpbadge = await loadImage(
      __dirname + `/../imge/Corps/Corps Badges/${data.badge}.png`
    );
    ctx.drawImage(corpbadge, 0, 0, 1398, 1000);

    //Training medals
    if (data.TrainingMedals) {
      //read a nested directory and its sub directories and files
      //scan imge/Training Medals and all the folders inside it
      const medals = await glob(
        __dirname + "/../imge/Training Badges/**/*.png",
        {
          absolute: true,
        }
      ).catch((err) => console.log(err));
      for (const earnedMedal of data.TrainingMedals) {
        // if(earnedMedal == "FO" || earnedMedal == "")
        const names = medals.map((medal) => medal.split("\\").pop());
        // console.log(names);
        if (!names.includes(`${earnedMedal}.png`)) {
          console.log(earnedMedal);
          return console.log("Medal not found");
        }
        //load the medal with the path from medals array
        const medal = await loadImage(
          medals[names.indexOf(`${earnedMedal}.png`)]
        );
        ctx.drawImage(medal, 0, 0, 1398, 1000);
      }
    }

    if (data.citations) {
      const rightEndFirstLineX = 806;
      const EndLine2Y = 511;
      const leftEndFirstLine2X = 1000;
      const firstLineMedals = medalJSON.first_line.filter((x) =>
        data.citations.includes(x)
      );
      const secondLineMedals = medalJSON.second_line.filter((x) =>
        data.citations.includes(x)
      );
      const thirdLineMedals = medalJSON.third_line.filter((x) =>
        data.citations.includes(x)
      );
      const fourthLineMedals = medalJSON.fourth_line.filter((x) =>
        data.citations.includes(x)
      );
      const fifthLineMedals = medalJSON.fifth_line.filter((x) =>
        data.citations.includes(x)
      );
      const sixthLineMedals = medalJSON.sixth_line.filter((x) =>
        data.citations.includes(x)
      );
      const seventhLineMedals = medalJSON.seventh_line.filter((x) =>
        data.citations.includes(x)
      );
      const eighthLineMedals = medalJSON.eighth_line.filter((x) =>
        data.citations.includes(x)
      );

      let medals = [
        firstLineMedals,
        secondLineMedals,
        thirdLineMedals,
        fourthLineMedals,
        fifthLineMedals,
        sixthLineMedals,
        seventhLineMedals,
        eighthLineMedals,
      ];
      //   console.log(medals);
      //if a line is empty remove it
      medals = medals.filter((x) => x.length != 0);
      let counter = 0;
      //console.log(medals);
      for (const [index, row] of medals.entries()) {
        let corner;
        //bottom 2 lines accomodate 4 medals
        if (index == 1 || index == 0 || index == 2) {
          corner = leftEndFirstLine2X - (4 - row.length) * 32;
          //if current line has less than 4 medals move the medals from the last element of the next line to the current line untill 4 medals are reached
          if (medals[index + 1]) {
            //    console.log(row.length, medals[index + 1]);
            let count = 1;
            while (row.length < 4) {
              //  console.log(row);
              //move the medals from the next row to the current row
              //if the next row becomes empty move the elments from the next to next row
              //if the next to next row becomes empty move the elements from the next to next to next row
              //and so on
              if (!medals[index + count]) break;
              if (medals[index + count]?.length == 0) {
                count++;
                continue;
              }
              if (count > 6) break;
              row.push(medals[index + count].pop());
            }
            corner = leftEndFirstLine2X - (4 - row.length) * 32;
          }
        }
        // console.log(row, index);
        if (index == 3 || index == 4) {
          corner = leftEndFirstLine2X - (3 - row.length) * 32;
          if (medals[index + 1]) {
            let count = 1;
            while (row.length < 3) {
              //  console.log(row);
              //move the medals from the next row to the current row
              //if the next row becomes empty move the elments from the next to next row
              //if the next to next row becomes empty move the elements from the next to next to next row
              //and so on
              if (!medals[index + count]) break;
              if (medals[index + count]?.length == 0) {
                count++;
                continue;
              }
              if (count > 6) break;
              row.push(medals[index + count].pop());
            }
            corner = leftEndFirstLine2X - (3 - row.length) * 32;
          }
        }
        if (index == 5 || index == 6) {
          // console.log("line 5 and 6" + row.length)
          corner = leftEndFirstLine2X - (2 - row.length) * 32;
          console.log(corner, row);
          if (medals[index + 1]) {
            let count = 1;
            while (row.length < 2) {
              //  console.log(row);
              //move the medals from the next row to the current row
              //if the next row becomes empty move the elments from the next to next row
              //if the next to next row becomes empty move the elements from the next to next to next row
              //and so on
              if (!medals[index + count]) break;
              if (medals[index + count]?.length == 0) {
                count++;
                continue;
              }
              if (count > 6) break;
              row.push(medals[index + count].pop());
            }
            corner = leftEndFirstLine2X - (2 - row.length) * 32;
          }
        }
        if (index == 7) {
          corner = leftEndFirstLine2X;
        }
        //  console.log(corner);
        for (const [index1, singularMedal] of row.entries()) {
          //    console.log(singularMedal);
          counter++;
          const medal = await loadImage(
            __dirname + `/../imge/Ribbons/${singularMedal}.png`
          );
          ctx.drawImage(
            medal,
            corner - index1 * 64,
            EndLine2Y - index * 20,
            64,
            20
          );
        }
      }
      if (data.Uniform != "Brown" && data.Uniform != "Blue")
        throw new Error("Invalid uniform");
      if (data.Uniform == "Brown") {
        const collar = await loadImage(__dirname + "/../imge/brown_collar.png");
        ctx.drawImage(collar, 0, 0, 1398, 1000);
      }
      if (data.Uniform == "Blue") {
        const collar = await loadImage(__dirname + "/../imge/blue_collar.png");
        ctx.drawImage(collar, 0, 0, 1398, 1000);
      }
    }

    // export image as member name
    console.log("exporting image");
    const fileName = data.name + ".png"; // Create the file name
    const filePath = __dirname + "/../milpac/" + fileName; // Set the file path
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(filePath, buffer);
    //export image as output
    console.log("exporting image");
    //fs.writeFileSync(__dirname + "/../output.png", buffer);
  } catch (err) {
    throw new Error(err);
  }
};
module.exports = main;
