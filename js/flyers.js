(() => {
  const lightbox = document.getElementById("flyer-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  document.querySelectorAll("[data-flyer-slot]").forEach((slot) => {
    const img = slot.querySelector("[data-flyer-img]");
    const fallback = slot.querySelector(".flyer-fallback");
    const buttons = slot.querySelectorAll("[data-flyer-open]");

    if (!img) return;

    const markComingSoon = () => {
      img.style.display = "none";
      fallback?.classList.add("is-shown");
      buttons.forEach((btn) => {
        btn.disabled = true;
        btn.textContent = "Coming soon";
      });
    };

    const markReady = () => {
      img.style.display = "block";
      fallback?.classList.remove("is-shown");
      buttons.forEach((btn) => {
        btn.disabled = false;
        btn.textContent = btn.classList.contains("btn-sm") ? "View flyer" : "View full flyer";
      });
    };

    img.addEventListener("error", markComingSoon);
    img.addEventListener("load", markReady);

    if (img.complete) {
      if (img.naturalWidth === 0) markComingSoon();
      else markReady();
    }
  });

  const openLightbox = (src, caption) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Flyer";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.classList.add("flyer-viewer-open");
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.classList.remove("flyer-viewer-open");
  };

  document.querySelectorAll("[data-flyer-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const src = btn.getAttribute("data-src");
      const caption = btn.getAttribute("data-caption") || "Flyer";
      if (!src) return;
      openLightbox(src, caption);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();
