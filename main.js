const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(()=> console.log("Extraction operation complete"))
    .then(()=> IOhandler.readDir(pathUnzipped))
    // .then((data) => console.log("data",path.join(__dirname,"unzipped",data[2])))
    .then((files) => Promise.all([IOhandler.filterMyImage(path.join(__dirname,"unzipped",files[0]), pathProcessed + "/modified.png", "grayscale"), 
         /*IOhandler.grayScale(path.join(__dirname,"unzipped",files[1]), pathProcessed),
IOhandler.grayScale(path.join(__dirname,"unzipped",files[2]), pathProcessed)*/]))
    .then(() => console.log("All images done!"))
    .catch((err) => console.log("err", err))