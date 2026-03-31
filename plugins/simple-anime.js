window.SimpleAnime = class {
  constructor() {
    this.items = [...document.querySelectorAll("[data-anime]")];
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    this.init();
  }

  animateItem(item) {
    if (item.classList.contains("anime")) {
      return;
    }

    const delay = Number(item.getAttribute("data-anime")) || 0;
    window.setTimeout(() => {
      item.classList.add("anime");
    }, delay);
  }

  animateAll() {
    this.items.forEach((item) => this.animateItem(item));
  }

  init() {
    if (!this.items.length) {
      return;
    }

    if (this.prefersReducedMotion || !("IntersectionObserver" in window)) {
      this.animateAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          this.animateItem(entry.target);
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    this.items.forEach((item) => observer.observe(item));
  }
};
