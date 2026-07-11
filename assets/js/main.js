/* =========================================================
   HAVE A SEAT
   Common Interaction Script
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".hs-header");

  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector(".hs-mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(
    ".hs-mobile-menu a"
  );

  const searchOpenButtons = document.querySelectorAll(
    "[data-search-open]"
  );
  const searchCloseButtons = document.querySelectorAll(
    "[data-search-close]"
  );
  const searchLayer = document.querySelector(".hs-search");
  const searchInput = document.querySelector(".hs-search__input");

  /* =======================================================
     01. HEADER SCROLL STATE
  ======================================================= */

  const updateHeaderState = () => {
    if (!header) return;

    if (window.scrollY > 16) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();

  window.addEventListener("scroll", updateHeaderState, {
    passive: true
  });

  /* =======================================================
     02. MOBILE MENU
  ======================================================= */

  const openMenu = () => {
    body.classList.add("is-menu-open");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "메뉴 닫기");
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", "false");
    }
  };

  const closeMenu = () => {
    body.classList.remove("is-menu-open");

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "메뉴 열기");
    }

    if (mobileMenu) {
      mobileMenu.setAttribute("aria-hidden", "true");
    }
  };

  const toggleMenu = () => {
    if (body.classList.contains("is-menu-open")) {
      closeMenu();
    } else {
      closeSearch();
      openMenu();
    }
  };

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* =======================================================
     03. SEARCH LAYER
  ======================================================= */

  function openSearch() {
    closeMenu();

    body.classList.add("is-search-open");

    searchOpenButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "true");
    });

    if (searchLayer) {
      searchLayer.setAttribute("aria-hidden", "false");
    }

    window.setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
      }
    }, 150);
  }

  function closeSearch() {
    body.classList.remove("is-search-open");

    searchOpenButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });

    if (searchLayer) {
      searchLayer.setAttribute("aria-hidden", "true");
    }
  }

  searchOpenButtons.forEach((button) => {
    button.addEventListener("click", openSearch);
  });

  searchCloseButtons.forEach((button) => {
    button.addEventListener("click", closeSearch);
  });

  if (searchLayer) {
    searchLayer.addEventListener("click", (event) => {
      if (event.target === searchLayer) {
        closeSearch();
      }
    });
  }

  /* =======================================================
     04. ESCAPE KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeMenu();
    closeSearch();
  });

  /* =======================================================
     05. REVEAL MOTION
  ======================================================= */

  const revealElements = document.querySelectorAll(
    "[data-reveal]"
  );

  if (
    "IntersectionObserver" in window &&
    revealElements.length > 0
  ) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element) => {
      element.classList.add("js-reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =======================================================
     06. CURRENT MENU
  ======================================================= */

  const currentPath = window.location.pathname;
  const navigationLinks = document.querySelectorAll(
    ".hs-nav__link, .hs-mobile-menu__nav a"
  );

  navigationLinks.forEach((link) => {
    const linkPath = new URL(
      link.href,
      window.location.origin
    ).pathname;

    if (
      linkPath !== "/" &&
      currentPath.startsWith(linkPath)
    ) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }

    if (
      currentPath === "/" &&
      (linkPath === "/" || linkPath.endsWith("index.html"))
    ) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* =======================================================
     07. EMPTY LINKS
  ======================================================= */

  const emptyLinks = document.querySelectorAll('a[href="#"]');

  emptyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

  /* =======================================================
     08. IMAGE LOAD STATE
  ======================================================= */

  const images = document.querySelectorAll("img");

  images.forEach((image) => {
    if (image.complete) {
      image.classList.add("is-loaded");
      return;
    }

    image.addEventListener(
      "load",
      () => {
        image.classList.add("is-loaded");
      },
      { once: true }
    );
  });
});
