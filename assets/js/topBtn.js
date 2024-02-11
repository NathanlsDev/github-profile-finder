const topButton = document.querySelector(".btnTop");

topButton.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

document.addEventListener("scroll", () =>
  window.scrollY > 200
    ? (topButton.style.display = "flex")
    : (topButton.style.display = "none")
);
