let button = document.getElementById("arrow-up");

window.onscroll =  ()=>{
    if (document.documentElement.scrollTop > 20) {
      button.style.right = window.innerWidth > 600?"3rem":"0.5rem";
    } else {
        button.style.right = "-10rem";
    }
  }

function goTop(){
    document.documentElement.scrollTop = 0;   
}