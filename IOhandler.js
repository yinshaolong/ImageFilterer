/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */



const unzipper = require("unzipper"),
  fs = require("fs").promises,
  { createReadStream, createWriteStream, readdir } = require("fs"), 
  PNG = require("pngjs").PNG,
  path = require("path"),
  AdmZip = require("adm-zip"),
  { pipeline, Transform } = require("stream");

  const grayscaleHelper = function(i) {
  const gray = ( this.data[i] +  this.data[i+1] +  this.data[i+2]) / 3
  this.data[i] = gray;
  this.data[i + 1] = gray;
  this.data[i + 2] = gray;
}
  

  const filters = {
  grayscale: grayscaleHelper
}
   

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */


const unzip = (pathIn, pathOut) => {
  // return createReadStream(pathIn).pipe(unzipper.Extract({path: pathOut})).promise()
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut, true);
    resolve()
    })
};



/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
*
* @param {string} path
* @return {promise}
*/
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    readdir(dir, (err, files) => {
      if(err)
      reject(err);
    else
        resolve(files.filter((file)=> path.extname(file) === ".png"))
    })
  })
};



const errorHandler = (err) => {
  if (err) {
    console.log(err);
  }
};



const filterStream = function(imageFilter) {
   for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let i = (this.width * y + x) << 2;
        filters[imageFilter].call(this, i);
      }
    }
      this.pack();
  }

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
*
* @param {string} filePath
* @param {string} pathProcessed
* @return {promise}
*/

const filterMyImage = (pathIn, pathOut, filterKind) => {
  return new Promise((resolve, reject) => resolve(
    pipeline(createReadStream(pathIn), new PNG().on("parsed", function() { filterStream.call(this, filterKind)}), createWriteStream(pathOut), errorHandler)))
};

module.exports = {
  unzip,
  readDir,
  filterMyImage,
};


// const unzipStream = (file) => new Transform({
//   transform(chunk, encoding, callback) {
//     zip.addFile(file, chunk);
//     callback();
//   },
//   flush(callback) {
//     const zipEntries = zip.getEntries();
//     for (const entry of zipEntries) {
//       const fileContent = entry.getData();
//       this.push(fileContent);
//     }
//     callback();
//   },
// });