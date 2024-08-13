import {rating,review} from "./movieComponent.js";
const movieId = document.getElementById("movieId").value;
const orderList = ["Most popular","Up to date","Most funny"];
const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
};
const showReviewFunc= async() => await showReviews();
const showRatingFunc = async() => await showRating();

let ratingHTML = `
<h2 style="padding-top: 25%;">No rating yet...</h2>
<p>Be the first to make a review</p>
`;

let ratingParent = document.querySelector(".review-overview");
let reviewParent = document.querySelector(".review-content-container");
let moreReviewBtn = `<div class="more-review-btn">More Reviews</div>`;

showRatingFunc();
showReviewFunc();
setWatchListBtn();


// Setting up watchlist
document.querySelector(".watchlist-btn").addEventListener("click",watchlistBtn);
function watchlistBtn(){
    requestOptions.body = JSON.stringify({ movieId: movieId });
    requestOptions.method = "POST";
    fetch('/setWatchList', requestOptions)
    .then(response => response.json())
    .then(data =>{
        if(data.status<0){
            setRemoveCookies(movieId);
        }
        document.querySelector(".watchlist-add").classList.toggle("hidden");
        document.querySelector(".watchlist-remove").classList.toggle("hidden"); 
    } );
    
}




document.querySelectorAll(".sort-details").forEach((element)=>{
    element.addEventListener("click",(event)=>{
        document.querySelector(".current-sort").classList.toggle("current-sort");
        event.target.classList.add("current-sort");
        reviewParent.innerHTML = "";
        showReviewFunc();
    })
});

async function showRating(){
    const MovieRating = await getData("rating",movieId);
    
    if(MovieRating.averageRating){
        ratingHTML = ejs.render(rating,MovieRating);
    }
    ratingParent.innerHTML = ratingHTML;
    
    for(let i=0;i<5;i++){
        document.querySelector(`.bar-${i+1} div`).style.width = MovieRating.starAverage[i]+"%";
    }
}

async function showReviews() {
    let reviewContentHTML = "";
    const currentOrder = document.querySelector(".current-sort").innerText;
    const orderNum =  orderList.indexOf(currentOrder);
    const offset = document.querySelectorAll(".reviewcontent").length;
    const queryString = `?offset=${offset}&order=${orderNum}`;
    const reviews = await getData("reviews",movieId,queryString);
    
    reviews.reviewData.forEach(
        (data)=>{
            reviewContentHTML = ejs.render(review,data);
            reviewParent.innerHTML += reviewContentHTML;
        }
    );
    if(reviews.reviewData.length==5){
        reviewParent.innerHTML += moreReviewBtn;
        document.querySelector(".more-review-btn").onclick=showReviewFunc;
    }else{
        document.querySelector(".more-review-btn").remove();
    }
}

async function getData(urlString,movieId,queryString=""){
    let reviews = {};
    await fetch(`http://localhost:3000/movie/${urlString}/`+movieId+queryString).then(
        (response)=>reviews = response.json()
    ).catch(
        (err)=>console.log(err)
    )
    return reviews;
}

function setRemoveCookies(id){
    let currentCookie = document.cookie;
    let expires = new Date();
    expires.setTime(expires.getTime()+(7*24*60*60*1000));
    let cookieId = currentCookie ? currentCookie.split(";")[0].split("=")[1].split(",") : [];
    if(cookieId.includes(id)){
        const index = cookieId.indexOf(id);
        cookieId.splice(index,1);
    }else{
        cookieId.push(id);
    }
    document.cookie=`movieId=${cookieId.toString()}; expires=${expires};path=/;`

}

function setWatchListBtn(){
    
    fetch('/checkWatchList')
    .then(response => response.json())
    .then(data =>{
        let watchList = data.watchList.map(e=>e.toString());
        if(watchList.includes(movieId)){
            
            document.querySelector(".watchlist-add").classList.add("hidden");
            document.querySelector(".watchlist-remove").classList.remove("hidden"); 
        }else{
            document.querySelector(".watchlist-add").classList.remove("hidden");
            document.querySelector(".watchlist-remove").classList.add("hidden"); 
        } 
    } );

    
}

