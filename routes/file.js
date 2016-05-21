var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var multer - require('multer');
var path = require('path');
var fs = require('fs');

var connection = mysql.createConnection({
  host : 'user_host',
  user : 'user_name',
  password : 'user_pw',
  database : 'user_Db'
});


var _storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + "." + file.originalname.split('.').pop());
  }
});

var upload = multer({storage : _storage});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fileup', function (error, content){
    if (!error){
      res.end(content);
    }
    else{
      res.writeHead(501, {'Content-Type' : 'text/plain'});
      res.end("Error while reading a file");
    }
  });
});

router.post('/upload', upload.single('userPhoto'),function (req, res) {
  var filename = req.file.filename;
  var path = req.file.path;
  console.log(path);

  connection.query('insert into file(filename, path) values(?,?);', [filename, path], function(error, info){
    if (error != undefined)
      res.sendStatus(503);
    else
      res.redirect('/'+info.inserId);
  });
  console.log(filename);
});

router.get('/:file_id', function(req, res, next){
  connection.query('select * from file where id = ?;', [req.params.file_id], function (error, cursor){
    if (error != undefined)
      res.sendStatus(503);
    else{
      if (cursor.length == undefined || cursor.length <1)
        res.sendStatus(404);
      else
        res.json(cursor[0]);
    }
  });
});

router.get('/upload/:file_name', function(req, res, next){
  connection.query('select * from file where filename = ?;', [req.params.file_name], function (error, cursor){
    if (error != undefined)
      res.sendStatus(503);
    else{
      if (cursor.length == undefined || cursor.length <1)
        res.sendStatus(404);
      else
        res.sendFile(path.join(__dirname, '../', cursor[0].paht));
    }
  });
});



module.exports = router;
