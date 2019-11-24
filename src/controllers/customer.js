'use strict';
const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;
const upload = require("../modules/fileUploadCustomer");

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "http://cosimo.iptime.org:3000");
    
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.get('/', checkAuthed, function(req, res){
  connection.query(`SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.manager as manager, A.file_name 
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'`,
    function(err, rows) {
      if(err) throw err;

      console.log('GET /customer : ' + rows);
      res.send(rows);
    }
  );
});

router.get('/unset', checkAuthed, function(req, res){
  connection.query(`SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.manager as manager, A.file_name
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=0
                    AND B.id = '${req.user.id}'`,
    function(err, rows) {
      if(err) throw err;

      console.log('GET /customer/unset : ' + rows);
      res.send(rows);
    }
  );
});

router.get('/:id', checkAuthed, function(req, res){
  var id = req.params.id; // 거래처 이름

  connection.query(`SELECT * from customer
    WHERE id = ${id}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /customer/'+id+' : ' + rows);
    res.send(rows);
  });
});

router.get('/search/:keyword', checkAuthed, function(req, res){
  let {keyword} = req.params; // 검색어로 검색
  connection.query(`SELECT * from customer WHERE name = "${keyword}"
    AND \`set\` = 1`, function(err, rows) {
    if(err) throw err;
    console.log('GET /customer/search : ' + rows);

    res.send(rows);
  });
});

router.put('/', checkAuthed, function(req, res){
  connection.query("UPDATE customer SET \`set\`=1 WHERE `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('PUT /customer : ' + rows);
    res.send(rows);
  });
});


router.post('/', checkAuthed, upload.single('file'), (req, res) => {
  let {name, delegate, telephone, cellphone, keyword, set, transfer, address, manager} = req.body;
  let fileName = req.file ? 'customer/'+req.file.filename : '318x180.svg';
  connection.query(`INSERT INTO customer (\`name\`, \`delegate\`, \`telephone\`, \`cellphone\`, \`keyword\`, \`set\`, \`transfer\`, \`address\`, \`manager\`, \`file_name\`, \`user_id\`)
                  VALUES ('${name}', '${delegate}', '${telephone}', '${cellphone}', '${1}', '${1}', '${2}', '${address}', '${manager}', '${fileName}', '${req.user.id}')`, function(err, rows) {
    if(err) throw err;
    
    console.log('POST /customer : ' + rows);

    res.send(rows);
  });
});

router.delete('/', checkAuthed, function(req, res){
  connection.query("UPDATE customer SET \`set\`=0 WHERE `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('DELETE /customer : ' + rows);
    res.send(rows);
  });
});

module.exports = router;