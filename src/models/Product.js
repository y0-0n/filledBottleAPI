'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getFamilyId = (user, data, callback) => {
	const {productId} = data;
	pool.getConnection((err, conn) => {
		if(err) {
			conn.release();
			throw err;
		}
		const query = `SELECT PF.id as id from product as P
		JOIN productFamily_user as PF ON P.family = PF.family_id
		WHERE P.user_id = ?
		AND P.id = ${productId}`

		const exec = conn.query(query, [user.id], (err, result) => {
			conn.release();
			if(err) {
				throw err;
			}
			console.log('실행 sql : ', exec.sql);
			return callback(err, result);
		})
	})
}

module.exports.getList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * from product
									WHERE user_id = ?
									AND \`set\`=1`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}

module.exports.getAllList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * from product
			WHERE \`set\`=1
			AND mallVisible = 1
			${user !== "all" ? "AND user_id = ?" : ""}
			`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}


module.exports.getAllFamily = (data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT F.name, F.id FROM productFamily as F WHERE F.category = ${data}`;
    const exec = conn.query(query, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

module.exports.getFamilyCategory = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * FROM familyCategory`;
    const exec = conn.query(query, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

//회원이 취급하는 대분류 리스트 주기
module.exports.getUserFamilyCategory = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT FC.* FROM familyCategory AS FC
		JOIN productFamily AS PF ON FC.id = PF.category
		JOIN productFamily_user AS PFU ON PFU.family_id = PF.id
		WHERE PFU.user_id = ?
		GROUP BY FC.id`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

//회원이 취급하는 품목군 리스트 주기
module.exports.getFamilyList = (user, data, callback) => {
  const {categoryId} = data;
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    // TODO: categoryId가 숫자에서 문자로 바뀌던 문제
    const query = `SELECT F.name, F.id, FU.id as familyUserId
		FROM productFamily as F JOIN productFamily_user as FU ON F.id = FU.family_id
		JOIN familyCategory as FC ON FC.id = F.category
		JOIN users as U ON FU.user_id = U.id
		WHERE U.id = ?
		${categoryId !== '0' ? `AND F.category = ${categoryId}`: ``};
		`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

//회원이 취급하는 품목군 리스트 주기
module.exports.getStateCount = (user, callback) => {
	pool.getConnection(function(err, conn) {
		if (err) {
			conn.release();
			throw err;
		}

		const query = `SELECT COUNT(*) as count, state FROM product
		GROUP BY state`;

		const exec = conn.query(query, [user.id], (err, result) => {
			conn.release();
			console.log("실행 sql : ", exec.sql);
			return callback(err, result);
		})
	})
}

//창고에서 취급하는 품목군 주기
module.exports.familyInPlant = (user, plantId, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
		const query = `SELECT FIP.*, PFU.family_id as family, PF.name FROM familyInPlant as FIP
		JOIN productFamily_user as PFU ON FIP.family_id = PFU.id
		JOIN productFamily as PF ON PF.id = PFU.family_id
		WHERE plant_id = ?`;
    const exec = conn.query(query, [plantId], (err, result) => {
      conn.release();
			console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

module.exports.modifyFamily = (user, data, callback) => {
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
module.exports.modifyFamilyInPlant = (user, data, callback) => {
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