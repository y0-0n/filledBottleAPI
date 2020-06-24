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

router.post('/total/', checkAuthed, function(req, res){
  let {keyword} = req.body;
  const name = keyword;
  connection.query(`SELECT count(*) as total
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'
                    ${name !== '' ? `AND A.name like '%${name}%'` : ``}`, function(err, rows) {
    if(err) throw err;

    console.log('POST /customer/total/ : ', rows);
    res.send(rows);
  });
});

router.post('/total/unset/', checkAuthed, function(req, res) {
  let {keyword} = req.body;
  const name = keyword;
  let sql = `SELECT count(*) as total
            FROM customer as A JOIN users as B ON A.user_id = B.id
            WHERE \`set\`=0
            AND B.id='${req.user.id}'
            ${(name !== '' ? `AND A.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /customer/total/unset/:state : ' + rows);
    res.send(rows);
  });
});

router.post('/list', checkAuthed, function(req, res){
  let {page, keyword} = req.body;
  const name = keyword;
  connection.query(`SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.address_detail as addressDetail, A.postcode as postcode, A.manager as manager, A.file_name 
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'
                    ${name !== '' ? `AND A.name LIKE '%${name}%'` : ``}
                    ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}`,
    function(err, rows) {
      if(err) throw err;

      console.log('GET /customer/:page/:name : ' + rows);
      res.send(rows);
    }
  );
});

router.post('/list/unset/', checkAuthed, function(req, res){
  let {page, keyword} = req.body;
  const name = keyword;
  connection.query(`SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.manager as manager, A.file_name
                    FROM customer as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=0
                    AND B.id = '${req.user.id}'
                    ${name !== '' ? `AND A.name = '${name}'` : ``}
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
	let {name, delegate, telephone, cellphone, keyword, set, transfer, postcode, address, addressDetail, manager, crNumber} = req.body;
  console.warn(req.body)
  connection.query(`INSERT INTO customer (\`name\`, \`delegate\`, \`telephone\`, \`cellphone\`, \`keyword\`, \`set\`, \`transfer\`, \`address\`, \`address_detail\`, \`postcode\`, \`manager\`, \`user_id\`, \`crNumber\`)
                  VALUES ('${name}', '${delegate}', '${telephone}', '${cellphone}', '${1}', '${1}', '${2}', '${address}', '${addressDetail}', '${postcode}', '${manager}', '${req.user.id}', '${crNumber}')`, function(err, rows) {
    if(err) throw err;
    
    console.log('POST /customer : ' + rows);

    res.send(rows);
  });
});

router.put('/modify/:id', checkAuthed, upload.none(), function(req, res){
  let {name, telephone, cellphone, address, addressDetail, postcode, crNumber} = req.body;
  
  connection.query(`UPDATE customer SET \`name\`='${name}', \`telephone\`='${telephone}', \`cellphone\`='${cellphone}', \`address\`='${address}', \`address_detail\`='${addressDetail}', \`postcode\`='${postcode}', \`crNumber\`='${crNumber}'
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