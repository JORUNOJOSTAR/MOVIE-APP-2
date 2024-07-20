// document.querySelectorAll(".menu-item").forEach(element=> element.addEventListener("click",getMovie));

// const reqHeaders = new Headers();
// reqHeaders.append("Content-Type", "application/json");

// async function getMovie(event){
//     const url = "http://localhost:3000/category";
//     const response = await fetch(url,{
//         headers: reqHeaders,
//         method: "POST",
//         redirect: "follow",
//         body: JSON.stringify({genre : event.target.innerHTML.toLowerCase()})
//     }).then(response=>{
//         if(response.redirected){
//             window.location.href=response.url;
//         }
//     });
// }