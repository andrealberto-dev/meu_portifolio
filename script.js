const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const topLinks = document.querySelectorAll('a[href="#topo"]');
const desktopMenuMedia = window.matchMedia("(min-width: 769px)");

function closeMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function openMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "true");
  siteNav.classList.add("is-open");
  document.body.classList.add("nav-open");
}

function toggleMenu() {
  if (!menuToggle) {
    return;
  }

  const expanded = menuToggle.getAttribute("aria-expanded") === "true";

  if (expanded) {
    closeMenu();
    return;
  }

  openMenu();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.classList.contains("is-open")) {
      return;
    }

    const target = event.target;
    if (
      target instanceof Node &&
      !siteNav.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMenu();
    }
  });

  desktopMenuMedia.addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
}

if (window.SimpleAnime) {
  new window.SimpleAnime();
}

topLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  });
});
