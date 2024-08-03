import { star,halfstar,rating} from "./movieComponent.js";



// Watch list btn
document.querySelector(".watchlist-btn").addEventListener("click",watchlistBtn);
function watchlistBtn(){
    document.querySelector(".watchlist-add").classList.toggle("hidden");
    document.querySelector(".watchlist-remove").classList.toggle("hidden"); 
}








