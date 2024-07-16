const currentPage = new URLSearchParams(window.location.search);
let pageNum = currentPage.get("page");
pageNum = pageNum?parseInt(pageNum):1;
let greenPage = pageNum>3?3:pageNum;
let num = -2;
const reqPageRoute = "/getPage?page=";

for(let i=1;i<6;i++){
    const value = Math.max(i,pageNum+num);
    document.querySelector(".pagebtn-"+i).innerHTML = value;
    document.querySelector(".pagebtn-"+i).href=reqPageRoute+value;
    num++;
}

document.querySelector(".pagebtn-prev").href = reqPageRoute+(pageNum>1?pageNum-1:1);
document.querySelector(".pagebtn-next").href = reqPageRoute+(pageNum+1);
document.querySelector(".pagebtn-"+greenPage).classList.add("current-page");



