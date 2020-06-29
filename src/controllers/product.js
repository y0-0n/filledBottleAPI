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
	let {name, family, category, state} = req.body;
  let sql = `SELECT count(*) as total
		FROM product as A JOIN users as B ON A.user_id = B.id
		LEFT JOIN productFamily as F ON F.id = A.family
		WHERE \`set\`=1
		AND B.id = '${req.user.id}'
		${family !== 0 ? `AND A.family = '${family}'` : ``}
		${name !== '' ? `AND A.name LIKE '%${name}%'` : ``}
		${category !== 0 ? `AND F.category = '${category}'` : ``}
		${state !== 0 ? `AND A.state = '${state}'` : ``}
		;`
  connection.query(sql, function(err, rows) {
    if(err) throw err;
    console.log('GET /product/total/:state : ', rows);
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
	let {page, name, family, category, state} = req.body;
  connection.query(`SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name, F.\`name\` as familyName, state, IFNULL(sum(S.quantity), 0) as stock
		FROM product as A JOIN users as B ON A.user_id = B.id
    LEFT JOIN productFamily as F ON F.id = A.family
    LEFT JOIN stock as S ON A.id = S.product_id
		WHERE \`set\`=1
		AND B.id = '${req.user.id}'
		${family !== 0 ? `AND A.family = '${family}'` : ``}
		${name !== '' ? `AND A.name LIKE '%${name}%'` : ``}
		${category !== 0 ? `AND F.category = '${category}'` : ``}
		${state !== 0 ? `AND A.state = '${state}'` : ``}
    GROUP BY A.id
    ORDER BY A.date DESC
    ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}
    ;`, function(err, rows) {
		if(err) throw err;
    // console.log('POST /product/list : ', rows);
    res.send(rows);
  });
});

router.post('/list/unset/', checkAuthed, function(req, res){
  let {page, name, family, category} = req.body;
	console.warn(req.body)

  connection.query(`SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name, F.\`name\` as familyName
										FROM product as A JOIN users as B ON A.user_id = B.id
										LEFT JOIN productFamily_user as FU ON A.family = FU.family_id
										LEFT JOIN productFamily as F ON F.id = FU.family_id								
										WHERE \`set\`=0
                    ${family !== 0 ? `AND A.family = '${family}'` : ``}
                    AND B.id = '${req.user.id}'
										${name !== '' ? `AND A.name = '${name}'` : ``}
										${category !== 0 ? `AND F.category = '${category}'` : ``}
										${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}
										`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/:page/:name : ' + rows);
    res.send(rows);
  });
});

router.get('/:id', checkAuthed, function(req, res) {
  let id = req.params.id; // id로 검색

  connection.query(`SELECT P.*, F.\`name\` as familyName, FC.\`name\` as categoryName, FC.\`id\` as categoryId
    FROM product as P LEFT JOIN productFamily as F ON P.family = F.id
    LEFT JOIN familyCategory as FC ON FC.id = F.category
    WHERE P.id = ${id}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/'+id+' : ' + rows);
    res.send(rows);
  });
});

router.post('/', checkAuthed, upload.fields([{name: 'file'}, {name: 'file_detail'}]), (req, res) => {
  let {name, price, grade, weight, productFamily, discount_price, state, vat} = req.body;
	let fileName = 'noimage.jfif';
	if(req.files.file)
		 fileName = 'product/'+req.files.file[0].filename; // 대표 이미지
	let detailFileName = ''; // 상세 이미지
	// console.warn(req.files)
	if(req.files.file_detail) {
		req.files.file_detail.map((e, i) => {
			detailFileName += 'productDetail/'+e.filename+'|'; // 대표 이미지
		})
		detailFileName = detailFileName.slice(0, -1);
	}
  connection.query(`INSERT INTO \`product\` (\`name\`, \`grade\`, \`barcode\`, \`price_receiving\`, \`price_shipping\`, \`discount_price\`, \`weight\`, \`safety_stock\`, \`file_name\`, \`detail_file\`, \`user_id\`, \`family\`, \`state\`, \`tax\`)
                    VALUES ('${name}', '${grade}', '4', '5', '${price}', '${discount_price}', '${weight}', '8', '${fileName}', '${detailFileName}', "${req.user.id}", ${productFamily}, ${state}, ${vat});`, function(err, rows) {
    if(err) throw err;

    console.log('POST /product : ', rows);
		res.send(rows);
		// 품목 등록시 재고 0으로 채우기
    // const product_id = rows.insertId;
		// Plant.getList(req.user, (err, msg) => {
		// 	if(err) throw err;
		// 	let sql = '';
		// 	msg.map((e,i) => {
		// 		sql+=`INSERT INTO stock (\`product_id\`, \`quantity\`, \`plant_id\`) VALUES ('${product_id}', '${0}', '${e.id}'); `
		// 	})
		// 	//sql = `INSERT INTO stock (\`product_id\`, \`quantity\`) VALUES ('${product_id}', '${0}');`
		// 	connection.query(sql, function(err_, rows_) {
		// 		if(err_) throw err_;
		// 		console.log('stock '+rows_);
		// 		res.send(rows);
		// 	});
		// });
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

router.put('/modify/:id', checkAuthed, upload.fields([{name: 'file'}, {name: 'file_detail'}]), function(req, res) {
  const { name, price, productFamily, discount_price, state } = req.body;
  let fileName = 'noimage.jfif';
  // console.warn(req.body)
	if(req.files.file)
    fileName = 'product/'+req.files.file[0].filename; // 대표 이미지
	let detailFileName = ''; // 상세 이미지
	if(req.files.file_detail) {
		req.files.file_detail.map((e, i) => {
			detailFileName += 'productDetail/'+e.filename+'|'; // 대표 이미지
		})
		detailFileName = detailFileName.slice(0, -1);
  }
  connection.query(`UPDATE product SET \`name\`='${name}', \`price_shipping\`='${price}', \`discount_price\`='${discount_price}', \`family\` ='${productFamily}', \`state\` = '${state}', \`file_name\`='${fileName}', \`detail_file\`='${detailFileName}' WHERE \`id\`=${req.params.id};`, function(err, rows) {
    if(err) throw err;

    console.log('PUT /product/modify/:id : ', rows);
    res.send(rows);
  });
})

module.exports = router;