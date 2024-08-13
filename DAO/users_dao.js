import {getData,manipulateData} from "../dbConnection.js";
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
        let user = {}
        const result = await getData("SELECT * FROM users WHERE email = $1",[email]);
        if(result.length > 0){
            const storedPW = result[0].password;
            const isValid = await comparePW(password,storedPW);
            if(isValid){
                user = result[0];
            }
        }
        return user;
    }

    static async getUserById(id){
        const result = await getData("SELECT email,name,age FROM users WHERE id = $1",[id]);
        const user = result[0] || {};
        return user;
    }

    

    static async registerUser(name,email,password,age){
        let id = {id:-1};
        const hasedPW =await hashPW(password);
        if(hasedPW && password.length>=8){
            const result = await getData("INSERT INTO users (email, password,name,age) VALUES ($1, $2, $3,$4) RETURNING id",[email, hasedPW,name,age]);
            id = result[0] || id;
        }
        return id;
    }

    static async changeUserName(id,newName){
        return await getData(" UPDATE users SET name = $2 WHERE id = $1 returning name ",[id,newName]);
    }

    static async changePassWord(email,currentPW,newPW){
        let changeStatus = -1;
        const user = await this.checkUser(email,currentPW);
        if(user.id && currentPW!==newPW && newPW.length>=8){
            const hasedPW =await hashPW(newPW);
            if(hasedPW){
                changeStatus = await manipulateData(" UPDATE users SET password = $1 WHERE email = $2 ",[hasedPW,email]);
            }
        }
        return changeStatus;
    }
};