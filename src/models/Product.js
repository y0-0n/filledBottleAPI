'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getFamilyId = async (user, data, callback) => {
  try{
    const {productId} = data;
    const query = `SELECT PF.id as id from product as P
      JOIN productFamily_user as PF ON P.family = PF.family_id
      WHERE P.company_id = ?
      AND P.id = ${productId}`
    const [rows, field] = await pool.query(query, [user.company_id]);
    console.log('getFamilyId');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getFamilyId error',error);
  }
}

module.exports.getList = async (user, callback) => { //영헌) 안쓰임.
  try{
    const query = `SELECT * from product
      WHERE company_id = ?
      AND \`set\`=1`;
    const [rows, field] = await pool.query(query, [user.company_id]);
    console.log('getList');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getList error',error);
  }
}

module.exports.getOpenList = async (user, callback) => {
  try{
    const query = `SELECT * from product
    WHERE \`set\`=1
    AND state = 1
    ${user !== "all" ? "AND company_id = ?" : ""}
    `;
    const [rows, field] = await pool.query(query, [user]);
    console.log('getOpenList');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getOpenList error',error);
  }
}

module.exports.getOpenDetail = async (productId, callback) => {
  try{
    const query = `SELECT * from product
      WHERE id=${productId}`;
    const [rows, field] = await pool.query(query);
    console.log('getOpenDetail');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getOpenDetail error',error);
  }
}

module.exports.getAllFamily = async (data, callback) => {
  try{
    const query = `SELECT F.name, F.id FROM productFamily as F WHERE F.category = ${data}`;
    const [rows, field] = await pool.query(query);
    console.log('getAllFamily');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getAllFamily error',error);
  }
}

module.exports.getFamilyCategory = async (user, callback) => { //영헌) user 안쓰임
  try{
    const query = `SELECT * FROM familyCategory`;
    const [rows, field] = await pool.query(query);
    console.log('getFamilyCategory');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getFamilyCategory error',error);
  }
}

//회원이 취급하는 대분류 리스트 주기
module.exports.getUserFamilyCategory = async (user, callback) => {
  try{
    const query = `SELECT DISTINCT FC.name as name, FC.id as id FROM product AS P
    JOIN productFamily as F ON P.family = F.id
    JOIN familyCategory AS FC ON FC.id = F.category
    WHERE company_id = ?`;
    const [rows, field] = await pool.query(query, [user.company_id]);
    console.log('getUserFamilyCategory');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getUserFamilyCategory error',error);
  }
}

//회원이 취급하는 품목군 리스트 주기
module.exports.getFamilyList = async (user, data, callback) => {
  try{
    const {categoryId} = data;
    const query = `SELECT DISTINCT F.name as name, F.id as id FROM product AS P
    JOIN productFamily as F ON P.family = F.id
    WHERE company_id = ?
		${categoryId !== '0' ? `AND F.category = ${categoryId}`: ``};
		`;
    const [rows, field] = await pool.query(query, [user.company_id]);
    console.log('getFamilyList');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getFamilyList error',error);
  }
}

//회원이 취급하는 품목군 리스트 주기
module.exports.getStateCount = async (user, callback) => {
  try{
    const query = `SELECT COUNT(*) as count, state FROM product
      WHERE company_id = ?
      AND \`set\` = 1
      GROUP BY state`;
    const [rows, field] = await pool.query(query, [user.company_id]);
    console.log('getStateCount');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getStateCount error',error);
  }
}

//창고에서 취급하는 품목군 주기
module.exports.familyInPlant = async (user, plantId, callback) => {
  try{
    const query = `SELECT FIP.*, PFU.family_id as family, PF.name FROM familyInPlant as FIP
      JOIN productFamily_user as PFU ON FIP.family_id = PFU.id
      JOIN productFamily as PF ON PF.id = PFU.family_id
      WHERE plant_id = ?`;
    const [rows, field] = await pool.query(query, [plantId]);
    console.log('familyInPlant');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('familyInPlant error',error);
  }
}

module.exports.modifyFamily = async (user, data, callback) => { //영헌) productFamily_user 여전히 user_id
  try{
    let insert_query = ``;
		data.addFamilyList.map((e, i) => {
			insert_query += `INSERT INTO productFamily_user (\`family_id\`, \`user_id\`) VALUES ('${e.id}', '${user.company_id}');`;
		})
		let delete_query = ``;
		data.deleteFamilyList.map((e, i) => {
			delete_query += `DELETE FROM productFamily_user WHERE family_id = '${e.id}' AND user_id = '${user.company_id}';`;
    })
    const query = insert_query + delete_query;
    const [rows, field] = await pool.query(query);
    console.log('modifyFamily');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('modifyFamily error',error);
  }
}

//창고에서 취급하는 품목 변경
module.exports.modifyFamilyInPlant = async (user, data, callback) => { //영헌) 안쓰이는듯
  try{
    let insert_query = ``;
		data.addFamilyList.map((e, i) => {
			insert_query += `INSERT INTO familyInPlant (\`family_id\`, \`plant_id\`) VALUES ('${e.familyUserId}', '${data.plant}');`;
		})
		let delete_query = ``;
		data.deleteFamilyList.map((e, i) => {
			delete_query += `DELETE FROM familyInPlant WHERE family_id = '${e.familyUserId}' AND plant_id = '${data.plant}'`;
		})
    const query = insert_query + delete_query;
    const [rows, field] = await pool.query(query);
    console.log('modifyFamilyInPlant');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('modifyFamilyInPlant error',error);
  }
}

//창고에서 취급하는 품목 변경
module.exports.modifyFamilyInPlant1 = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
		let insert_query = ``;
		data.addFamilyList.map((e, i) => {
			insert_query += `INSERT INTO familyInPlant (\`family_id\`, \`plant_id\`) VALUES ('${e.familyUserId}', '${data.plant}');`;
		})
		let delete_query = ``;
		data.deleteFamilyList.map((e, i) => {
			delete_query += `DELETE FROM familyInPlant WHERE family_id = '${e.familyUserId}' AND plant_id = '${data.plant}'`;
		})
		const query = insert_query + delete_query;
		if(query !== ``) {
			const exec = conn.query(query, (err, result) => {
				conn.release();
				console.log('실행 sql : ', exec.sql);
				return callback(err, result);
			});
		} else {
			return callback(err, []);
		}	});
}

/*
3|API    | { addFamilyList: [],
3|API    |   deleteFamilyList: [ { name: '방울양배추(스프로스)', id: 226, familyUserId: 32 } ] }
*/

module.exports.getTotal = async (user, data, callback) => {
  let {name, family, category, state} = data;
  try{
    const query = `SELECT count(*) as total
		FROM product as A
		LEFT JOIN productFamily as F ON F.id = A.family
		WHERE \`set\`=1
		AND A.company_id = '${user.company_id}'
		${family !== 0 ? `AND A.family = '${family}'` : ``}
		${name !== '' ? `AND A.name LIKE '%${name}%'` : ``}
		${category !== 0 ? `AND F.category = '${category}'` : ``}
		${state !== 0 ? `AND A.state = '${state}'` : ``}`;
    const [rows, field] = await pool.query(query);
    console.log('getTotal');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getTotal error',error);
  }
}

module.exports.getTotalUnset = async (user, data, callback) => {
  let {name, family} = data;
  try{
    const query = `SELECT count(*) as total
    FROM product as A JOIN company as B ON A.company_id = B.id
    WHERE \`set\`=0
    ${family !== 0 ? `AND A.family = '${family}'` : ``}
    AND B.id='${user.company_id}'
    ${(name !== 'a' ? `AND A.name = '${name}'`: '')}`;
    const [rows, field] = await pool.query(query);
    console.log('getTotalUnset');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getTotalUnset error',error);
  }
}

module.exports.getAuthedList = async (user, data, callback) => {
  let {page, name, family, category, state} = data;
  try{
    const query = `SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name, F.\`name\` as familyName, state, IFNULL(sum(S.quantity), 0) as stock
      FROM product as A
      LEFT JOIN productFamily as F ON F.id = A.family
      LEFT JOIN stock as S ON A.id = S.product_id
      WHERE \`set\`=1
      AND A.company_id = ${user.company_id}
      ${family !== 0 ? `AND A.family = '${family}'` : ``}
      ${name !== '' ? `AND A.name LIKE '%${name}%'` : ``}
      ${category !== 0 ? `AND F.category = '${category}'` : ``}
      ${state !== 0 ? `AND A.state = '${state}'` : ``}
      GROUP BY A.id
      ORDER BY A.date DESC
      ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}`;
    const [rows, field] = await pool.query(query);
    console.log('getAuthedList');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getAuthedList error',error);
  }
}

module.exports.getAuthedListUnset = async (user, data, callback) => {
  let {page, name, family, category, state} = data;

  try{
    const query = `SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name, F.\`name\` as familyName
      FROM product as A JOIN company as B ON A.company_id = B.id
      LEFT JOIN productFamily_user as FU ON A.family = FU.family_id
      LEFT JOIN productFamily as F ON F.id = FU.family_id								
      WHERE \`set\`=0
      ${family !== 0 ? `AND A.family = '${family}'` : ``}
      AND B.id = '${user.company_id}'
      ${name !== '' ? `AND A.name = '${name}'` : ``}
      ${category !== 0 ? `AND F.category = '${category}'` : ``}
      ${state !== 0 ? `AND A.state = '${state}'` : ``}
      ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`;
    const [rows, field] = await pool.query(query);
    console.log('getAuthedListUnset');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getAuthedListUnset error',error);
  }
}

module.exports.getProduct = async (params, callback) => {
  try{
    //TODO : 다른 계정은 볼 수 없게 막기
    const query = `SELECT P.*, F.\`name\` as familyName, FC.\`name\` as categoryName, FC.\`id\` as categoryId
    FROM product as P LEFT JOIN productFamily as F ON P.family = F.id
    LEFT JOIN familyCategory as FC ON FC.id = F.category
    WHERE P.id = ${params.id}`;
    const [rows, field] = await pool.query(query);
    console.log('getProduct');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('getProduct error',error);
  }
}

module.exports.addProduct = async (data, user, files, callback) => { //영헌) req.files는 없음
  let {name, price, weight, weightUnit, productFamily, discount_price, state, vat, shippingDate, shippingEndDate, gap, additional} = data;
  let fileName = 'noimage.jfif';
	if(files && files.file)
		 fileName = 'product/'+files.file[0].filename; // 대표 이미지
	let detailFileName = ''; // 상세 이미지
	// console.warn(req.files)
	if(files && files.file_detail) {
		req.files.file_detail.map((e, i) => {
			detailFileName += 'productDetail/'+e.filename+'|'; // 대표 이미지
		});
		detailFileName = detailFileName.slice(0, -1);
  }
  weightUnit = 'kg';
  try{
    const query = 
      `INSERT INTO 
      \`product\` (\`name\`, \`price_shipping\`, \`discount_price\`, \`weight\`, \`weight_unit\`, \`file_name\`, \`detail_file\`, \`company_id\`, \`family\`, \`state\`, \`tax\`, \`shippingDate\`, \`shippingEndDate\`, \`additional\`, \`gap\`)
      VALUES 
      ('${name}', '${price}', '${discount_price}', '${weight}', '${weightUnit}', '${fileName}', '${detailFileName}', ${user.company_id}, ${productFamily}, ${state}, ${vat}, '${shippingDate}', '${shippingEndDate}', '${additional}', '${gap}')`;
    const [rows, field] = await pool.query(query);
    console.log('addProduct');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('addProduct error',error);
  }
}

module.exports.activate = async (data, callback) => {
  try{
    const query = `UPDATE product SET \`set\`=1 WHERE \`id\`='${data.id}'`;
    const [rows, field] = await pool.query(query);
    console.log('activate');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('activate error',error);
  }
}

module.exports.deactivate = async (data, callback) => {
  try{
    const query = `UPDATE product SET \`set\`=0 WHERE \`id\`='${data.id}'`;
    const [rows, field] = await pool.query(query);
    console.log('deactivate');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('deactivate error',error);
  }
}

module.exports.modifyProduct = async (params, data, files, callback) => {//영헌) req.files는 없음
  const { name, price, productFamily, discount_price, state, shippingDate, shippingEndDate, additional } = data;
  let fileName = 'noimage.jfif';
  // console.warn(req.body)
	if(files && files.file)
    fileName = 'product/'+req.files.file[0].filename; // 대표 이미지
	let detailFileName = ''; // 상세 이미지
	if(files && files.file_detail) {
		req.files.file_detail.map((e, i) => {
			detailFileName += 'productDetail/'+e.filename+'|'; // 대표 이미지
		})
		detailFileName = detailFileName.slice(0, -1);
	}
	// console.warn(req.files);
  try{
    const query = 
      `UPDATE product SET \`name\`='${name}', \`price_shipping\`='${price}', \`discount_price\`='${discount_price}', \`family\` ='${productFamily}', \`state\` = '${state}', \`file_name\`='${fileName}', \`detail_file\`='${detailFileName}', \`shippingDate\` ='${shippingDate}', \`shippingEndDate\` ='${shippingEndDate}', \`additional\`='${additional}' 
      WHERE \`id\`=${params.id}`;
    const [rows, field] = await pool.query(query);
    console.log('modifyProduct');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('modifyProduct error',error);
  }
}