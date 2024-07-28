import {executeQuery} from "../dbConnection.js";
import bcrypt from "bcrypt";

async function hashPW(password){
    let hashPassword = null;
    const saltRound = 10;
    await bcrypt.hash(password,saltRound).then((hash)=>{
        hashPassword = hash;
    }).catch((err)=>{
        console.error("Error hashing password:", err);
    });
    return hashPassword;
}

async function comparePW(password,storedPW){
    let validPW = false;
    await bcrypt.compare(password,storedPW).then((valid)=>{
        validPW = valid;
    }).catch((err)=>{
        console.error("Error hashing password:", err);
    })
    return validPW;
}


export class userDAO{

    static async checkUser(email,password){
        let user = {};
        const result = await executeQuery("SELECT * FROM users WHERE email = $1",[email]);
        if(result.rows && result.rows.length>0){
            const storedPW = result.rows[0].password;
            const isValid = await comparePW(password,storedPW);
            if(isValid){
                user = result.rows[0];
            }
        } 
        return user;
    }

    static async getUserById(id){
        let user = {};
        const result = await executeQuery("SELECT email,name,age FROM users WHERE id = $1",[id]);
        if(result.rows && result.rows.length>0){
            user=result.rows[0];
        }
        return user;
    }

    static async registerUser(name,email,password,age){
        let id = -1;
        const hasedPW =await hashPW(password);
        if(hasedPW && password.length>=8){
            const result = await executeQuery("INSERT INTO users (email, password,name,age) VALUES ($1, $2, $3,$4) RETURNING id",[email, hasedPW,name,age]);
            if(result.rows && result.rows.length>0){
              id=result.rows[0].id;
            }
        }
        return id;
    }

    static async changeUserName(id,newName){
        let changeStatus = -1;
        const currentName = await this.getUserById(id);
        if(currentName.name!==newName){
            const result = await executeQuery(" UPDATE users SET name = $2 WHERE id = $1 ",[id,newName]);
            if(result.rowCount){
                changeStatus=result.rowCount;
            }
        }
        return changeStatus;
    }

    static async changePassWord(email,currentPW,newPW){
        let changeStatus = -1;
        const user = await this.checkUser(email,currentPW);
        if(user.id && currentPW!==newPW && newPW.length>=8){
            const hasedPW =await hashPW(newPW);
            const result = await executeQuery(" UPDATE users SET password = $1 WHERE email = $2 ",[hasedPW,email]);
            if(result.rowCount){
                changeStatus=result.rowCount;
            }
        }
        return changeStatus;
    }
};