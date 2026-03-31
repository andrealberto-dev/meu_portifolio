function initSite() {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav a");
  const topLinks = document.querySelectorAll('a[href="#topo"]');
  const animatedItems = [...document.querySelectorAll("[data-anime]")];
  const desktopMenuMedia =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(min-width: 769px)")
      : null;

  let animationTicking = false;

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

  function revealVisibleItems() {
    const viewportTrigger = window.innerHeight * 0.88;

    animatedItems.forEach((item) => {
      if (item.classList.contains("anime")) {
        return;
      }

      const bounds = item.getBoundingClientRect();
      if (bounds.top <= viewportTrigger) {
        animateItem(item);
      }
    });
  }

  function requestRevealCheck() {
    if (animationTicking) {
      return;
    }

    animationTicking = true;
    window.requestAnimationFrame(() => {
      revealVisibleItems();
      animationTicking = false;
    });
  }

  function initAnimations() {
    if (!animatedItems.length) {
      return;
    }

    window.addEventListener("scroll", requestRevealCheck, { passive: true });
    window.addEventListener("resize", requestRevealCheck);
    window.addEventListener("load", requestRevealCheck, { once: true });

    window.setTimeout(() => {
      revealVisibleItems();
    }, 120);
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

    if (desktopMenuMedia) {
      const onDesktopChange = (event) => {
        if (event.matches) {
          closeMenu();
        }
      };

      if (typeof desktopMenuMedia.addEventListener === "function") {
        desktopMenuMedia.addEventListener("change", onDesktopChange);
      } else if (typeof desktopMenuMedia.addListener === "function") {
        desktopMenuMedia.addListener(onDesktopChange);
      }
    }
  }

  topLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMenu();
    });
  });

  initAnimations();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
