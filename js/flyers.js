(() => {
  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const STORE = window.STORE || {};
  const currentFlyerEl = document.getElementById("current-flyer");
  const archiveEl = document.getElementById("flyer-archive");
  const cashbackEl = document.getElementById("flyer-cashback-prompt");
  const heroSubtitle = document.querySelector("[data-flyer-hero-subtitle]");
  const lightbox = document.getElementById("flyer-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const monthLabel = `${MONTH_NAMES[currentMonth - 1]} ${currentYear}`;
  const currentKey = `${currentYear}-${currentMonth}`;

  const allFlyers = parseFlyers(STORE.monthlyFlyers || []);
  const currentFlyer =
    allFlyers.find((f) => f.key === currentKey) || allFlyers[0] || null;
  const pastFlyers = allFlyers.filter((f) => f.key !== (currentFlyer?.key || currentKey));

  if (heroSubtitle) {
    heroSubtitle.textContent = STORE.flyerComingSoon || !currentFlyer
      ? "Coming soon — check back for this month’s deals."
      : `${currentFlyer.label} specials — tap to view full size.`;
  }

  if (STORE.flyerComingSoon || !currentFlyer) {
    renderComingSoon();
  } else {
    renderCurrentFlyer();
  }

  renderArchive();
  renderCashback();

  function parseFlyers(raw) {
    return raw
      .map((entry) => {
        const image = typeof entry === "string" ? entry : entry.image;
        const parsed = parseFilename(image);
        if (!parsed) return null;
        const title =
          typeof entry === "object" && entry.title
            ? entry.title
            : `${parsed.monthName} ${parsed.year} Specials`;
        const description =
          typeof entry === "object" && entry.description ? entry.description : "";
        return {
          image,
          title,
          description,
          year: parsed.year,
          month: parsed.month,
          monthName: parsed.monthName,
          key: `${parsed.year}-${parsed.month}`,
          label: `${parsed.monthName} ${parsed.year}`,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }

  function parseFilename(path) {
    if (!path) return null;
    const match = String(path).match(/(\d{4})-(\d{2})/);
    if (!match) return null;
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    if (month < 1 || month > 12) return null;
    return { year, month, monthName: MONTH_NAMES[month - 1] };
  }

  function renderComingSoon() {
    if (!currentFlyerEl) return;

    currentFlyerEl.innerHTML = `
      <div class="current-flyer current-flyer--featured current-flyer--coming-soon">
        <div class="flyer-coming-soon">
          <p class="section-label">${monthLabel}</p>
          <div class="flyer-coming-soon__icon" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <h2 class="flyer-coming-soon__title">Coming Soon</h2>
          <p class="flyer-coming-soon__text">
            This month’s deals flyer is on its way. Check back soon, visit us in store, or call for today’s specials.
          </p>
          <div class="flyer-coming-soon__actions">
            <a href="visit.html" class="btn btn-primary">Visit the store</a>
            <a href="${STORE.phoneHref || "tel:+12502606606"}" class="btn btn-ghost">${STORE.phone || "(250) 260-6606"}</a>
          </div>
        </div>
      </div>`;
  }

  function renderCurrentFlyer() {
    if (!currentFlyerEl || !currentFlyer) return;

    currentFlyerEl.innerHTML = `
      <div class="current-flyer current-flyer--featured">
        <div class="current-flyer__image-wrap current-flyer__image-wrap--large">
          <img class="current-flyer__img" src="${currentFlyer.image}" alt="${currentFlyer.title}" />
          <span class="current-flyer__zoom-hint">Click to view full size</span>
        </div>
        <div class="current-flyer__header">
          <p class="section-label">${currentFlyer.label}</p>
          <h2 class="current-flyer__title">${currentFlyer.title}</h2>
          ${
            currentFlyer.description
              ? `<p class="current-flyer__desc">${currentFlyer.description}</p>`
              : ""
          }
        </div>
        <div class="current-flyer__actions">
          <button type="button" class="btn btn-primary current-flyer__view">View full flyer</button>
          <a class="btn btn-ghost" href="index.html#specials">See current deals</a>
        </div>
      </div>`;

    const img = currentFlyerEl.querySelector(".current-flyer__img");
    const open = () => tryOpenFlyer(currentFlyer.image, currentFlyer.title, img);

    img?.addEventListener("error", renderComingSoon);
    if (img?.complete && img.naturalWidth === 0) {
      renderComingSoon();
      return;
    }

    currentFlyerEl.querySelector(".current-flyer__view")?.addEventListener("click", open);
    img?.addEventListener("click", open);
  }

  function renderArchive() {
    if (!archiveEl) return;

    if (!pastFlyers.length) {
      archiveEl.innerHTML = `
        <aside class="stay-tuned" aria-label="Stay tuned">
          <p class="special-tag">Updates</p>
          <h3>Stay tuned for more.</h3>
          <p>
            New flyers and seasonal promotions are added throughout the year. Check back soon,
            follow our in-store boards, or call us for the latest offers.
          </p>
          <div class="ctas">
            <a class="btn btn-primary" href="visit.html">Plan your visit</a>
            <a class="btn btn-ghost" href="${STORE.phoneHref || "tel:+12502606606"}">${STORE.phone || "(250) 260-6606"}</a>
          </div>
        </aside>`;
      return;
    }

    archiveEl.innerHTML = `
      <div class="reveal">
        <span class="section-label">Flyer archive</span>
        <h2 class="section-title">Previous months.</h2>
        <p class="section-lead">Past flyers kept for reference.</p>
      </div>
      <div class="specials-grid flyer-grid">
        ${pastFlyers
          .map(
            (flyer) => `
          <article class="special-card flyer-archive-card" data-flyer-archive="${flyer.image}">
            <div class="flyer-thumb">
              <img src="${flyer.image}" alt="${flyer.title}" data-flyer-archive-img />
              <div class="flyer-fallback">
                <span class="flyer-status">Unavailable</span>
                <strong>${flyer.label}</strong>
              </div>
            </div>
            <div class="flyer-card-body">
              <p class="special-tag">${flyer.label}</p>
              <h3>${flyer.title}</h3>
              <button type="button" class="btn btn-ghost btn-sm" data-flyer-archive-open>
                View flyer
              </button>
            </div>
          </article>`,
          )
          .join("")}
      </div>`;

    archiveEl.querySelectorAll(".flyer-archive-card").forEach((card) => {
      const src = card.getAttribute("data-flyer-archive");
      const img = card.querySelector("[data-flyer-archive-img]");
      const fallback = card.querySelector(".flyer-fallback");
      const btn = card.querySelector("[data-flyer-archive-open]");
      const title = card.querySelector("h3")?.textContent || "Flyer";

      const markMissing = () => {
        if (img) img.style.display = "none";
        fallback?.classList.add("is-shown");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Unavailable";
        }
      };

      img?.addEventListener("error", markMissing);
      if (img?.complete && img.naturalWidth === 0) markMissing();

      btn?.addEventListener("click", () => {
        if (btn.disabled) return;
        tryOpenFlyer(src, title, img);
      });
      img?.addEventListener("click", () => {
        if (btn?.disabled) return;
        tryOpenFlyer(src, title, img);
      });
    });
  }

  function renderCashback() {
    const lp = STORE.loyaltyProgram;
    if (!cashbackEl || !lp) return;
    cashbackEl.innerHTML = `
      <div class="cashback-prompt">
        <span class="cashback-prompt__rate">${lp.rate}</span>
        <div class="cashback-prompt__body">
          <p class="cashback-prompt__title">${lp.headline}</p>
          <p class="cashback-prompt__text">${lp.description} Ask in store to sign up.</p>
        </div>
      </div>`;
  }

  function tryOpenFlyer(src, title, img) {
    if (img && img.complete && img.naturalWidth > 0) openLightbox(src, title);
  }

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Flyer";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.classList.add("flyer-viewer-open");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.classList.remove("flyer-viewer-open");
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();
