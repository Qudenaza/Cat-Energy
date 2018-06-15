var navMain = document.querySelector(".user-nav");
var navToggle = document.querySelector(".user-nav__toggle");

console.log(navMain);


navMain.classList.remove("user-nav--nojs");

navToggle.addEventListener("click", function() {
  if (navMain.classList.contains("user-nav--closed")) {
    navMain.classList.remove("user-nav--closed");
    navMain.classList.add("user-nav--opened");
  } else {
    navMain.classList.add("user-nav--closed");
    navMain.classList.remove("user-nav--opened");
  }
});
