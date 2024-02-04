const returnBtn = document.querySelector(".btnTop");

returnBtn.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    return (Btn.style.display = "flex");
  }
  return (Btn.style.display = "none");
});
