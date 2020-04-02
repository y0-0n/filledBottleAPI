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
	const range = excel.utils.decode_range(sheet['!ref']);
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

	console.warn(result)
}
