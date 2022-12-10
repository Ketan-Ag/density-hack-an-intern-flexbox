const db = require("../database/connection")

const getTransactionHistory = async (req, res) => {
    let transaction_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.transaction_history;`
    const [transactions] = await db.execute(transaction_query, []);
    res.json(transactions);
}

const placeBuyOrder = async (req, res) => {
    console.log('working')
}

const transaction_update = async (props) => {
    sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.transaction_history(seller_id, stocks_quantity, buyer_id, final_price) VALUES (${props.seller_id}, ${props.stocks_transaction}, ${props.buyer_id} ,${props.final_price});`;
    await db.execute(sql_query, []);

    sql_query = `UPDATE ${process.env.MYSQLDATABASE}.users SET stocks = stocks + ${props.stocks_transaction}, balance = balance - ${props.stocks_transaction*props.final_price} WHERE user_id = ${props.buyer_id};`;
    await db.execute(sql_query, []);

    sql_query = `UPDATE ${process.env.MYSQLDATABASE}.users SET stocks = stocks - ${props.stocks_transaction}, balance = balance + ${props.stocks_transaction*props.final_price} WHERE user_id = ${props.seller_id};`;
    await db.execute(sql_query, []);
}

const buyerDeletion = async (props) => {
    const final_price_setter = props.isLimitOrder === 1 ? props.current_selling_price : props.max_buying_price;
    let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.buy_order_book WHERE row_order = ${props.max_buyer_row_order};`;
    var [toBeDeletedRow] = await db.execute(sql_query, []);
    console.log(toBeDeletedRow)
    var stocksRemaining = props.current_stock;
    var max_buyer_row_order = props.max_buyer_row_order;
    var flag = 0;
    while(stocksRemaining > 0) {
        

        if(toBeDeletedRow.length === 0) {
            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_buyer_row_order = 0, max_buying_price = -1;`;
            await db.execute(sql_query, []);
            flag = 1;
            break;
        }
        if (toBeDeletedRow[0].max_buying_price<props.current_selling_price){
                flag = 1;
                break;
            }
        if(stocksRemaining == toBeDeletedRow[0].stocks_quantity) {
            sql_query = `DELETE FROM ${process.env.MYSQLDATABASE}.buy_order_book WHERE buy_order_id = ${toBeDeletedRow[0].buy_order_id};`;
            await db.execute(sql_query, []);
            
            transaction_update({seller_id: props.seller_id, buyer_id: toBeDeletedRow[0].buyer_id, stocks_transaction: stocksRemaining, final_price: final_price_setter, });
            stocksRemaining = stocksRemaining - toBeDeletedRow[0].stocks_quantity;
            
            max_buyer_row_order++;
            
            sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.buy_order_book WHERE row_order = ${max_buyer_row_order};`;
            [toBeDeletedRow] = await db.execute(sql_query, []);

            if(toBeDeletedRow.length === 0) {
                sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_buyer_row_order = 0, max_buying_price = -1;`;
                await db.execute(sql_query, []);
                flag = 1;
                break;
            }
            
            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_buyer_row_order = ${max_buyer_row_order}, max_buying_price = ${toBeDeletedRow[0].max_buying_price};`;
            await db.execute(sql_query, []);

            break;
        }
        else if(stocksRemaining < toBeDeletedRow[0].stocks_quantity) {
            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.buy_order_book SET stocks_quantity = stocks_quantity - ${stocksRemaining} WHERE buy_order_id = ${toBeDeletedRow[0].buy_order_id};`;
            await db.execute(sql_query, []);

            transaction_update({seller_id: props.seller_id, buyer_id: toBeDeletedRow[0].buyer_id, stocks_transaction: stocksRemaining, final_price: final_price_setter });

            break;
        }
        else {
            sql_query = `DELETE FROM ${process.env.MYSQLDATABASE}.buy_order_book WHERE buy_order_id = ${toBeDeletedRow[0].buy_order_id};`;
            await db.execute(sql_query, []);

            transaction_update({seller_id: props.seller_id, buyer_id: toBeDeletedRow[0].buyer_id, stocks_transaction: toBeDeletedRow[0].stocks_quantity, final_price: final_price_setter, });
            stocksRemaining = stocksRemaining - toBeDeletedRow[0].stocks_quantity;

            max_buyer_row_order++;
            
            sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.buy_order_book WHERE row_order = ${max_buyer_row_order};`;
            [toBeDeletedRow] = await db.execute(sql_query, []);
            
            if(toBeDeletedRow.length === 0) {
                sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_buyer_row_order = 0, max_buying_price = -1;`;
                await db.execute(sql_query, []);
                flag = 1;
                break;
            }

            if (toBeDeletedRow[0].max_buying_price<props.current_selling_price){
                flag = 1;
                break;
            }

            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_buyer_row_order = ${max_buyer_row_order}, max_buying_price = ${toBeDeletedRow[0].max_buying_price};`;
            await db.execute(sql_query, []);
            
        }
    }

    if(stocksRemaining>0 && flag == 1) {
        const response = await sellerBookUpdate({current_selling_price :props.current_selling_price, min_seller_row_order, max_seller_row_order, stocks_quantity: stocksRemaining, seller_id: props.seller_id});
    }

    return ({
        status: 200,
        msg: 'Order Placed!'
    });
}

const sellerBookUpdate = async (props) => {
    let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.sell_order_book WHERE min_selling_price>${props.current_selling_price} LIMIT 1;`;
    const [just_greater_row] = await db.execute(sql_query, []);
    if(just_greater_row.length === 0) {
        sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.sell_order_book(seller_id, min_selling_price, row_order, stocks_quantity) VALUES (${props.seller_id}, ${props.current_selling_price}, ${props.max_seller_row_order + 1}, ${props.stocks_quantity});`;
        const [newRow3] = await db.execute(sql_query, []);
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_seller_row_order = max_seller_row_order+1;`;
        const [updatedRows2] = await db.execute(sql_query, []);
    }
    else if(just_greater_row[0].row_order === props.min_seller_row_order) {
        sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.sell_order_book(seller_id, min_selling_price, row_order, stocks_quantity) VALUES (${props.seller_id}, ${props.current_selling_price}, ${props.min_seller_row_order - 1}, ${props.stocks_quantity});`;
        const [newRow] = await db.execute(sql_query, []);
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET min_seller_row_order = min_seller_row_order-1, min_selling_price = ${props.current_selling_price};`;
        const [updatedRows2] = await db.execute(sql_query, []);
    }
    else {
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.sell_order_book SET row_order=row_order+1 WHERE row_order>=${just_greater_row[0].row_order};`;
        const [updatedRows] = await db.execute(sql_query, []);
        sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.sell_order_book(seller_id, min_selling_price, row_order, stocks_quantity) VALUES (${props.seller_id}, ${props.current_selling_price}, ${just_greater_row[0].row_order}, ${props.stocks_quantity});`;
        const [newRow2] = await db.execute(sql_query, []);
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_seller_row_order = max_seller_row_order+1;`;
        const [updatedRows3] = await db.execute(sql_query, []);
    }

    return ({
        status: 200,
        msg: 'Order Placed!'
    });
}

const placeSellOrder = async (req, res) => {
    console.log(req.body.min_selling_price);
    if(req.body.min_selling_price === -1) {
        // market order
        let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.limits;`
        const [buylimit] = await db.execute(sql_query, []);
        ({max_buying_price, max_buyer_row_order, min_selling_price, min_seller_row_order, max_seller_row_order, min_buyer_row_order} = buylimit[0]);
        console.log(max_buying_price)
        if(max_buying_price === -1) {
            return res.status(404).json({
                code: -3,
                msg: 'No buyers available at the moment'
            });
        }
        else {
            // transaction
                // buyers deletion
                console.log('transaction takes place');
                const response = await buyerDeletion({max_buyer_row_order, max_buying_price, current_stock: req.body.stocks_quantity, seller_id: req.body.seller_id, min_selling_price, isLimitOrder: 0, current_selling_price :req.body.min_selling_price});
                return res.status(response.status).send(response.msg);
        }
    }
    else {
        // limit order
            console.log('workworkwork')
            // compare with max-buy-price in limit table
            let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.limits;`
            const [buylimit] = await db.execute(sql_query, []);
            ({max_buying_price, max_buyer_row_order, min_selling_price, min_seller_row_order, max_seller_row_order, min_buyer_row_order} = buylimit[0]);
            console.log(max_buying_price)
            if(max_buying_price === -1) {
                // seller book update
                console.log('seller book update called');
                const response = await sellerBookUpdate({current_selling_price :req.body.min_selling_price, min_seller_row_order, max_seller_row_order, stocks_quantity: req.body.stocks_quantity, seller_id: req.body.seller_id, });
                return res.status(response.status).send(response.msg);
            } 
            else if(max_buying_price < req.body.min_selling_price) {
                // seller book update
                console.log('seller book update called');
                const response = await sellerBookUpdate({current_selling_price :req.body.min_selling_price, min_seller_row_order, max_seller_row_order, stocks_quantity: req.body.stocks_quantity, seller_id: req.body.seller_id});
                return res.status(response.status).send(response.msg);
            }
            else {
                // transaction
                    // buyers deletion
                    console.log('transaction takes place');
                    const response = await buyerDeletion({max_buyer_row_order, max_buying_price, current_stock: req.body.stocks_quantity, seller_id: req.body.seller_id, min_selling_price, isLimitOrder: 1, current_selling_price :req.body.min_selling_price});
                    return res.status(response.status).send(response.msg);
            }
    }
}

module.exports = {
    getTransactionHistory, placeBuyOrder, placeSellOrder
}