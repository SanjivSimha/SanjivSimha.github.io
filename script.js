const navToggle = document.querySelector("[data-nav-toggle]");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });
}

const intro = document.querySelector("[data-intro]");

if (intro) {
  const introSeen = sessionStorage.getItem("introSeen");

  if (introSeen) {
    intro.remove();
  } else {
    sessionStorage.setItem("introSeen", "true");

    window.setTimeout(() => {
      intro.classList.add("hide");
    }, 900);

    intro.addEventListener(
      "transitionend",
      () => {
        intro.remove();
      },
      { once: true }
    );
  }
}
