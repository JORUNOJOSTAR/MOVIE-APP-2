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
        // Phase 1: Secure error logging - don't expose sensitive DB info
        if (process.env.NODE_ENV !== 'production') {
            console.error('Database query error:', error.message);
        } else {
            console.error('Database operation failed');
        }
        // Return empty result instead of exposing error details
        queryResult = { rows: [], rowCount: 0 };
    });
    return queryResult;
}

// function for getting data
async function getData(query,...params){
    let data = [];
    const result = await executeQuery(query,...params);
    if(result.rows && result.rows.length>0){
        data=result.rows;
    }
    return data;
}

// function for insert,update,delete
async function manipulateData(query,...params){
    let status = -1;
    const result = await executeQuery(query,...params);
    
    if(result.rowCount || result.rowCount>=0){
        status=result.rowCount;
    }
    return status;
}


export {executeQuery,getData,manipulateData};