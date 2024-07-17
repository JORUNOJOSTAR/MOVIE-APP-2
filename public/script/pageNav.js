const currentPage = new URLSearchParams(window.location.search);
let pageNum = currentPage.get("page");
pageNum = pageNum?parseInt(pageNum):1;
let greenPage = pageNum>3?3:pageNum;
let num = -2;
const reqPageRoute = getPageRoute();
const cardNum = document.querySelectorAll(".movie-card").length;

for(let i=1;i<6;i++){
    const value = Math.max(i,pageNum+num);
    document.querySelector(".pagebtn-"+i).innerHTML = value;
    document.querySelector(".pagebtn-"+i).href=reqPageRoute+value;
    num++;
}

// Hiding page btn when there is no more movie data left
if(cardNum<20){
    for(let j=greenPage+1;j<6;j++){
        document.querySelector(".pagebtn-"+j).classList.add("hidden");
    }
}

document.querySelector(".pagebtn-prev").href = reqPageRoute+(pageNum>1?pageNum-1:1);
document.querySelector(".pagebtn-next").href = reqPageRoute+(cardNum>=20?pageNum+1:pageNum);
document.querySelector(".pagebtn-"+greenPage).classList.add("current-page");

// Setting page route for page nav button
function getPageRoute(){
    const currentPath = window.location.pathname;
    let route = "/getPage?page=";
    if(currentPath==="/search"){
        route = "search?movieKeywords=" + document.getElementById("search-keyword").innerHTML +"&page="
    }
    return route;
}





