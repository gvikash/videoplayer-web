var express = require('express');
const fs = require('fs');
var path = require('path');
var rootDir = '/Users/vikashgupta/WebstormProjects'; // root directory
var excludes = ['node_modules', '.git', '.idea', 'docs', 'Downloads', 'Desktop', 'Applications', 'Documents']; // folders to exclude in listing
var pattern = /\w+(.mp4|.mkv|.webm|.webp|.avi)\b/i; // video format to show in listing









var pathArr = rootDir.split('/');
var rootFolder = pathArr[pathArr.length - 1];
pathArr.pop();
rootDir = pathArr.join('/');

String.prototype.trimRight = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";
  return this.replace(new RegExp("[" + charlist + "]+$"), "");
};
String.prototype.trimLeft = function(charlist) {
  if (charlist === undefined)
    charlist = "\s";

  return this.replace(new RegExp("^[" + charlist + "]+"), "");
};
String.prototype.trim = function(charlist) {
  return this.trimLeft(charlist).trimRight(charlist);
};

var app = express();


function isWhiteListed(path){
  return pattern.test(path);
}

function dirTree(relativePath, name) {
  if(/^\./.test(name)){ // excluding directories starting with .
    return;
  }
  if(excludes.indexOf(name) !== -1) return; // excluding directories
  var basePath = rootDir;

  var stats = fs.lstatSync(basePath + '/' + relativePath);

  var info = {
      path: relativePath,
      name: name
    };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(basePath + '/' + relativePath).map(function(child) {
      return dirTree(relativePath.trim('/') + '/' + child, child);
    });
    info.children = info.children.filter(function(element){
      return element !== null && element !== undefined;
    });
  } else {
    if(!isWhiteListed(relativePath)){ // allowing only media files
      return;
    }
    // Assuming it's a file. In real life it could be a symlink or
    // something else!
    info.type = "file";
  }

  return info;
}

var fileTree = dirTree(rootFolder, rootFolder);
console.log(fileTree);

var port = process.env.PORT || 5220;
var filesArr = [];

  // console.log('Fiels arr',filesArr)

app.use(express.static('public'));
app.use(express.static(rootDir));
app.set('views', 'src/views');
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('index', {title: 'Media Files Explorer', files: filesArr, tree: JSON.stringify(fileTree)});
});

app.listen(port, function(err) {
  console.log('Server running on port ', port);
});
