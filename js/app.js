/* ==========================================================================
   App logic: all content (item cards, product-type table, glossary,
   evidence) lives in the static HTML already — this file only adds
   filtering, expand/collapse, the energy verdict tool, and navigation
   behavior on top of it. Nothing here injects primary content, so the
   page reads correctly with JavaScript disabled.
   ========================================================================== */

(function () {
  "use strict";

  const SYMBOL_LABEL = { pass: "Passes", warn: "Depends", fail: "Breaks it" };

  /* ------------------------------------------------------------ Quick Check */
  const state = {
    query: "",
    category: "all",
    symbols: new Set(["pass", "warn", "fail"]),
    religiousOnly: false
  };

  const resultsEl = document.getElementById("results");
  const cards = Array.from(resultsEl.querySelectorAll(".card"));
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-state");
  const searchInput = document.getElementById("search-input");

  function matches(card) {
    const category = card.dataset.category;
    const symbol = card.dataset.symbol;
    const religious = card.dataset.religious === "true";

    if (state.category !== "all" && category !== state.category) return false;
    if (!state.symbols.has(symbol)) return false;
    if (state.religiousOnly && !religious) return false;
    if (state.query && !card.textContent.toLowerCase().includes(state.query)) return false;
    return true;
  }

  function render() {
    let visible = 0;
    cards.forEach((card) => {
      const show = matches(card);
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    countEl.textContent = `Showing ${visible} of ${cards.length} items`;
    emptyEl.hidden = visible !== 0;
  }

  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });

  document.querySelectorAll("[data-category]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-category]").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.category = btn.dataset.category;
      render();
    });
  });

  document.querySelectorAll(".qc-chips [data-symbol]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const sym = chip.dataset.symbol;
      if (state.symbols.has(sym)) {
        state.symbols.delete(sym);
        chip.classList.add("is-off");
      } else {
        state.symbols.add(sym);
        chip.classList.remove("is-off");
      }
      render();
    });
  });

  const religiousToggle = document.getElementById("religious-toggle");
  religiousToggle.addEventListener("click", () => {
    state.religiousOnly = !state.religiousOnly;
    religiousToggle.classList.toggle("is-active", state.religiousOnly);
    religiousToggle.setAttribute("aria-pressed", String(state.religiousOnly));
    render();
  });

  document.getElementById("clear-filters").addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    state.symbols = new Set(["pass", "warn", "fail"]);
    state.religiousOnly = false;
    searchInput.value = "";
    document.querySelectorAll("[data-category]").forEach((b) => b.classList.toggle("is-active", b.dataset.category === "all"));
    document.querySelectorAll(".qc-chips [data-symbol]").forEach((c) => c.classList.remove("is-off"));
    religiousToggle.classList.remove("is-active");
    religiousToggle.setAttribute("aria-pressed", "false");
    render();
  });

  resultsEl.addEventListener("click", (e) => {
    const head = e.target.closest(".card__head");
    if (!head) return;
    const card = head.closest(".card");
    const isOpen = card.classList.toggle("is-open");
    head.setAttribute("aria-expanded", String(isOpen));
  });

  render();

  /* ---------------------------------------------------------- Energy matrix */
  const matrixBody = document.getElementById("energy-matrix-body");
  const productSelect = document.getElementById("energy-select");
  const verdictOut = document.getElementById("energy-verdict");
  const laneRadios = document.querySelectorAll('input[name="energy-lane"]');

  function updateVerdict() {
    const type = productSelect.value;
    document.querySelectorAll("#energy-matrix-body tr").forEach((tr) => {
      tr.classList.toggle("is-highlight", type !== "" && tr.dataset.type === type);
    });

    if (!type) {
      verdictOut.innerHTML = `<p class="muted">Pick a product above to see its verdict.</p>`;
      return;
    }

    const row = matrixBody.querySelector(`tr[data-type="${CSS.escape(type)}"]`);
    if (!row) return;
    const lane = [...laneRadios].find((r) => r.checked).value;
    const cell = row.querySelector(`[data-lane="${lane}"]`);
    const symbol = cell.dataset.symbol;
    const note = cell.dataset.note;
    const label = SYMBOL_LABEL[symbol];
    const icon = cell.querySelector(".cell__icon").textContent;

    verdictOut.innerHTML = `
      <div class="verdict verdict--${symbol}">
        <span class="verdict__icon" aria-hidden="true">${icon}</span>
        <div>
          <strong>${label}</strong>
          <p>${note}</p>
        </div>
      </div>`;
  }

  productSelect.addEventListener("change", updateVerdict);
  laneRadios.forEach((r) => r.addEventListener("change", updateVerdict));
  updateVerdict();

  /* ---------------------------------------------------- Glossary / Evidence */
  document.querySelectorAll(".accordion__trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion__item");
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  /* --------------------------------------------------------------- Scrollspy */
  const navLinks = document.querySelectorAll(".sitenav__link");
  const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = "#" + entry.target.id;
          const link = document.querySelector(`.sitenav__link[href="${id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* -------------------------------------------------------------- Back to top */
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 800);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ------------------------------------------------------------- Nav toggle */
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    siteNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }
})();
