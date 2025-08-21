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

// Transaction wrapper functions for application-level atomicity
async function withTransaction(callback) {
    const client = new pg.Client({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    });
    
    try {
        await client.connect();
        await client.query('BEGIN');
        
        const result = await callback(client);
        
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        
        // Phase 1: Secure error logging - don't expose sensitive DB info
        if (process.env.NODE_ENV !== 'production') {
            console.error('Transaction error:', error.message);
        } else {
            console.error('Transaction operation failed');
        }
        
        throw error;
    } finally {
        await client.end();
    }
}

// Execute multiple queries in a single transaction
async function executeInTransaction(queries) {
    return withTransaction(async (client) => {
        const results = [];
        for (const { query, params } of queries) {
            const result = await client.query(query, params);
            results.push(result);
        }
        return results;
    });
}

// Helper function for single query with transaction
async function getDataWithTransaction(query, params = []) {
    return withTransaction(async (client) => {
        const result = await client.query(query, params);
        return result.rows;
    });
}

// Helper function for data manipulation with transaction
async function manipulateDataWithTransaction(query, params = []) {
    return withTransaction(async (client) => {
        const result = await client.query(query, params);
        return result.rowCount;
    });
}

export {executeQuery, getData, manipulateData, withTransaction, executeInTransaction, getDataWithTransaction, manipulateDataWithTransaction};