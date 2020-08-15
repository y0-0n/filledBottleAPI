'use strict';

const pool = require('../../config/dbpool').pool;
const Stock = require('../models/Stock')

module.exports.total = async (user, data, callback) => {
  let {first_date, last_date, process_, keyword} = data; // 상태로 검색
  let name = keyword, state = process_;
  try{
    const query = 
        `SELECT count(*) as total
        from \`order\` as A JOIN \`customer\` AS B JOIN \`company\` AS C ON A.customer_id = B.id AND A.company_id = C.id
        WHERE C.id='${user.company_id}'
        AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
        ${(state !== 'all' ? `AND A.state = '${state}'` : '')}
        ${(name !== '' ? `AND B.name = '${name}'`: '')}`
    const [rows, field] = await pool.query(query);
    console.log('total');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('total error', error);
  }
}

module.exports.totalRefund = async (user, data, callback) => {
    let {first_date, last_date, keyword} = data; // 상태로 검색
    let name = keyword;
    try{
        const query = 
        `SELECT count(*) as total
        from \`order\` as A JOIN \`customer\` AS B JOIN \`company\` AS C JOIN \`order_product\` as D ON A.customer_id = B.id AND A.customer_id = C.id AND A.id = D.order_id
        WHERE C.id='${user.company_id}' AND D.refund = true
        AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
        ${(name !== '' ? `AND B.name = '${name}'`: '')}`
      const [rows, field] = await pool.query(query);
      console.log('totalRefund');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('totalRefund error', error);
    }
  }

module.exports.list = async (user, data, callback) => {
    let {first_date, last_date, page, process_, keyword, limit} = data; // 상태로 검색
    if(!limit) {
        limit = 15
    }
    let name = keyword, state = process_;
    try{
      const query = 
        `SELECT A.id, A.state, A.date, A.price, A.received, B.name, A.createAt, B.set
        from \`order\` AS A JOIN \`customer\` AS B JOIN \`company\` as C ON A.customer_id = B.id AND A.company_id = C.id
        WHERE C.id='${user.company_id}'
        ${(state !== 'all' ? `AND A.state = '${state}'` : '')}
        ${(name !== '' ? `AND B.name = '${name}'`: '')}
        AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
        ORDER BY A.createAt DESC
        ${(page !== 'all' ? `LIMIT ${limit*(page-1)}, ${limit}` : '')}`;
      const [rows, field] = await pool.query(query);
      console.log('list');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('list error', error);
    }
}
  
module.exports.listRefund = async (user, data, callback) => {
    let {first_date, last_date, keyword, page, limit} = data; // 상태로 검색
	let name = keyword;
	if(!limit) {
        limit = 15
    }
    try{
      const query = 
        `SELECT O.id, O.state, O.date, O.price, O.received, B.name, O.createAt, B.set
        from \`order\` AS O JOIN \`customer\` AS B ON O.customer_id = B.id
        JOIN \`company\` as C ON O.company_id = C.id
        JOIN \`order_product\` as OP ON O.id = OP.order_id
        WHERE C.id='${user.company_id}' AND OP.refund = true
        ${(name !== '' ? `AND C.name = '${name}'`: '')}
        AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
        GROUP BY O.id
        ORDER BY O.createAt DESC
        ${(page !== 'all' ? `LIMIT ${limit*(page-1)}, ${limit}` : '')}`;
      const [rows, field] = await pool.query(query);
      console.log('listRefund');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('listRefund error', error);
    }
}

module.exports.todayShipping = async (user,callback) => {
    try{
      const query = 
        `SELECT O.id, O.\`date\`, C.name, O.price
        FROM \`order\` as O JOIN \`customer\` as C ON O.customer_id = C.id
        WHERE O.company_id='${user.company_id}'
        AND state='order'
        AND DATE(\`date\`) = DATE(CURRENT_TIMESTAMP)
        ORDER BY createAt DESC`;
      const [rows, field] = await pool.query(query);
      console.log('todayShipping');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('todayShipping error', error);
    }
}

module.exports.orderProduct = async (callback) => {
    try{
      const query = 'SELECT * from order_product'
      const [rows, field] = await pool.query(query);
      console.log('orderProduct');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('orderProduct error', error);
    }
}

module.exports.orderSummary = async (callback) => {
    try{
      const query = 'SELECT * from `order` as A JOIN `order_product` as B ON A.id = B.order_id'
      const [rows, field] = await pool.query(query);
      console.log('orderSummary');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('orderSummary error', error);
    }
}

module.exports.incomeYM = async (params, user,callback) => {
    try{
      const query = 
        `SELECT SUM(OP.price) as sum
        FROM \`order\` as O JOIN order_product as OP ON O.id = OP.order_id
        WHERE ${params.month} = MONTH(O.date)
        AND ${params.year} = YEAR(O.date)
        AND O.state = 'shipping'
        AND O.company_id = ${user.company_id}
        `;
      const [rows, field] = await pool.query(query);
      console.log('income year month');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('income year month error', error);
    }
}

module.exports.receiveYM = async (params, user,callback) => {
    try{
      const query = 
        `SELECT SUM(OP.price) as sum
        FROM \`order\` as O JOIN order_product as OP ON O.id = OP.order_id
        WHERE ${params.month} = MONTH(O.date)
        AND ${params.year} = YEAR(O.date)
        AND O.state = 'complete'
        AND O.company_id = ${user.company_id}
        `;
      const [rows, field] = await pool.query(query);
      console.log('receive year month');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('receive year month error', error);
    }
}

module.exports.amountYM = async (params, user,callback) => {
    try{
      const query = 
        `SELECT count(*) as amount
        FROM \`order\` as O
        WHERE ${params.month} = MONTH(O.date)
        AND ${params.year} = YEAR(O.date)
        AND O.state = 'shipping'
        AND O.company_id = ${user.company_id}`;
      const [rows, field] = await pool.query(query);
      console.log('amount year month');    
      return callback(null, rows);
    }
    catch(error) {
      console.log('amount year month error', error);
    }
}

module.exports.addOrder = async (user, data, callback) => { //영헌) 검사 용이하게 하기 위해 추후 내부 query 함수 분리 고려
    let price = 0; //총액
    let {sCustomer, sProduct, date, cellphone, telephone, address, addressDetail, postcode, comment} = data;
        
    sProduct.map((e, i) => {
      price += e.quantity * e.price; // 수량 * 출고 가격
    })
    try{
      const query_order = 
        `INSERT INTO \`order\` (\`customer_id\`, \`date\`, \`price\`, \`telephone\`, \`cellphone\`, \`address\`, \`address_detail\`, \`postcode\`, \`comment\`, \`company_id\`, \`sales\`) 
        VALUES ('${sCustomer}', '${date}', '${price}', '${telephone}', '${cellphone}', '${address}', '${addressDetail}', '${postcode}', '${comment}', '${user.company_id}', '${price}')`;
      const [rows_order, field_order] = await pool.query(query_order);
      let order_id = rows_order.insertId;
      console.log('order id',order_id)
      const query_products = sProduct.map((e, i) => {
        return `INSERT INTO order_product (\`order_id\`, \`product_id\`, \`plant_id\`, \`stock_id\`, \`quantity\`, \`price\`, \`tax\`) 
            VALUES ('${order_id}', '${e.id}', '${e.plant}', '${e.stock}', '${e.quantity}', '${sProduct[i].price * sProduct[i].quantity}', ${e.tax})`; 
      });
      for(let i=0; i<query_products.length; i++){
        await pool.query(query_products[i]);
      }

      console.log('addOrder');    
      return callback(null, rows_order);
    }
    catch(error) {
      console.log('addOrder', error);
    }
}

module.exports.getDetail = async (params, callback) => {
  let {id} = params; // id로 검색
  
  try{
    const query_order = 
      `SELECT o.id as id, date, name, o.address as address, o.address_detail as addressDetail, o.postcode as postcode, o.telephone as telephone, o.cellphone as cellphone, comment, state, o.company_id, c.crNumber as crNumber
      from \`order\` as o JOIN \`customer\` as c ON o.customer_id = c.id
      WHERE o.id=${id}`;
    const [rows_order, field_order] = await pool.query(query_order);

    const query_order_product = 
      `SELECT p.id AS productId, pl.name as plant, pl.id as plantId, pl.set as plantSet, op.id AS orderProductId, op.stock_id AS stockId, op.quantity, p.name, op.price, op.tax, op.refund, s.name as stockName from \`order\` as o
      JOIN \`order_product\` as op ON o.id = op.order_id
      JOIN plant as pl ON op.plant_id = pl.id
      JOIN product as p ON op.product_id = p.id
      JOIN stock as s ON s.id = op.stock_id
      WHERE o.id=${id}`;

    const [rows_order_product, field_order_product] = await pool.query(query_order);
    console.log('getDetail');    
    return callback(null, {orderInfo: rows_order, productInfo: rows_order_product});
  }
  catch(error) {
    console.log('getDetail error', error);
  }
}

module.exports.getDetailRefund = async (data, callback) => {
  let {orderId, productId, plantId, stockId, refundQuantity, tax, price, quantity} = data; // id로 검색
  let refundPrice = price * refundQuantity / quantity;
  try{
    const query_price = 
    `SELECT price FROM order_product WHERE \`order_id\`='${orderId}' and \`product_id\`='${productId}' and \`plant_id\`='${plantId}' and \`stock_id\`='${stockId}' and \`tax\`='${tax}' and \`refund\` = '1';`;
    const [rows_price, field_price] = await pool.query(query_price);

    let oldRefundPrice = 0;
    if (rows_price.length > 0)
      oldRefundPrice = rows_price[0].price;

    const del = await pool.query(`DELETE FROM order_product WHERE \`order_id\`='${orderId}' and \`product_id\`='${productId}' and \`plant_id\`='${plantId}' and \`stock_id\`='${stockId}' and \`tax\`='${tax}' and \`refund\` = '1';`);
    const ins = await pool.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`plant_id\`, \`stock_id\`, \`quantity\`, \`price\`, \`tax\`, \`refund\`) VALUES ('${orderId}', '${productId}', '${plantId}', '${stockId}', '${refundQuantity}', '${refundPrice}', ${tax}, 1);`);
    const upd = await pool.query(`UPDATE \`order\` SET \`sales\`=\`sales\`-${refundPrice}+${oldRefundPrice} WHERE \`id\`=${orderId}`);

    console.log('getDetailRefund');    
    return callback(null, "success");
  }
  catch(error) {
    console.log('getDetailRefund error', error);
  }
}

module.exports.changeState = async (user, data, callback) => {
  let {prev, next, orderInfo} = data; // id로 검색
  try{
    if(prev === 'order' && next === 'shipping') {
      console.log('상품 출하');
      Stock.convertStockByOrder(user, data, (err, msg) => {
        if(err) throw err;
        // res.status(200).send(msg);
      })
    }

    if(prev == 'shipping' && next === 'order') {
      console.log('상품 출하 취소');
      // Stock.convertStockByOrderReverse(req.user, req.body, (err, msg) => {
      // 	if(err) throw err;
      // })
    }
  
    if(next == 'complete') {
      //수금
    }
  
    if(prev == 'complete') {
      //수금 취소
    }

    const query = `UPDATE \`order\` SET \`state\`='${next}' WHERE \`id\`=${orderInfo[0].id}`;
    const [rows, field] = await pool.query(query);
    console.log('changeState');  
    return callback(null, rows);
  }
  catch(error) {
    console.log('changeState error', error);
  }
}

module.exports.modifyOrder = async (user, params, data, callback) => {
  let {id} = params;
	let {orderInfo, productInfo} = data; // id로 검색
  
  orderInfo = orderInfo[0];
  let price = 0;

  productInfo.map((e, i) => {
    price += e.quantity * e['price_shipping']; // 수량 * 출고 가격
	});

  try{
    //유저 일치 확인
    const query_user = `SELECT company_id FROM \`order\` WHERE \`id\`=${id}`;
    const [rows_user, field_user] = await pool.query(query_user);
    if(rows_user[0]['company_id'] !== user.company_id) {
      return callback(null, 'Auth Error');
    }
    const query_update = 
    `UPDATE \`order\` 
    SET \`cellphone\`='${orderInfo.cellphone}', \`telephone\`='${orderInfo.telephone}', \`comment\`='${orderInfo.comment}', \`address\` = '${orderInfo.address}', \`address_detail\` = '${orderInfo.addressDetail}', \`postcode\` = '${orderInfo.postcode}', \`price\`=${price} 
    WHERE \`id\`=${id}`;
    const [rows_update, field_update] = await pool.query(query_update);

    const query_delete = 
    'DELETE FROM order_product WHERE \`order_id\`='+id;
    await pool.query(query_delete);
    const query_insert_product = productInfo.map((e, i) => {
      return `INSERT INTO order_product (\`order_id\`, \`product_id\`, \`plant_id\`, \`stock_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${id}', '${e.productId}', '${e.plantId}', '${e.stockId}', '${e.quantity}', '${e.price}', ${e.tax})`;
    });
    for(let i=0; i<query_insert_product.length; i++){
      await pool.query(query_insert_product[i]);
    }
    console.log('modifyOrder');    
    return callback(null, rows_update);
  }
  catch(error) {
    console.log('modifyOrder error', error, user);
  }
}