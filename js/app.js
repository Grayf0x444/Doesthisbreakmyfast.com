/* ==========================================================================
   App logic: quick-check filtering, energy matrix, glossary/evidence
   accordions, scrollspy nav, back-to-top.
   ========================================================================== */

(function () {
  "use strict";

  const SYMBOL_META = {
    pass: { icon: "✅", label: "Does not break a fast" },
    warn: { icon: "⚠️", label: "Depends on definition" },
    fail: { icon: "❌", label: "Breaks a fast" }
  };

  /* ------------------------------------------------------------ Quick Check */
  const state = {
    query: "",
    category: "all",
    symbols: new Set(["pass", "warn", "fail"]),
    religiousOnly: false
  };

  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-state");
  const searchInput = document.getElementById("search-input");

  function cardTemplate(item) {
    const meta = SYMBOL_META[item.symbol];
    const religiousBadge = item.religious
      ? `<span class="badge badge--religious" title="Breaks a religious fast even where metabolically neutral">🕌</span>`
      : "";
    return `
      <article class="card card--${item.symbol}" data-id="${item.id}">
        <button class="card__head" aria-expanded="false">
          <span class="card__symbol" aria-hidden="true">${meta.icon}</span>
          <span class="card__titles">
            <span class="card__name">${item.name}</span>
            <span class="card__examples">${item.examples}</span>
          </span>
          ${religiousBadge}
          <span class="card__chevron" aria-hidden="true">▾</span>
        </button>
        <p class="card__summary">${item.summary}</p>
        <div class="card__detail">
          <p>${item.detail}</p>
        </div>
      </article>`;
  }

  function matches(item) {
    if (state.category !== "all" && item.category !== state.category) return false;
    if (!state.symbols.has(item.symbol)) return false;
    if (state.religiousOnly && !item.religious) return false;
    if (state.query) {
      const haystack = (item.name + " " + item.examples + " " + item.detail).toLowerCase();
      if (!haystack.includes(state.query)) return false;
    }
    return true;
  }

  function render() {
    const filtered = ITEMS.filter(matches);
    resultsEl.innerHTML = filtered.map(cardTemplate).join("");
    countEl.textContent = `Showing ${filtered.length} of ${ITEMS.length} items`;
    emptyEl.hidden = filtered.length !== 0;
    resultsEl.hidden = filtered.length === 0;
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

  document.querySelectorAll("[data-symbol]").forEach((chip) => {
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
    document.querySelectorAll("[data-symbol]").forEach((c) => c.classList.remove("is-off"));
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

  function renderMatrix() {
    matrixBody.innerHTML = ENERGY_MATRIX.map((row) => `
      <tr data-type="${row.type}">
        <th scope="row">${row.type}</th>
        <td class="cell cell--${row.fatLoss.symbol}"><span>${SYMBOL_META[row.fatLoss.symbol].icon}</span><small>${row.fatLoss.note}</small></td>
        <td class="cell cell--${row.autophagy.symbol}"><span>${SYMBOL_META[row.autophagy.symbol].icon}</span><small>${row.autophagy.note}</small></td>
        <td class="cell cell--${row.cleanFast.symbol}"><span>${SYMBOL_META[row.cleanFast.symbol].icon}</span><small>${row.cleanFast.note}</small></td>
      </tr>`).join("");
  }
  renderMatrix();

  ENERGY_MATRIX.forEach((row) => {
    const opt = document.createElement("option");
    opt.value = row.type;
    opt.textContent = row.type;
    productSelect.appendChild(opt);
  });

  const laneRadios = document.querySelectorAll('input[name="energy-lane"]');

  function updateVerdict() {
    const type = productSelect.value;
    if (!type) {
      verdictOut.innerHTML = `<p class="muted">Pick a product above to see its verdict.</p>`;
      return;
    }
    const row = ENERGY_MATRIX.find((r) => r.type === type);
    const lane = [...laneRadios].find((r) => r.checked).value;
    const cell = row[lane];
    const meta = SYMBOL_META[cell.symbol];
    document.querySelectorAll("#energy-matrix-body tr").forEach((tr) => {
      tr.classList.toggle("is-highlight", tr.dataset.type === type);
    });
    verdictOut.innerHTML = `
      <div class="verdict verdict--${cell.symbol}">
        <span class="verdict__icon" aria-hidden="true">${meta.icon}</span>
        <div>
          <strong>${meta.label}</strong>
          <p>${cell.note}</p>
        </div>
      </div>`;
  }

  productSelect.addEventListener("change", updateVerdict);
  laneRadios.forEach((r) => r.addEventListener("change", updateVerdict));
  updateVerdict();

  /* --------------------------------------------------------------- Glossary */
  const glossaryList = document.getElementById("glossary-list");
  glossaryList.innerHTML = GLOSSARY.map((g, i) => `
    <div class="accordion__item">
      <button class="accordion__trigger" aria-expanded="false" aria-controls="gloss-${i}">
        <span>${g.term}</span>
        <span class="accordion__chevron" aria-hidden="true">▾</span>
      </button>
      <div class="accordion__panel" id="gloss-${i}">
        <p>${g.body}</p>
      </div>
    </div>`).join("");

  /* --------------------------------------------------------------- Evidence */
  const evidenceList = document.getElementById("evidence-list");
  evidenceList.innerHTML = EVIDENCE.map((ev, i) => `
    <div class="accordion__item">
      <button class="accordion__trigger" aria-expanded="false" aria-controls="ev-${i}">
        <span>${ev.title}</span>
        <span class="accordion__chevron" aria-hidden="true">▾</span>
      </button>
      <div class="accordion__panel" id="ev-${i}">
        <p>${ev.body}</p>
      </div>
    </div>`).join("");

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
