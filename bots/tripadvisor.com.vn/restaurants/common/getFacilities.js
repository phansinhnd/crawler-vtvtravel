
const { MongoClient, ObjectId } = require('mongodb');
// const Apify = require('apify');
const dotenv = require('dotenv');
const { FACILITIES_COLLECTION } = require('../configs/config');
const diacritics = require('diacritics');
const { result } = require('lodash');
dotenv.config();
const { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
const MONGO_CONNECTION_STRING = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
const client = new MongoClient(MONGO_CONNECTION_STRING, { useUnifiedTopology: true });

// Hàm lấy mảng id và name region
// async function getDataFromMongoDB(arr) {
//     try {
//         await client.connect();
//         // const db = client.db(MONGO_DB_NAME);
//         const database = client.db(MONGO_DB_NAME);
//         const collection = database.collection(FACILITIES_COLLECTION);
//         const result = await collection.find({}, { projection: { _id: 1, name: 1 } }).toArray();




//         console.log('Kết nối thành công');
//         return result;
//     } finally {
//         await client.close();
//     }
// };

module.exports =  async function getDataFromMongoDB(arr) {
    try {
        await client.connect();
        // const db = client.db(MONGO_DB_NAME);
        const database = client.db(MONGO_DB_NAME);
        const collection = database.collection(FACILITIES_COLLECTION);
        const facilities = await collection.find({}, { projection: { _id: 1, name: 1 } }).toArray();
        let result = [];
        // console.log(facilities,arr);

        for (let facility of arr) {
            let isInsert = true;
            for (let item of facilities) {
                if (facility === item.name) {
                    result.push(item._id);
                    isInsert = false;
                    break;
                }
            }
            if (isInsert) {
                const newData ={
                    name: facility,
                }
                // await collection.insertOne(newData);
                // console.log('chèn:', newData);
            }
        }
        return result;
        console.log('Kết nối thành công');
    } finally {
        await client.close();
    }
};




// module.exports = async (arr) => {
//     const facilities = await getDataFromMongoDB();
//     let result = [];
//     // console.log(facilities,arr);

//     for (let facility of arr) {
//         let isInsert = true;
//         for (let item of facilities) {
//             if (facility === item.name) {
//                 result.push(item._id);
//                 isInsert = false;
//                 break;
//             }
//             if (isInsert) {

//             }
//         }

//     }
//     return result;
    // const getDescription = $('.kqcdz .ui_column').length > 1 ? $('.kqcdz .ui_column:eq(1)') : $('.kqcdz .ui_column');

    // let descriptionNew = '';

    // // eslint-disable-next-line func-names
    // getDescription.each(function () {
    //   const des = $(this);

    //   des.find(".tbUiL:contains('ĐẶC TRƯNG')").parent().remove();
    //   des.find(".tbUiL:contains('ĐẶC TRƯNG')").parent().remove();

    //   descriptionNew += des.html();
    // });

    // return descriptionNew;
    //   });
// }
