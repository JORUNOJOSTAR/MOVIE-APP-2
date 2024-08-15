
import {makeReview,editReview, review} from "./movieComponent.js";
import { showRatingFunc ,showReviewFunc} from "./movieRating.js";

const movieId = document.getElementById("movieId").value;
const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
};
let makeReviewDiv = document.querySelector("#make-review");

document.querySelector(".review-btn").addEventListener("click",makeReviewFunc);






// Reviews
function addReviewFunc(){
    let starcount = 0;
    let review = document.querySelector("#review-comment").value;
    const yellowStar = document.querySelectorAll('.yellow-star');
    starcount = Array.from(yellowStar).filter((e)=>e.classList.contains("yellow-star")).length;
    if(starcount<=0 || review.length<=0){
        document.querySelector(".review-err").innerHTML = "Reviews and stars could not be blanked";
        return
    }

    requestOptions.body = JSON.stringify({ review: {
        star_message: starcount,
        review_message : review,
        movieId: movieId
    } });
    requestOptions.method = "POST";
    makeRequest("/review/makeReview",requestOptions).then(data=>{
        if(data[0].message){
            document.querySelector(".review-err").innerHTML = data[0].message;
        }else{
            data = data[0].userReview;
            makeReviewDiv.innerHTML = ejs.render(editReview,data);
            setReviewSection(data);
            showRatingFunc();
            document.querySelector(".review-content-container").innerHTML = "";
            showReviewFunc();
        }
    });
}


function deleteReviewFunc(){
    let review_id = document.querySelector(".delete-btn").id;
    review_id = review_id.split("-");
    review_id = review_id[review_id.length-1];
    requestOptions.body = JSON.stringify({ deleteReview: {
        review_id : review_id,
    } });
    requestOptions.method = "DELETE";
    makeRequest("/review/delete",requestOptions).then(data=>{
        if(data[0].status<0){
            document.querySelector(".review-err").innerHTML = "Failed to delete. Please refresh and try again";
        }else{
            
            makeReviewDiv.innerHTML = ejs.render(makeReview,data[0]);
            setReviewSection();
            showRatingFunc();
            document.querySelector(".review-content-container").innerHTML = "";
            showReviewFunc();
        }
    });
}

function makeReviewFunc(){
    makeRequest("/review/getUserReview/"+movieId,requestOptions).then(
        data =>{
            data = data[0].userReview;
            if(data.id){
                makeReviewDiv.innerHTML = ejs.render(editReview,data);
                setReviewSection(data.review_star);
            }else{
                console.log(data);
                makeReviewDiv.innerHTML = ejs.render(makeReview,data);
                setReviewSection();
            }
        }
    );
}

function setReviewSection(review_star=-1){
    document.querySelectorAll(".input-star").forEach((element)=>{
        element.addEventListener("click",(e)=>{
            
            let num = e.currentTarget.id;
            num = parseInt(num.substr(num.length - 1));
            
            for(let i =1;i<6;i++){
                let star = document.getElementById(`input-star-${i}`);
                if(i<=num){
                    star.classList.add("yellow-star");
                }else{
                    star.classList.remove("yellow-star");
                }
            }
        })
    })

    document.querySelector(".add-btn").addEventListener("click",addReviewFunc);
    document.querySelector(".delete-btn").addEventListener("click",deleteReviewFunc);
    

    if(review_star>0){
        for(let i =1;i<6;i++){
            let star = document.getElementById(`input-star-${i}`);
            if(i<=review_star){
                star.classList.add("yellow-star");
            }else{
                star.classList.remove("yellow-star");
            }
        }
    }
}

async function makeRequest(url,requestOptions){
    let data = [];
    data.push(await fetch(url,requestOptions)
    .then(response=>{
        if (response.redirected) {
            window.location.href = response.url;
        }else{
            return response.json();
        }
    }));
    return data;
}



