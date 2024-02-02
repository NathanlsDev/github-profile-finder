const returnBtn = document.querySelector(".btnTop");

returnBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("scroll", () => {
  return window.scrollY > 200
    ? (Btn.style.display = "flex")
    : (Btn.style.display = "none");
});
