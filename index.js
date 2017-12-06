var express = require('express');
const directoryPath = './media';
const fs = require('fs');

var app = express();

var port = process.env.PORT || 5220;
var filesArr = [];
fs.readdirSync(directoryPath).forEach(function(file){
  if( file.toLowerCase().indexOf('.mp4') > 0 || file.toLowerCase().indexOf('.avi') > 0 || file.toLowerCase().indexOf('.webp') > 0 || file.toLowerCase().indexOf('.webm') > 0 || file.toLowerCase().indexOf('.mkv') > 0 ){
    filesArr.push({path: '/' + file, name: file.replace(/\.[^/.]+$/, "")});
  }
});

app.use(express.static('public'));
app.use(express.static(directoryPath));
app.set('views', 'src/views');
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('index', {title: 'Media Files Explorer', files: filesArr});
});

app.listen(port, function(err) {
  console.log('Server running on port ', port);
});
