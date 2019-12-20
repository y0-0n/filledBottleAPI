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

router.get('/total/:name', checkAuthed, function(req, res){
  let {page, name} = req.params;
  connection.query(`SELECT count(*) as total
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'
                    ${name !== 'a' ? `AND A.name = '${name}'` : ``}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /customer/total/:name : ' + rows);
    res.send(rows);
  });
});

router.get('/total/unset/:name', checkAuthed, function(req, res) {
  let {name} = req.params;
  let sql = `SELECT count(*) as total
            FROM customer as A JOIN users as B ON A.user_id = B.id
            WHERE \`set\`=0
            AND B.id='${req.user.id}'
            ${(name !== 'a' ? `AND A.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /customer/total/unset/:state : ' + rows);
    res.send(rows);
  });
});

router.get('/:page/:name', checkAuthed, function(req, res){
  let {page, name} = req.params;
  connection.query(`SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.manager as manager, A.file_name 
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'
                    ${name !== 'a' ? `AND A.name = '${name}'` : ``}
                    ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`,
    function(err, rows) {
      if(err) throw err;

      console.log('GET /customer/:page/:name : ' + rows);
      res.send(rows);
    }
  );
});

router.get('/unset/:page/:name', checkAuthed, function(req, res){
  let {page, name} = req.params;
  connection.query(`SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.manager as manager, A.file_name
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=0
                    AND B.id = '${req.user.id}'
                    ${name !== 'a' ? `AND A.name = '${name}'` : ``}
                    ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /customer/unset/:page/:name : ' + rows);
    res.send(rows);
  });
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

router.post('/', checkAuthed, upload.none(), (req, res) => {
  let {name, delegate, telephone, cellphone, keyword, set, transfer, address, manager} = req.body;
  connection.query(`INSERT INTO customer (\`name\`, \`delegate\`, \`telephone\`, \`cellphone\`, \`keyword\`, \`set\`, \`transfer\`, \`address\`, \`manager\`, \`user_id\`)
                  VALUES ('${name}', '${delegate}', '${telephone}', '${cellphone}', '${1}', '${1}', '${2}', '${address}', '${manager}', '${req.user.id}')`, function(err, rows) {
    if(err) throw err;
    
    console.log('POST /customer : ' + rows);

    res.send(rows);
  });
});

router.put('/modify/:id', checkAuthed, upload.none(), function(req, res){
  let {name, telephone, cellphone, address} = req.body;
  
  connection.query(`UPDATE customer SET \`name\`='${name}', \`telephone\`='${telephone}', \`cellphone\`='${cellphone}', \`address\`='${address}'
                    WHERE \`id\`="${req.params.id}";`, function(err, rows) {
    if(err) throw err;

    console.log('PUT /customer : ' + rows);
    res.send(rows);
  });
});

router.put('/activate', checkAuthed, function(req, res){
  connection.query("UPDATE customer SET \`set\`=1 WHERE `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('PUT /customer : ' + rows);
    res.send(rows);
  });
});

router.put('/deactivate', checkAuthed, function(req, res){
  connection.query("UPDATE customer SET \`set\`=0 WHERE `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('DELETE /customer : ' + rows);
    res.send(rows);
  });
});

module.exports = router;