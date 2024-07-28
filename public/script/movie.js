import { star,halfstar,review } from "./movieComponent.js";

document.querySelector(".watchlist-btn").addEventListener("click",watchlistBtn);

function watchlistBtn(){
    document.querySelector(".watchlist-add").classList.toggle("hidden");
    document.querySelector(".watchlist-remove").classList.toggle("hidden"); 
}
