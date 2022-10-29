const db = require("../database/connection")

const transaction_update = async (props) => {
    sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.transaction_history(seller_id, stocks_quantity, buyer_id, final_price) VALUES (${props.seller_id}, ${props.stocks_transaction}, ${props.buyer_id} ,${props.final_price});`;
    await db.execute(sql_query, []);

    sql_query = `UPDATE ${process.env.MYSQLDATABASE}.users SET stocks = stocks + ${props.stocks_transaction}, balance = balance - ${props.stocks_transaction*props.final_price} WHERE user_id = ${props.buyer_id};`;
    await db.execute(sql_query, []);

    sql_query = `UPDATE ${process.env.MYSQLDATABASE}.users SET stocks = stocks - ${props.stocks_transaction}, balance = balance + ${props.stocks_transaction*props.final_price} WHERE user_id = ${props.seller_id};`;
    await db.execute(sql_query, []);
}

const sellerDeletion = async (props) => {
    let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.sell_order_book WHERE row_order = ${props.min_seller_row_order};`;
    var [toBeDeletedRow] = await db.execute(sql_query, []);
    console.log(toBeDeletedRow)
    var stocksRemaining = props.current_stock;
    var min_seller_row_order = props.min_seller_row_order;
    while(stocksRemaining > 0) {
        if(toBeDeletedRow.length === 0) {
            break;
        }
        if(stocksRemaining == toBeDeletedRow[0].stocks_quantity) {
            sql_query = `DELETE FROM ${process.env.MYSQLDATABASE}.sell_order_book WHERE sell_order_id = ${toBeDeletedRow[0].sell_order_id};`;
            await db.execute(sql_query, []);
            
            transaction_update({seller_id: toBeDeletedRow[0].seller_id, buyer_id: props.buyer_id, stocks_transaction: stocksRemaining, final_price: props.min_selling_price, });
            
            min_seller_row_order++;
            
            sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.sell_order_book WHERE row_order = ${min_seller_row_order};`;
            [toBeDeletedRow] = await db.execute(sql_query, []);
            
            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET min_seller_row_order = ${min_seller_row_order}, min_selling_price = ${toBeDeletedRow[0].min_selling_price};`;
            await db.execute(sql_query, []);

            stocksRemaining = stocksRemaining - toBeDeletedRow[0].stocks_quantity;
            break;
        }
        else if(stocksRemaining < toBeDeletedRow[0].stocks_quantity) {
            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.sell_order_book SET stocks_quantity = stocks_quantity - ${stocksRemaining} WHERE sell_order_id = ${toBeDeletedRow[0].sell_order_id};`;
            await db.execute(sql_query, []);

            transaction_update({seller_id: toBeDeletedRow[0].seller_id, buyer_id: props.buyer_id, stocks_transaction: stocksRemaining, final_price: props.min_selling_price });

            break;
        }
        else {
            sql_query = `DELETE FROM ${process.env.MYSQLDATABASE}.sell_order_book WHERE sell_order_id = ${toBeDeletedRow[0].sell_order_id};`;
            await db.execute(sql_query, []);

            transaction_update({seller_id: toBeDeletedRow[0].seller_id, buyer_id: props.buyer_id, stocks_transaction: toBeDeletedRow[0].stocks_quantity, final_price: props.min_selling_price, });

            min_seller_row_order++;
            
            sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.sell_order_book WHERE row_order = ${min_seller_row_order};`;
            [toBeDeletedRow] = await db.execute(sql_query, []);
            
            sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET min_seller_row_order = ${min_seller_row_order}, min_selling_price = ${toBeDeletedRow[0].min_selling_price};`;
            await db.execute(sql_query, []);
            
            stocksRemaining = stocksRemaining - toBeDeletedRow[0].stocks_quantity;
        }
    }

    if(stocksRemaining>0) {
        const response = await buyerBookUpdate({current_buying_price :req.body.max_buying_price, max_buyer_row_order, min_buyer_row_order, stocks_quantity: stocksRemaining, buyer_id: req.body.buyer_id});
    }

    return ({
        status: 200,
        msg: 'Order Placed!'
    });
}

const buyerBookUpdate = async (props) => {
    let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.buy_order_book WHERE max_buying_price<${props.current_buying_price} ORDER BY max_buying_price DESC LIMIT 1;`;
    const [just_lesser_row] = await db.execute(sql_query, []);
    if(just_lesser_row.length === 0) {
        sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.buy_order_book(buyer_id, max_buying_price, row_order, stocks_quantity) VALUES (${props.buyer_id}, ${props.current_buying_price}, ${props.min_buyer_row_order + 1}, ${props.stocks_quantity});`;
        const [newRow3] = await db.execute(sql_query, []);
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET min_buyer_row_order = min_buyer_row_order+1;`;
        const [updatedRows2] = await db.execute(sql_query, []);
    }
    else if(just_lesser_row[0].row_order === props.max_buyer_row_order) {
        sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.buy_order_book(buyer_id, max_buying_price, row_order, stocks_quantity) VALUES (${props.buyer_id}, ${props.current_buying_price}, ${props.max_buyer_row_order - 1}, ${props.stocks_quantity});`;
        const [newRow] = await db.execute(sql_query, []);
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET max_buyer_row_order = max_buyer_row_order-1, max_buying_price = ${props.current_buying_price};`;
        const [updatedRows2] = await db.execute(sql_query, []);
    }
    else {
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.buy_order_book SET row_order=row_order+1 WHERE row_order>=${just_lesser_row[0].row_order};`;
        const [updatedRows] = await db.execute(sql_query, []);
        sql_query = `INSERT INTO ${process.env.MYSQLDATABASE}.buy_order_book(buyer_id, max_buying_price, row_order, stocks_quantity) VALUES (${props.buyer_id}, ${props.current_buying_price}, ${just_lesser_row[0].row_order}, ${props.stocks_quantity});`;
        const [newRow2] = await db.execute(sql_query, []);
        sql_query = `UPDATE ${process.env.MYSQLDATABASE}.limits SET min_buyer_row_order = min_buyer_row_order+1;`;
        const [updatedRows2] = await db.execute(sql_query, []);
    }
    return ({
        status: 200,
        msg: 'Order Placed!'
    });
}

const placeBuyOrder = async (req, res) => {
    console.log(req.body.max_buying_price);
    if(req.body.max_buying_price === -1) {
        // market order
        let sql_query = `SELECT * FROM ${process.env.MYSQLDATABASE}.limits;`
        const [buylimit] = await db.execute(sql_query, []);
        ({max_buying_price, max_buyer_row_order, min_selling_price, min_seller_row_order, min_buyer_row_order} = buylimit[0]);
        console.log(min_selling_price)
        if(min_selling_price === -1) {
            return res.status(404).json({
                code: -3,
                msg: 'No sellers available at the moment'
            });
        }
        else {
            // transaction
                // buyers deletion
                console.log('transaction takes place');
                const response = await sellerDeletion({min_seller_row_order, current_stock: req.body.stocks_quantity, buyer_id: req.body.buyer_id, min_selling_price, max_buying_price});
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
                // buyer book update
                console.log('buyer book update called');
                const response = await buyerBookUpdate({current_buying_price :req.body.max_buying_price, max_buyer_row_order, min_buyer_row_order, stocks_quantity: req.body.stocks_quantity, buyer_id: req.body.buyer_id});
                return res.status(response.status).send(response.msg);  
            } 
            else if(max_buying_price < req.body.min_selling_price) {
                // buyer book update
                console.log('buyer book update called');
                const response = await buyerBookUpdate({current_buying_price :req.body.max_buying_price, max_buyer_row_order, min_buyer_row_order, stocks_quantity: req.body.stocks_quantity, buyer_id: req.body.buyer_id});
                return res.status(response.status).send(response.msg);
            }
            else {
                // transaction
                    // buyers deletion
                    console.log('transaction takes place');
                    const response = await sellerDeletion({min_seller_row_order, current_stock: req.body.stocks_quantity, buyer_id: req.body.buyer_id, min_selling_price, max_buying_price});
                    return res.status(response.status).send(response.msg);
            }
            return res.send('working')
    }
}

module.exports = {
    placeBuyOrder, 
}