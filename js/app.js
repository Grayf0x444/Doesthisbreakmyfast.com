/* ==========================================================================
   App logic: filtering, expand/collapse, the energy verdict tool, and
   navigation behavior. Content (item cards, product-type table, glossary,
   evidence) lives in the static HTML.
   ========================================================================== */

(function () {
  "use strict";

  const SYMBOL_LABEL = { pass: "Passes", warn: "Depends", fail: "Breaks it" };

  function safe(fn, label) {
    try {
      fn();
    } catch (err) {
      console.error("[app.js]" + (label ? " " + label : ""), err);
    }
  }

  /* ------------------------------------------------------------ Quick Check */
  safe(function initQuickCheck() {
    const resultsEl = document.getElementById("results");
    const countEl = document.getElementById("result-count");
    const emptyEl = document.getElementById("empty-state");
    const searchInput = document.getElementById("search-input");
    const clearBtn = document.getElementById("clear-filters");
    const religiousToggle = document.getElementById("religious-toggle");
    const tabButtons = document.querySelectorAll(".qc-tabs [data-category]");
    const chipButtons = document.querySelectorAll(".qc-chips [data-symbol]");

    if (!resultsEl || !countEl || !searchInput) return;

    const cards = Array.from(resultsEl.querySelectorAll(".card"));
    if (!cards.length) return;

    // Build a search index from the visible name/examples/summary/detail
    // text only — not the whole card (which also contains verdict labels
    // like "Passes" / "Depends" / "Breaks it" that would otherwise match
    // unrelated searches such as "depends").
    const searchIndex = new Map(
      cards.map((card) => {
        const parts = [".card__name", ".card__examples", ".card__summary", ".card__detail"]
          .map((sel) => card.querySelector(sel))
          .filter(Boolean)
          .map((el) => el.textContent);
        return [card, parts.join(" ").toLowerCase()];
      })
    );

    const state = {
      query: "",
      category: "all",
      symbols: new Set(["pass", "warn", "fail"]),
      religiousOnly: false
    };

    function matches(card) {
      const category = card.dataset.category;
      const symbol = card.dataset.symbol;
      const religious = card.dataset.religious === "true";

      if (state.category !== "all" && category !== state.category) return false;
      if (!state.symbols.has(symbol)) return false;
      if (state.religiousOnly && !religious) return false;
      if (state.query && !(searchIndex.get(card) || "").includes(state.query)) return false;
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
      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    searchInput.addEventListener("input", (e) => {
      state.query = e.target.value.trim().toLowerCase();
      render();
    });

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        state.category = btn.dataset.category;
        render();
      });
    });

    chipButtons.forEach((chip) => {
      chip.addEventListener("click", () => {
        const sym = chip.dataset.symbol;
        if (state.symbols.has(sym)) {
          state.symbols.delete(sym);
          chip.classList.add("is-off");
        } else {
          state.symbols.add(sym);
          chip.classList.remove("is-off");
        }
        chip.setAttribute("aria-pressed", String(!chip.classList.contains("is-off")));
        render();
      });
    });

    if (religiousToggle) {
      religiousToggle.addEventListener("click", () => {
        state.religiousOnly = !state.religiousOnly;
        religiousToggle.classList.toggle("is-active", state.religiousOnly);
        religiousToggle.setAttribute("aria-pressed", String(state.religiousOnly));
        render();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.query = "";
        state.category = "all";
        state.symbols = new Set(["pass", "warn", "fail"]);
        state.religiousOnly = false;
        searchInput.value = "";
        tabButtons.forEach((b) => {
          const isAll = b.dataset.category === "all";
          b.classList.toggle("is-active", isAll);
          b.setAttribute("aria-pressed", String(isAll));
        });
        chipButtons.forEach((c) => {
          c.classList.remove("is-off");
          c.setAttribute("aria-pressed", "true");
        });
        if (religiousToggle) {
          religiousToggle.classList.remove("is-active");
          religiousToggle.setAttribute("aria-pressed", "false");
        }
        render();
      });
    }

    resultsEl.addEventListener("click", (e) => {
      const head = e.target.closest(".card__head");
      if (!head) return;
      const card = head.closest(".card");
      const isOpen = card.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(isOpen));
    });

    render();
  }, "initQuickCheck");

  /* ---------------------------------------------------------- Energy matrix */
  safe(function initEnergyTool() {
    const matrixBody = document.getElementById("energy-matrix-body");
    const productSelect = document.getElementById("energy-select");
    const verdictOut = document.getElementById("energy-verdict");
    const laneRadios = document.querySelectorAll('input[name="energy-lane"]');

    if (!matrixBody || !productSelect || !verdictOut || !laneRadios.length) return;

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
      const checkedLane = Array.from(laneRadios).find((r) => r.checked);
      if (!checkedLane) return;
      const cell = row.querySelector(`[data-lane="${checkedLane.value}"]`);
      if (!cell) return;
      const symbol = cell.dataset.symbol;
      const note = cell.dataset.note;
      const label = SYMBOL_LABEL[symbol];
      const iconEl = cell.querySelector(".cell__icon");
      const icon = iconEl ? iconEl.textContent : "";

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
  }, "initEnergyTool");

  /* ---------------------------------------------------- Glossary / Evidence */
  safe(function initAccordions() {
    const triggers = document.querySelectorAll(".accordion__trigger");
    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion__item");
        if (!item) return;
        const isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }, "initAccordions");

  /* --------------------------------------------------------------- Scrollspy */
  safe(function initScrollspy() {
    const navLinks = document.querySelectorAll(".sitenav__link");
    if (!navLinks.length || !("IntersectionObserver" in window)) return;

    const sections = Array.from(navLinks)
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    if (!sections.length) return;

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
  }, "initScrollspy");

  /* -------------------------------------------------------------- Back to top */
  safe(function initBackToTop() {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 800);
      },
      { passive: true }
    );

    backToTop.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }, "initBackToTop");

  /* ------------------------------------------------------------- Nav toggle */
  safe(function initNavToggle() {
    const navToggle = document.getElementById("nav-toggle");
    const siteNav = document.getElementById("site-nav");
    if (!navToggle || !siteNav) return;

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
  }, "initNavToggle");
})();
