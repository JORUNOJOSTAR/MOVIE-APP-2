import pg from "pg";
import env from "dotenv";
env.config();

const db = new pg.Client(
    {
        user:  process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    }
);



db.connect();

async function executeQuery(query,params){
    let queryResult = {};
    const dbResult = await db.query(query,params).then((result)=>{
        queryResult = result;
    }).catch((error)=>{
        console.log(error);
    });
    return queryResult;
}


export {executeQuery};