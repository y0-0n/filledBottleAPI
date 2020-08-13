'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getFamilyId = async (user, data, callback) => {
  try{
    const {productId} = data;
    const query = `SELECT PF.id as id from product as P
      JOIN productFamily_user as PF ON P.family = PF.family_id
      WHERE P.user_id = ?
      AND P.id = ${productId}`
    const [rows, field] = await pool.query(query, [user.id]);
    console.log('getFamilyId');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getFamilyId error',error);
  }
}

module.exports.getList = async (user, callback) => {
  try{
    const query = `SELECT * from product
      WHERE user_id = ?
      AND \`set\`=1`;
    const [rows, field] = await pool.query(query, [user.id]);
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

module.exports.modifyFamily = async (user, data, callback) => {
  try{
    let insert_query = ``;
		data.addFamilyList.map((e, i) => {
			insert_query += `INSERT INTO productFamily_user (\`family_id\`, \`user_id\`) VALUES ('${e.id}', '${user.id}');`;
		})
		let delete_query = ``;
		data.deleteFamilyList.map((e, i) => {
			delete_query += `DELETE FROM productFamily_user WHERE family_id = '${e.id}' AND user_id = '${user.id}';`;
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

module.exports.modifyFamily1 = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
		let insert_query = ``;
		data.addFamilyList.map((e, i) => {
			insert_query += `INSERT INTO productFamily_user (\`family_id\`, \`user_id\`) VALUES ('${e.id}', '${user.id}');`;
		})
		let delete_query = ``;
		data.deleteFamilyList.map((e, i) => {
			delete_query += `DELETE FROM productFamily_user WHERE family_id = '${e.id}' AND user_id = '${user.id}';`;
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
		}
	});
}

//창고에서 취급하는 품목 변경
module.exports.modifyFamilyInPlant = async (user, data, callback) => { //영헌) 안쓰이는듯
  try{
    let insert_query = ``;
		data.addFamilyList.map((e, i) => {
			insert_query += `INSERT INTO productFamily_user (\`family_id\`, \`user_id\`) VALUES ('${e.id}', '${user.id}');`;
		})
		let delete_query = ``;
		data.deleteFamilyList.map((e, i) => {
			delete_query += `DELETE FROM productFamily_user WHERE family_id = '${e.id}' AND user_id = '${user.id}';`;
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