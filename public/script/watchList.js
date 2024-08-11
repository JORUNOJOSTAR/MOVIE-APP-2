const removeBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle-fill icon remove"  viewBox="0 0 16 16" >
                       <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                   </svg>`

document.querySelectorAll(".card").forEach(Element=>Element.innerHTML += removeBtn);
document.querySelectorAll(".remove").forEach(Element=>Element.addEventListener("click",removeMovie));

function removeMovie(e){
    const movieId = e.currentTarget.parentNode.querySelector("input").value;
    e.currentTarget.parentElement.remove();
    RemoveCookies(movieId);
}


function RemoveCookies(id){
    let currentCookie = document.cookie;
    let expires = new Date();
    expires.setTime(expires.getTime()+(7*24*60*60*1000));
    let cookieId = currentCookie ? currentCookie.split(";")[0].split("=")[1].split(",") : [];
    if(cookieId.includes(id)){
        const index = cookieId.indexOf(id);
        cookieId.splice(index,1);
    }
    document.cookie=`movieId=${cookieId.toString()}; expires=${expires};path=/;`

}

