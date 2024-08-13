const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
};

const nameMsg = document.querySelector(".change-name-msg");
const pwMsg = document.querySelector(".change-pw-msg");

function changeName(){
    const newName = document.getElementById("newName").value;
    
    if(newName.length<=0 || newName.length>20){
        nameMsg.classList.add("err-message");
        nameMsg.innerHTML = "Name Invalid";
        return 
    }
    
    requestOptions.body = JSON.stringify({ newName: newName });

    fetch('/changeName', requestOptions)
    .then(response => response.json())
    .then(data =>{
        if(data.newName){
            nameMsg.innerHTML = "";
            document.getElementById("name").value = data.newName;
        }else{
            nameMsg.classList.add("err-message");
            nameMsg.innerHTML = data.message;
        }
    } );

}


function changePw(){
    const newPw = document.getElementById("New-password").value;
    const oldPw = document.getElementById("Old-password").value;

    if(newPw.length<8 || oldPw.length<8){
        pwMsg.classList.add("err-message");
        pwMsg.innerHTML = "PassWord Invalid";
        return 
    }
    
    requestOptions.body = JSON.stringify({ newPw: newPw,oldPw: oldPw });

    fetch('/changePassWord', requestOptions)
    .then(response => response.json())
    .then(data =>{
        if(data.isSuccess){
            pwMsg.classList.add("success-message");
            pwMsg.innerHTML = data.message;
        }else{
            pwMsg.classList.add("err-message");
            pwMsg.innerHTML = data.message;
        }
    } );

}