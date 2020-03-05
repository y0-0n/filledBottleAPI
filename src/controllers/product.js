'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;
const upload = require("../modules/fileUploadProduct");
const Plant = require('../models/Plant');

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

router.post('/total/', checkAuthed, function(req, res) {
	let {name, family, category} = req.body;
  let sql = `SELECT count(*) as total
		FROM product as A JOIN users as B ON A.user_id = B.id
		LEFT JOIN productFamily_user as FU ON A.family = FU.family_id
		LEFT JOIN productFamily as F ON F.id = FU.family_id
		WHERE \`set\`=1
		AND B.id = '${req.user.id}'
		${family !== 0 ? `AND A.family = '${family}'` : ``}
		${name !== '' ? `AND A.name = '${name}'` : ``}
		${category !== 0 ? `AND F.category = '${category}'` : ``}
		ORDER BY A.date DESC;`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/total/:state : ' + rows);
    res.send(rows);
  });
});

router.post('/total/unset/', checkAuthed, function(req, res) {
  let {name, family} = req.body;
  let sql = `SELECT count(*) as total
            FROM product as A JOIN users as B ON A.user_id = B.id
            WHERE \`set\`=0
            ${family !== 0 ? `AND A.family = '${family}'` : ``}
            AND B.id='${req.user.id}'
            ${(name !== 'a' ? `AND A.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/total/unset/:state : ' + rows);
    res.send(rows);
  });
});

router.post('/list', checkAuthed, function(req, res){
  let {page, name, family, category} = req.body;
  connection.query(`SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name, F.\`name\` as familyName
                    FROM product as A JOIN users as B ON A.user_id = B.id
										LEFT JOIN productFamily_user as FU ON A.family = FU.family_id
										LEFT JOIN productFamily as F ON F.id = FU.family_id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'
                    ${family !== 0 ? `AND A.family = '${family}'` : ``}
										${name !== '' ? `AND A.name = '${name}'` : ``}
										${category !== 0 ? `AND F.category = '${category}'` : ``}
                    ORDER BY A.date DESC
                    ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/:page/:name : ' + rows);
    res.send(rows);
  });
});

router.post('/list/unset/', checkAuthed, function(req, res){
  let {page, name, family} = req.body;

  connection.query(`SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name
                    FROM product as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=0
                    ${family !== 0 ? `AND A.family = '${family}'` : ``}
                    AND B.id = '${req.user.id}'
                    ${name !== '' ? `AND A.name = '${name}'` : ``}
                    ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/:page/:name : ' + rows);
    res.send(rows);
  });
});

router.get('/:id', checkAuthed, function(req, res) {
  let id = req.params.id; // id로 검색

  connection.query(`SELECT P.*, F.\`name\` as familyName
                    FROM product as P LEFT JOIN productFamily as F ON P.family = F.id
                    WHERE P.id = ${id}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/'+id+' : ' + rows);
    res.send(rows);
  });
});

router.post('/', checkAuthed, upload.single('file'), (req, res) => {
  let {name, price, grade, weight, productFamily} = req.body;
  let fileName = req.file ? 'product/'+req.file.filename : '318x180.svg';
  connection.query(`INSERT INTO \`product\` (\`name\`, \`grade\`, \`barcode\`, \`price_receiving\`, \`price_shipping\`, \`weight\`, \`safety_stock\`, \`file_name\`, \`user_id\`, \`family\`)
                    VALUES ('${name}', '${grade}', '4', '5', '${price}', '${weight}', '8', '${fileName}', "${req.user.id}", ${productFamily});`, function(err, rows) {
    if(err) throw err;

    console.log('POST /product : ' + rows);

    const product_id = rows.insertId;
		Plant.getList(req.user, (err, msg) => {
			if(err) throw err;
			let sql = '';
			msg.map((e,i) => {
				sql+=`INSERT INTO stock (\`product_id\`, \`quantity\`, \`plant_id\`) VALUES ('${product_id}', '${0}', '${e.id}'); `
				console.warn(sql)
			})
			//sql = `INSERT INTO stock (\`product_id\`, \`quantity\`) VALUES ('${product_id}', '${0}');`
			connection.query(sql, function(err_, rows_) {
				if(err_) throw err_;
				console.log('stock '+rows_);
				res.send(rows);
			});
		});
  })
});

router.put('/activate', checkAuthed, function(req, res){
  connection.query(`UPDATE product SET \`set\`=1 WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('PUT /product : ' + rows);

    res.send(rows);
  });
});

router.put('/deactivate', checkAuthed, function(req, res){
  connection.query(`UPDATE product SET \`set\`=0 WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('DELETE /product : ', rows);
    res.send(rows);
  });
});

router.put('/modify/:id', checkAuthed, upload.none(), function(req, res) {
	console.log(`UPDATE product SET \`name\`='${req.body.name}', \`grade\`='${req.body.grade}', \`weight\`='${req.body.weight}', \`price_shipping\`='${req.body.price}', \`family\`=${req.body.productFamily} WHERE \`id\`=${req.params.id};`)
  connection.query(`UPDATE product SET \`name\`='${req.body.name}', \`grade\`='${req.body.grade}', \`weight\`='${req.body.weight}', \`price_shipping\`='${req.body.price}', \`family\`=${req.body.productFamily} WHERE \`id\`=${req.params.id};`, function(err, rows) {
    if(err) throw err;

    console.log('PUT /product/modify/:id : ', rows);
    res.send(rows);
  });
})

module.exports = router;