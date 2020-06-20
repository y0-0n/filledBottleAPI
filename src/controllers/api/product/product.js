const Product = require('../../../models/Product');
const excel = require('xlsx');

exports.getFamilyList = (req, res) => {
  Product.getFamilyList(req.user, req.params, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getFamilyId = (req, res) => {
  Product.getFamilyId(req.user, req.params, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getAllFamily = (req, res) => {
	Product.getAllFamily(req.params.categoryId, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getFamilyCategory = (req, res) => {
	Product.getFamilyCategory(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getUserFamilyCategory = (req, res) => {
	Product.getUserFamilyCategory(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.modifyFamily = (req, res) => {
  Product.modifyFamily(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.getStateCount = (req, res) => {
  Product.getStateCount(req.user, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.familyInPlant = (req, res) => {
  Product.familyInPlant(req.user, req.params.id, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.modifyFamilyInPlant = (req, res) => {
  Product.modifyFamilyInPlant(req.user, req.body, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}

exports.excel = (req, res) => {
	const workbook = excel.readFile(__dirname+'/../../../../public/excel/test.xlsx')
	const sheet = workbook.Sheets['Sheet1'];
	const rows = excel.utils.sheet_to_json(sheet);
	console.warn(rows)
	/*const range = excel.utils.decode_range(sheet['!ref']);
	let result = [], row, rowNum, colNum;
	//sheet to arr
	for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
		row=[];
		for(colNum = range.s.c; colNum <= range.e.c; colNum++) {
			var nextCell = sheet[
				excel.utils.encode_cell({r: rowNum, c:colNum})
			];
			if (typeof nextCell === 'undefined')
				row.push(void 0);
			else row.push(nextCell.w);
		}
		result.push(row);
	}

	console.warn(result)*/
}

// 쇼핑몰 페이지에서 품목 보기 (로그인 하지 않아도 열람 가능)
// 전체 회원의 물건을 보거나 특정 회원의 물건 보기
exports.getAllList = (req, res) => {
	Product.getAllList(req.params.id, (err, msg) => {
    if(err) throw err;
    res.status(200).send(msg);
  })
}