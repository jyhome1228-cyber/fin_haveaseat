"use strict";

/* =========================================================
   HAVE A SEAT
   Common Interaction Script

   01. Header scroll state
   02. Mobile navigation
   03. Search panel
   04. Reveal animation
   05. Homepage hero slider
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initHeader();
  initMobileMenu();
  initSearchPanel();
  initReveal();
  initHomeSlider();
});


/* =========================================================
   01. HEADER
========================================================= */

function initHeader() {
  const header = document.querySelector(".hs-header");

  if (!header) {
    return;
  }

  let ticking = false;

  function updateHeader() {
    const isScrolled = window.scrollY > 8;

    header.classList.toggle(
      "is-scrolled",
      isScrolled
    );

    ticking = false;
  }

  function requestHeaderUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(
      updateHeader
    );
  }

  updateHeader();

  window.addEventListener(
    "scroll",
    requestHeaderUpdate,
    {
      passive: true
    }
  );
}


/* =========================================================
   02. MOBILE MENU
========================================================= */

function initMobileMenu() {
  const menu = document.querySelector(
    ".hs-mobile-menu"
  );

  const menuButtons = Array.from(
    document.querySelectorAll(
      "[data-menu-toggle]"
    )
  );

  if (
    !menu ||
    menuButtons.length === 0
  ) {
    return;
  }

  const menuLinks = Array.from(
    menu.querySelectorAll("a")
  );

  function openMenu() {
    document.dispatchEvent(
      new CustomEvent(
        "hs:close-search"
      )
    );

    menu.classList.add(
      "is-open"
    );

    menu.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "is-menu-open"
    );

    menuButtons.forEach(function (
      button
    ) {
      button.setAttribute(
        "aria-expanded",
        "true"
      );

      button.setAttribute(
        "aria-label",
        "메뉴 닫기"
      );
    });
  }

  function closeMenu() {
    menu.classList.remove(
      "is-open"
    );

    menu.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "is-menu-open"
    );

    menuButtons.forEach(function (
      button
    ) {
      button.setAttribute(
        "aria-expanded",
        "false"
      );

      button.setAttribute(
        "aria-label",
        "메뉴 열기"
      );
    });
  }

  function toggleMenu() {
    const isOpen =
      menu.classList.contains(
        "is-open"
      );

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuButtons.forEach(function (
    button
  ) {
    button.addEventListener(
      "click",
      toggleMenu
    );
  });

  menuLinks.forEach(function (link) {
    link.addEventListener(
      "click",
      closeMenu
    );
  });

  menu.addEventListener(
    "click",
    function (event) {
      if (event.target === menu) {
        closeMenu();
      }
    }
  );

  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key === "Escape" &&
        menu.classList.contains(
          "is-open"
        )
      ) {
        closeMenu();

        const firstMenuButton =
          menuButtons[0];

        if (firstMenuButton) {
          firstMenuButton.focus();
        }
      }
    }
  );

  document.addEventListener(
    "hs:close-menu",
    closeMenu
  );

  window.addEventListener(
    "resize",
    function () {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    }
  );
}


/* =========================================================
   03. SEARCH PANEL
========================================================= */

function initSearchPanel() {
  const searchPanel =
    document.querySelector(
      ".hs-search"
    );

  const openButtons = Array.from(
    document.querySelectorAll(
      "[data-search-open]"
    )
  );

  const closeButtons = Array.from(
    document.querySelectorAll(
      "[data-search-close]"
    )
  );

  if (
    !searchPanel ||
    openButtons.length === 0
  ) {
    return;
  }

  const searchInput =
    searchPanel.querySelector(
      'input[type="search"]'
    );

  function openSearch() {
    document.dispatchEvent(
      new CustomEvent(
        "hs:close-menu"
      )
    );

    searchPanel.classList.add(
      "is-open"
    );

    searchPanel.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "is-search-open"
    );

    openButtons.forEach(function (
      button
    ) {
      button.setAttribute(
        "aria-expanded",
        "true"
      );
    });

    window.setTimeout(
      function () {
        if (searchInput) {
          searchInput.focus();
        }
      },
      80
    );
  }

  function closeSearch() {
    searchPanel.classList.remove(
      "is-open"
    );

    searchPanel.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "is-search-open"
    );

    openButtons.forEach(function (
      button
    ) {
      button.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  }

  openButtons.forEach(function (
    button
  ) {
    button.addEventListener(
      "click",
      openSearch
    );
  });

  closeButtons.forEach(function (
    button
  ) {
    button.addEventListener(
      "click",
      closeSearch
    );
  });

  searchPanel.addEventListener(
    "click",
    function (event) {
      if (
        event.target === searchPanel
      ) {
        closeSearch();
      }
    }
  );

  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.key === "Escape" &&
        searchPanel.classList.contains(
          "is-open"
        )
      ) {
        closeSearch();

        const firstOpenButton =
          openButtons[0];

        if (firstOpenButton) {
          firstOpenButton.focus();
        }
      }
    }
  );

  document.addEventListener(
    "hs:close-search",
    closeSearch
  );
}


/* =========================================================
   04. REVEAL ANIMATION
========================================================= */

function initReveal() {
  const revealElements = Array.from(
    document.querySelectorAll(
      "[data-reveal]"
    )
  );

  if (revealElements.length === 0) {
    return;
  }

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  function revealElement(element) {
    element.classList.add(
      "is-visible"
    );

    element.classList.add(
      "is-revealed"
    );
  }

  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach(
      revealElement
    );

    return;
  }

  const observer =
    new IntersectionObserver(
      function (
        entries,
        currentObserver
      ) {
        entries.forEach(
          function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            revealElement(
              entry.target
            );

            currentObserver.unobserve(
              entry.target
            );
          }
        );
      },
      {
        threshold: 0.08,
        rootMargin:
          "0px 0px -8% 0px"
      }
    );

  revealElements.forEach(
    function (element) {
      observer.observe(element);
    }
  );
}


/* =========================================================
   05. HOMEPAGE HERO SLIDER
========================================================= */

function initHomeSlider() {
  const slider = document.querySelector(
    "[data-home-slider]"
  );

  if (!slider) {
    return;
  }

  const slides = Array.from(
    slider.querySelectorAll(
      "[data-home-slide]"
    )
  );

  const dots = Array.from(
    slider.querySelectorAll(
      "[data-home-slider-dot]"
    )
  );

  const currentNumber =
    slider.querySelector(
      "[data-home-slider-current]"
    );

  if (slides.length === 0) {
    return;
  }

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const autoplayDelay = 5200;

  let currentIndex = slides.findIndex(
    function (slide) {
      return slide.classList.contains(
        "is-active"
      );
    }
  );

  let autoplayTimer = null;
  let pointerStartX = null;
  let pointerStartY = null;

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  function normalizeIndex(index) {
    if (index < 0) {
      return slides.length - 1;
    }

    if (index >= slides.length) {
      return 0;
    }

    return index;
  }

  function formatNumber(number) {
    return String(number).padStart(
      2,
      "0"
    );
  }

  function preloadNextSlide(index) {
    const nextIndex =
      normalizeIndex(index + 1);

    const nextImage =
      slides[nextIndex].querySelector(
        "img"
      );

    if (!nextImage) {
      return;
    }

    nextImage.loading = "eager";
  }

  function updateSlider(index) {
    const normalizedIndex =
      normalizeIndex(index);

    currentIndex =
      normalizedIndex;

    slides.forEach(function (
      slide,
      slideIndex
    ) {
      const isActive =
        slideIndex === currentIndex;

      slide.classList.toggle(
        "is-active",
        isActive
      );

      slide.setAttribute(
        "aria-hidden",
        isActive
          ? "false"
          : "true"
      );

      if ("inert" in slide) {
        slide.inert = !isActive;
      }
    });

    dots.forEach(function (
      dot,
      dotIndex
    ) {
      const isActive =
        dotIndex === currentIndex;

      dot.classList.toggle(
        "is-active",
        isActive
      );

      dot.setAttribute(
        "aria-current",
        isActive
          ? "true"
          : "false"
      );
    });

    if (currentNumber) {
      currentNumber.textContent =
        formatNumber(
          currentIndex + 1
        );
    }

    preloadNextSlide(
      currentIndex
    );
  }

  function nextSlide() {
    updateSlider(
      currentIndex + 1
    );
  }

  function previousSlide() {
    updateSlider(
      currentIndex - 1
    );
  }

  function stopAutoplay() {
    if (!autoplayTimer) {
      return;
    }

    window.clearInterval(
      autoplayTimer
    );

    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (
      reduceMotion ||
      slides.length <= 1 ||
      document.hidden
    ) {
      return;
    }

    autoplayTimer =
      window.setInterval(
        nextSlide,
        autoplayDelay
      );
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  dots.forEach(function (
    dot,
    dotIndex
  ) {
    dot.addEventListener(
      "click",
      function () {
        updateSlider(dotIndex);
        restartAutoplay();
      }
    );
  });

  slider.addEventListener(
    "mouseenter",
    stopAutoplay
  );

  slider.addEventListener(
    "mouseleave",
    startAutoplay
  );

  slider.addEventListener(
    "focusin",
    stopAutoplay
  );

  slider.addEventListener(
    "focusout",
    function (event) {
      const nextFocusedElement =
        event.relatedTarget;

      if (
        nextFocusedElement &&
        slider.contains(
          nextFocusedElement
        )
      ) {
        return;
      }

      startAutoplay();
    }
  );

  slider.addEventListener(
    "keydown",
    function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();

        nextSlide();
        restartAutoplay();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        previousSlide();
        restartAutoplay();
      }
    }
  );

  slider.addEventListener(
    "pointerdown",
    function (event) {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      pointerStartX =
        event.clientX;

      pointerStartY =
        event.clientY;
    }
  );

  slider.addEventListener(
    "pointerup",
    function (event) {
      if (
        pointerStartX === null ||
        pointerStartY === null
      ) {
        return;
      }

      const distanceX =
        event.clientX -
        pointerStartX;

      const distanceY =
        event.clientY -
        pointerStartY;

      pointerStartX = null;
      pointerStartY = null;

      const isHorizontalSwipe =
        Math.abs(distanceX) >
        Math.abs(distanceY);

      const isLongEnough =
        Math.abs(distanceX) > 45;

      if (
        !isHorizontalSwipe ||
        !isLongEnough
      ) {
        return;
      }

      if (distanceX < 0) {
        nextSlide();
      } else {
        previousSlide();
      }

      restartAutoplay();
    }
  );

  slider.addEventListener(
    "pointercancel",
    function () {
      pointerStartX = null;
      pointerStartY = null;
    }
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  if (
    !slider.hasAttribute(
      "tabindex"
    )
  ) {
    slider.setAttribute(
      "tabindex",
      "0"
    );
  }

  updateSlider(currentIndex);
  startAutoplay();
}
