(() => {
  // Every day 9:00 AM – 11:00 PM (Sun = index 0)
  const HOURS = [
    { open: 9, close: 23 }, // Sun
    { open: 9, close: 23 }, // Mon
    { open: 9, close: 23 }, // Tue
    { open: 9, close: 23 }, // Wed
    { open: 9, close: 23 }, // Thurs
    { open: 9, close: 23 }, // Fri
    { open: 9, close: 23 }, // Sat
  ];

  const header = document.querySelector("[data-header]");
  const menuBtn = document.querySelector("[data-menu-btn]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");
  const ageGate = document.querySelector("[data-age-gate]");
  const topBtn = document.querySelector("[data-top]");

  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
    if (topBtn) topBtn.hidden = window.scrollY < 500;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenuOpen = (open) => {
    if (!menuBtn || !mobilePanel) return;
    mobilePanel.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener("click", () => {
      setMenuOpen(!mobilePanel.classList.contains("is-open"));
    });

    mobilePanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    });
  }

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Age gate
  if (ageGate) {
    const passed = localStorage.getItem("eslc-age-ok") === "1";
    if (passed) {
      ageGate.hidden = true;
      document.body.classList.remove("age-locked");
    } else {
      document.body.classList.add("age-locked");
      ageGate.querySelector("[data-age-yes]")?.addEventListener("click", () => {
        localStorage.setItem("eslc-age-ok", "1");
        ageGate.hidden = true;
        document.body.classList.remove("age-locked");
      });
      ageGate.querySelector("[data-age-no]")?.addEventListener("click", () => {
        window.location.href = "https://www.responsibility.org/";
      });
    }
  }

  // Open now badges
  const updateOpenStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const { open, close } = HOURS[day];
    const openMins = open * 60;
    const closeMins = close * 60;
    const isOpen = minutes >= openMins && minutes < closeMins;
    const label = isOpen ? "Open now" : "Closed now";

    document.querySelectorAll("[data-open-badge]").forEach((badge) => {
      badge.textContent = label;
      badge.classList.toggle("is-open", isOpen);
      badge.classList.toggle("is-closed", !isOpen);
    });
  };

  updateOpenStatus();
  setInterval(updateOpenStatus, 60_000);

  // Loyalty / points banner (Packing House-style)
  const loyaltyEl = document.getElementById("loyalty-banner");
  if (loyaltyEl) {
    const lp = window.STORE?.loyaltyProgram;
    if (lp) {
      loyaltyEl.innerHTML = `
        <div class="loyalty-banner">
          <div class="loyalty-banner__glow" aria-hidden="true"></div>
          <div class="loyalty-banner__inner">
            <span class="loyalty-banner__badge">${lp.badge || "Rewards"}</span>
            <div class="loyalty-banner__main">
              <span class="loyalty-banner__rate">${lp.rate}</span>
              <div class="loyalty-banner__text">
                <h2 id="rewards-title" class="loyalty-banner__title">${lp.headline}</h2>
                <p class="loyalty-banner__desc">${lp.description}</p>
              </div>
            </div>
          </div>
        </div>`;
    }
  }

  // Store video — keep visible; only log load failures
  const storeVideo = document.querySelector("[data-store-video]");
  if (storeVideo) {
    storeVideo.addEventListener("error", () => {
      console.warn("Store video failed to load:", storeVideo.currentSrc || "videos/east-side-reel.mp4");
    });
  }

  // Featured filter
  const filterBtns = document.querySelectorAll("[data-filter]");
  const products = document.querySelectorAll("[data-product]");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      products.forEach((item) => {
        const match = filter === "all" || item.getAttribute("data-product") === filter;
        item.hidden = !match;
      });
    });
  });

  // Contact form (front-end only)
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const note = contactForm.querySelector("[data-form-note]");
      contactForm.reset();
      if (note) {
        note.hidden = false;
        setTimeout(() => {
          note.hidden = true;
        }, 4000);
      }
    });
  }

  const newsletter = document.querySelector("[data-newsletter]");
  if (newsletter) {
    newsletter.addEventListener("submit", (event) => {
      event.preventDefault();
      const note = newsletter.querySelector("[data-news-note]");
      newsletter.reset();
      if (note) {
        note.hidden = false;
        setTimeout(() => {
          note.hidden = true;
        }, 4000);
      }
    });
  }

  // Reveal on scroll
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  const heroPhoto = document.querySelector("[data-hero-photo]");

  if (reduce) {
    reveals.forEach((node) => node.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Bubble visibility to nested loyalty banner for rate pop-in
            entry.target.querySelector(".loyalty-banner")?.classList.add("is-visible");
            if (entry.target.classList.contains("loyalty-banner")) {
              entry.target.classList.add("is-visible");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -50px 0px" },
    );
    reveals.forEach((node) => observer.observe(node));
  } else {
    reveals.forEach((node) => node.classList.add("is-visible"));
  }

  // Soft parallax on hero photo
  if (!reduce && heroPhoto) {
    let ticking = false;
    const updateHero = () => {
      const shift = Math.min(window.scrollY * 0.22, 120);
      heroPhoto.style.setProperty("--hero-shift", `${shift}px`);
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateHero);
        }
      },
      { passive: true },
    );
    updateHero();
  }

  document.querySelectorAll("[data-spotlight]").forEach((node) => {
    node.addEventListener("mousemove", (event) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
})();
