const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const topLinks = document.querySelectorAll('a[href="#topo"]');
const desktopMenuMedia = window.matchMedia("(min-width: 769px)");
const animatedItems = [...document.querySelectorAll("[data-anime]")];

function handleDesktopMenuChange(event) {
  if (event.matches) {
    closeMenu();
  }
}

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

function animateItem(item) {
  if (item.classList.contains("anime")) {
    return;
  }

  const delay = Number(item.getAttribute("data-anime")) || 0;
  window.setTimeout(() => {
    item.classList.add("anime");
  }, delay);
}

function initAnimations() {
  if (!animatedItems.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    animatedItems.forEach((item) => item.classList.add("anime"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateItem(entry.target);
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  animatedItems.forEach((item) => observer.observe(item));
}

initAnimations();

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

  if (typeof desktopMenuMedia.addEventListener === "function") {
    desktopMenuMedia.addEventListener("change", handleDesktopMenuChange);
  } else if (typeof desktopMenuMedia.addListener === "function") {
    desktopMenuMedia.addListener(handleDesktopMenuChange);
  }
}

topLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  });
});
