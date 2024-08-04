import {rating,review} from "./movieComponent.js";
const movieId = document.getElementById("movieId").value;
const orderList = ["Most popular","Up to date","Most funny"];
let ratingHTML = `
<h2 style="padding-top: 25%;">No rating yet...</h2>
<p>Be the first to make a review</p>
`;

let ratingParent = document.querySelector(".review-overview");
let reviewParent = document.querySelector(".review-content-container");
let moreReviewBtn = `<div class="more-review-btn">More Reviews</div>`;

const showReviewFunc=async() => {
    await showReviews();
};

const showRatingFunc = async() => {
    await showRating();
};

showRatingFunc();
showReviewFunc();


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


