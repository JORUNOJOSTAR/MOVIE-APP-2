import {rating} from "./movieComponent.js";
const movieId = document.getElementById("movieId").value;
const reviews = await getReview(movieId);


let reviewsData = reviews.reviewData;
let reviewLength = reviewsData.length;
let starAverage = [0,0,0,0,0];

let ratingHTML = `
<h2 style="padding-top: 25%;">No rating yet...</h2>
<p>Be the first to make a review</p>
`;

if(reviewsData.length>0){
    ratingHTML = ejs.render(rating,{
        "averageRating" : averageRating(reviewsData) ,
        "reviewCount" : reviewLength,
        "starAverage" : starAverage
    });
    
}

document.querySelector(".review-overview").innerHTML = ratingHTML;

for(let i=0;i<starAverage.length;i++){
    document.querySelector(`.bar-${i+1} div`).style.width = starAverage[i]+"%";
}


async function getReview(movieId){
    let reviews = [];
    await fetch("http://localhost:3000/movie/reviews/"+movieId).then(
        (response)=>reviews = response.json()
    ).catch(
        (err)=>console.log(err)
    )
    return reviews;
}

function averageRating(reviewData){
    let total = 0;
    const reviewSize = reviewData.length;
    reviewData.forEach(element => {
        total = total + element.review_star;
        starAverage[element.review_star-1] = starAverage[element.review_star-1] + 1;
    });
    starAverage = starAverage.map((star)=> Math.floor(((star/reviewLength)*100)*100)/100);
    return Math.floor((total/reviewSize)*10)/10;
}
