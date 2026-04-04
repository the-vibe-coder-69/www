const revealItems = document.querySelectorAll("[data-reveal]");
const stickyCta = document.querySelector("[data-sticky-cta]");
const heroSection = document.querySelector("[data-hero]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const showHero = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("is-ready");
    });
  });
};

if (!reducedMotion.matches) {
  showHero();
} else {
  document.body.classList.add("is-ready");
}

if (revealItems.length && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("reveal-visible"));
}

if (stickyCta && heroSection) {
  let stickyObserver;
  const mobileMedia = window.matchMedia("(max-width: 780px)");

  const syncSticky = () => {
    if (stickyObserver) {
      stickyObserver.disconnect();
    }

    stickyCta.classList.remove("is-visible");

    if (!mobileMedia.matches || reducedMotion.matches) {
      return;
    }

    stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stickyCta.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0.22 }
    );

    stickyObserver.observe(heroSection);
  };

  syncSticky();
  mobileMedia.addEventListener("change", syncSticky);
}
