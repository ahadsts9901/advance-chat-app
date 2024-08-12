import "dotenv/config"
import { connection, connect } from 'mongoose';

const uri = process.env.MONGO_URI

async function run() {
    try {

        await connect(
            uri,
            {
                dbName: 'advance-chat-app',
            }
        );

    } catch (err) {
        console.log("mongodb connection error", err);
        process.exit(1);
    }
}

run().catch(console.dir);

connection.on('connected', function () {
    console.log("mongoose is connected");
});

connection.on('disconnected', function () {
    console.log("mongoose is disconnected");
    process.exit(1);
});

connection.on('error', function (err) {
    console.log('mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', async function () {

    console.log("app is terminating");
    await connection.close();

    console.log('Mongoose default connection closed');
    process.exit(0);

});