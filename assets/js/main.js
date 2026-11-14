/* ==========================================================================
   IRONFIELD AGRI RENTALS — MAIN APPLICATION JAVASCRIPT
   Handles: Theme Toggle, RTL Toggle, Navbar Dropdowns, Equipment Filtering,
   Spec Modals, INR Calculators, Auth Forms, Farmer Dashboard & GSAP Animations.
   ========================================================================== */

(function () {
  "use strict";

  const THEME_STORAGE_KEY = "ironfield_theme_preference";
  const DIR_STORAGE_KEY = "ironfield_dir_preference";
  const BOOKINGS_STORAGE_KEY = "ironfield_farmer_bookings_v1";

  /* --------------------------------------------------------------------------
     1. THEME & RTL DIRECTION MANAGEMENT (WITH LOCALSTORAGE)
     -------------------------------------------------------------------------- */
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {
      // ignore storage errors
    }
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // ignore storage errors
    }

    const toggleBtns = document.querySelectorAll("[data-theme-toggle]");
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (theme === "dark") {
        if (icon) icon.className = "bi bi-sun-fill";
        btn.setAttribute("aria-label", "Switch to light theme");
        btn.setAttribute("title", "Switch to Light Mode");
      } else {
        if (icon) icon.className = "bi bi-moon-stars-fill";
        btn.setAttribute("aria-label", "Switch to dark theme");
        btn.setAttribute("title", "Switch to Dark Mode");
      }
    });
  }

  function getInitialDir() {
    try {
      const saved = localStorage.getItem(DIR_STORAGE_KEY);
      if (saved === "rtl" || saved === "ltr") return saved;
    } catch (e) {
      // ignore storage errors
    }
    return "ltr";
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute("dir", dir);
    try {
      localStorage.setItem(DIR_STORAGE_KEY, dir);
    } catch (e) {
      // ignore storage errors
    }

    document.querySelectorAll("[data-rtl-toggle]").forEach((btn) => {
      btn.textContent = "RTL";
      btn.classList.toggle("is-rtl", dir === "rtl");
      btn.setAttribute("aria-pressed", dir === "rtl" ? "true" : "false");
      btn.setAttribute(
        "title",
        dir === "rtl" ? "Switch to LTR Layout" : "Switch to RTL Layout"
      );
    });
  }

  applyTheme(getInitialTheme());
  applyDirection(getInitialDir());

  /* --------------------------------------------------------------------------
     2. FORMAT CURRENCY HELPER (INR ₹)
     -------------------------------------------------------------------------- */
  function formatINR(amount) {
    const num = Number(amount) || 0;
    return "₹" + num.toLocaleString("en-IN");
  }

  /* --------------------------------------------------------------------------
     3. IMAGE FALLBACK PROTECTION
     -------------------------------------------------------------------------- */
  function initImageFallbacks() {
    const fallbackSvg =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
          <rect width="800" height="500" fill="#18392b"/>
          <path d="M0 390 L800 390 L800 500 L0 500 Z" fill="#11271e"/>
          <circle cx="290" cy="340" r="65" fill="#161917" stroke="#e09a1f" stroke-width="10"/>
          <circle cx="520" cy="360" r="45" fill="#161917" stroke="#e09a1f" stroke-width="8"/>
          <rect x="260" y="210" width="160" height="95" rx="8" fill="#e09a1f"/>
          <rect x="420" y="245" width="120" height="65" rx="6" fill="#23533f" stroke="#e09a1f" stroke-width="4"/>
          <text x="400" y="130" text-anchor="middle" fill="#f5f3ec" font-family="sans-serif" font-weight="bold" font-size="26">IRONFIELD AGRI MACHINERY</text>
        </svg>`
      );

    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("error", function () {
        if (this.dataset.fallbackApplied) return;
        this.dataset.fallbackApplied = "true";
        this.src = fallbackSvg;
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. NAVBAR DROPDOWN (HOVER + CLICK) & STICKY SCROLL
     -------------------------------------------------------------------------- */
  function initNavbar() {
    const navbar = document.querySelector(".site-navbar");
    if (navbar) {
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > 20) {
            navbar.classList.add("navbar-scrolled");
          } else {
            navbar.classList.remove("navbar-scrolled");
          }
        },
        { passive: true }
      );
    }

    const dropdowns = document.querySelectorAll(".site-navbar .nav-item.dropdown");
    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      const menu = dropdown.querySelector(".dropdown-menu");
      if (!toggle || !menu) return;

      dropdown.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 992) {
          menu.classList.add("show");
          toggle.setAttribute("aria-expanded", "true");
        }
      });

      dropdown.addEventListener("mouseleave", () => {
        if (window.innerWidth >= 992) {
          menu.classList.remove("show");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. CONFIGURABLE CONTACT & WHATSAPP LINKS
     -------------------------------------------------------------------------- */
  function initConfigurableContacts() {
    const cfg = window.IRONFIELD_CONFIG;
    if (!cfg) return;

    document.querySelectorAll("[data-whatsapp-link]").forEach((el) => {
      const customMsg = el.getAttribute("data-whatsapp-msg") || cfg.whatsappDefaultMsg;
      el.setAttribute(
        "href",
        `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(customMsg)}`
      );
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    document.querySelectorAll("[data-phone-link]").forEach((el) => {
      el.setAttribute("href", cfg.phoneHref);
    });

    document.querySelectorAll("[data-email-link]").forEach((el) => {
      el.setAttribute("href", cfg.emailHref);
    });

    document.querySelectorAll("[data-directions-link]").forEach((el) => {
      el.setAttribute("href", cfg.directionsUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* --------------------------------------------------------------------------
     6. RENDER EQUIPMENT CARD HTML
     -------------------------------------------------------------------------- */
  function createEquipmentCardHTML(item) {
    return `
      <div class="col-md-6 col-xl-4 equipment-col" data-category="${item.category}" data-subcategory="${item.subCategory}">
        <article class="equipment-card">
          <div class="equipment-img-wrap">
            <img src="${item.image}" alt="${item.name} - ${item.subCategory}" loading="lazy">
            <span class="equipment-cat-tag">${item.subCategory}</span>
          </div>
          <div class="equipment-card-body">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-1 flex-wrap">
              <span class="equipment-brand-code d-block">${item.brand} &bull; ${item.model}</span>
              <span class="status-pill ${item.statusClass}">${item.availability}</span>
            </div>
            <h3 class="equipment-title d-block">${item.name}</h3>
            <p class="text-secondary-custom small mb-3 d-block">${item.description}</p>

            <div class="spec-grid-mini">
              <div class="spec-item-mini">
                <span class="spec-label-mini">Power / Match</span>
                <span class="spec-value-mini">${item.powerSpec}</span>
              </div>
              <div class="spec-item-mini">
                <span class="spec-label-mini">Configuration</span>
                <span class="spec-value-mini">${item.secondarySpec}</span>
              </div>
              <div class="spec-item-mini">
                <span class="spec-label-mini">Capacity / Width</span>
                <span class="spec-value-mini">${item.workingCapacity}</span>
              </div>
              <div class="spec-item-mini">
                <span class="spec-label-mini">Rental Terms</span>
                <span class="spec-value-mini">${item.durations}</span>
              </div>
            </div>

            <div class="equipment-rate-matrix" aria-label="Rental Rates in INR">
              <div class="rate-cell rate-cell-highlight">
                <span class="rate-period">Daily</span>
                <span class="rate-amount">${formatINR(item.rates.daily)}</span>
              </div>
              <div class="rate-cell">
                <span class="rate-period">Weekly</span>
                <span class="rate-amount">${formatINR(item.rates.weekly)}</span>
              </div>
              <div class="rate-cell">
                <span class="rate-period">Monthly</span>
                <span class="rate-amount">${formatINR(item.rates.monthly)}</span>
              </div>
            </div>

            <div class="equipment-card-actions mt-auto pt-2">
              <a href="contact.html?equipment=${encodeURIComponent(item.slug)}#enquiry-form" class="btn-agri-primary">
                <i class="bi bi-calendar2-check"></i> Rent This Equipment
              </a>
              <button type="button" class="btn-agri-outline" data-view-details="${item.slug}">
                <i class="bi bi-sliders2"></i> View Details
              </button>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7. EQUIPMENT CATALOGUE PAGE FILTERING & SEARCH
     -------------------------------------------------------------------------- */
  function initEquipmentCatalogue() {
    const gridContainer = document.getElementById("equipmentCatalogueGrid");
    if (!gridContainer || !window.EQUIPMENT_DATA) return;

    const categoryBtns = document.querySelectorAll("[data-filter-category]");
    const subCategoryBtns = document.querySelectorAll("[data-filter-sub]");
    const searchInput = document.getElementById("equipmentSearchInput");
    const availabilitySelect = document.getElementById("equipmentAvailabilityFilter");
    const sortSelect = document.getElementById("equipmentSortFilter");
    const countBadge = document.getElementById("equipmentResultCount");
    const resetBtn = document.getElementById("resetEquipmentFilters");
    const viewModeBtns = document.querySelectorAll("[data-view-mode]");

    let activeCategory = "all";
    let activeSubCategory = "all";
    let searchQuery = "";
    let availabilityMode = "all";
    let sortBy = "featured";

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("category")) activeCategory = urlParams.get("category");
    if (urlParams.get("sub")) activeSubCategory = urlParams.get("sub");
    if (urlParams.get("q")) {
      searchQuery = urlParams.get("q");
      if (searchInput) searchInput.value = searchQuery;
    }

    function syncActiveButtons() {
      categoryBtns.forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.getAttribute("data-filter-category") === activeCategory
        );
      });
      subCategoryBtns.forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.getAttribute("data-filter-sub") === activeSubCategory
        );
      });
    }

    function renderCatalogue() {
      let filtered = window.EQUIPMENT_DATA.filter((item) => {
        const matchCat =
          activeCategory === "all" || item.category === activeCategory;
        const matchSub =
          activeSubCategory === "all" ||
          item.subCategory.toLowerCase() === activeSubCategory.toLowerCase();
        const matchAvail =
          availabilityMode === "all" ||
          (availabilityMode === "available" &&
            item.statusClass === "status-available");

        const q = searchQuery.trim().toLowerCase();
        const matchSearch =
          !q ||
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q) ||
          item.subCategory.toLowerCase().includes(q) ||
          item.powerSpec.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);

        return matchCat && matchSub && matchAvail && matchSearch;
      });

      if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.rates.daily - b.rates.daily);
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.rates.daily - a.rates.daily);
      } else if (sortBy === "name-asc") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (countBadge) {
        countBadge.textContent = `${filtered.length} ${
          filtered.length === 1 ? "Machine" : "Machines"
        } Displayed`;
      }

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div class="col-12">
            <div class="feature-box-agri text-center py-5">
              <i class="bi bi-search fs-1 text-accent mb-3 d-block"></i>
              <h3 class="font-heading text-uppercase">No Matching Machinery Found</h3>
              <p class="text-secondary-custom mb-4">No equipment matched your current filter combination. Reset filters to view all 17 tractors, harvesters, and implements.</p>
              <button type="button" class="btn-agri-primary" id="emptyStateResetBtn">Show Full Equipment Fleet</button>
            </div>
          </div>
        `;
        const emptyReset = document.getElementById("emptyStateResetBtn");
        if (emptyReset) emptyReset.addEventListener("click", resetAllFilters);
        return;
      }

      gridContainer.innerHTML = filtered.map(createEquipmentCardHTML).join("");
      initImageFallbacks();
    }

    function resetAllFilters() {
      activeCategory = "all";
      activeSubCategory = "all";
      searchQuery = "";
      availabilityMode = "all";
      sortBy = "featured";
      if (searchInput) searchInput.value = "";
      if (availabilitySelect) availabilitySelect.value = "all";
      if (sortSelect) sortSelect.value = "featured";
      syncActiveButtons();
      renderCatalogue();
    }

    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.getAttribute("data-filter-category");
        activeSubCategory = "all";
        syncActiveButtons();
        renderCatalogue();
      });
    });

    subCategoryBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeSubCategory = btn.getAttribute("data-filter-sub");
        syncActiveButtons();
        renderCatalogue();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderCatalogue();
      });
    }

    if (availabilitySelect) {
      availabilitySelect.addEventListener("change", (e) => {
        availabilityMode = e.target.value;
        renderCatalogue();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderCatalogue();
      });
    }

    if (resetBtn) resetBtn.addEventListener("click", resetAllFilters);

    viewModeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-view-mode");
        viewModeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        gridContainer.classList.toggle("list-view", mode === "list");
      });
    });

    syncActiveButtons();
    renderCatalogue();
  }

  /* --------------------------------------------------------------------------
     8. FEATURED MACHINERY RENDERER (HOME 1)
     -------------------------------------------------------------------------- */
  function initHomeFeaturedEquipment() {
    const featuredContainer = document.getElementById("homeFeaturedGrid");
    if (!featuredContainer || !window.EQUIPMENT_DATA) return;

    const featuredItems = window.EQUIPMENT_DATA.filter((item) => item.featured).slice(0, 6);
    featuredContainer.innerHTML = featuredItems.map(createEquipmentCardHTML).join("");
    initImageFallbacks();
  }

  /* --------------------------------------------------------------------------
     9. EQUIPMENT TECHNICAL SPECIFICATION MODAL (DELEGATED CLICK)
     -------------------------------------------------------------------------- */
  function ensureSpecModalExists() {
    if (document.getElementById("equipmentDetailModal")) return;

    const modalHTML = `
      <div class="modal fade" id="equipmentDetailModal" tabindex="-1" aria-labelledby="equipmentDetailModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content modal-content-agri">
            <div class="modal-header">
              <div>
                <span class="eyebrow-tag mb-1" id="modalEqSubCategory">Technical Datasheet</span>
                <h3 class="modal-title font-heading text-uppercase mb-0" id="equipmentDetailModalLabel">Equipment Specifications</h3>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="equipmentDetailModalBody"></div>
            <div class="modal-footer justify-content-between flex-wrap gap-2">
              <div class="small text-muted-custom">
                <i class="bi bi-info-circle text-accent me-1"></i>Sample data &bull; Fuel &amp; operator excluded unless configured
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn-agri-outline py-2 px-3" data-bs-dismiss="modal">Close</button>
                <a href="contact.html#enquiry-form" id="modalRentEquipmentBtn" class="btn-agri-primary py-2 px-4">
                  <i class="bi bi-calendar2-check"></i> Rent This Equipment
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  function openEquipmentModal(slug) {
    if (!window.EQUIPMENT_DATA) return;
    const item = window.EQUIPMENT_DATA.find((eq) => eq.slug === slug || eq.id === slug);
    if (!item) return;

    ensureSpecModalExists();

    const titleEl = document.getElementById("equipmentDetailModalLabel");
    const subCatEl = document.getElementById("modalEqSubCategory");
    const bodyEl = document.getElementById("equipmentDetailModalBody");
    const rentBtn = document.getElementById("modalRentEquipmentBtn");

    if (titleEl) titleEl.textContent = item.name;
    if (subCatEl) subCatEl.textContent = `${item.categoryLabel} — ${item.subCategory}`;
    if (rentBtn) {
      rentBtn.setAttribute(
        "href",
        `contact.html?equipment=${encodeURIComponent(item.slug)}#enquiry-form`
      );
    }

    const specsRows = Object.entries(item.technicalSpecs || {})
      .map(
        ([key, val]) => `
        <tr>
          <th scope="row" class="spec-table-key">${key}</th>
          <td class="spec-table-val font-mono">${val}</td>
        </tr>
      `
      )
      .join("");

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="row g-4 align-items-start">
          <div class="col-md-5">
            <div class="rounded overflow-hidden border border-secondary-subtle mb-3">
              <img src="${item.image}" alt="${item.name}" class="w-100" style="aspect-ratio:16/11;object-fit:cover;">
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="small text-muted-custom font-mono">Brand / Model:</span>
              <strong class="font-mono small">${item.brand} ${item.model}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="small text-muted-custom font-mono">Fleet Status:</span>
              <span class="status-pill ${item.statusClass}">${item.availability}</span>
            </div>
            <div class="p-3 rounded bg-surface-alt border mb-3">
              <div class="small fw-bold text-uppercase mb-2 font-mono">Standard INR Rental Rates</div>
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span>Daily Rate (8 Engine Hrs)</span>
                <strong class="font-mono text-accent">${formatINR(item.rates.daily)}/day</strong>
              </div>
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span>Weekly Rate (6 Working Days)</span>
                <strong class="font-mono">${formatINR(item.rates.weekly)}/wk</strong>
              </div>
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span>Monthly Seasonal Rate</span>
                <strong class="font-mono">${formatINR(item.rates.monthly)}/mo</strong>
              </div>
              <div class="d-flex justify-content-between pt-2">
                <span>Refundable Security Deposit</span>
                <strong class="font-mono">${formatINR(item.rates.securityDeposit)}</strong>
              </div>
            </div>
          </div>
          <div class="col-md-7">
            <h5 class="font-heading text-uppercase mb-2">Operational Overview</h5>
            <p class="text-secondary-custom mb-3">${item.description}</p>
            <h5 class="font-heading text-uppercase mb-2">Technical Specifications</h5>
            <div class="table-responsive border rounded mb-3">
              <table class="table-agri-specs">
                <tbody>
                  ${specsRows}
                </tbody>
              </table>
            </div>
            <div class="p-3 rounded border border-warning-subtle" style="background:var(--clr-accent-subtle);">
              <strong class="d-block small text-uppercase font-mono mb-1"><i class="bi bi-shield-check me-1"></i>Rental Terms &amp; Conditions</strong>
              <p class="small mb-0 text-secondary-custom">${item.rentalConditions}</p>
            </div>
          </div>
        </div>
      `;
    }

    const modalEl = document.getElementById("equipmentDetailModal");
    if (window.bootstrap && window.bootstrap.Modal) {
      const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  /* --------------------------------------------------------------------------
     10. HOME 2 & RATES PAGE INTERACTIVE DURATION & COST ESTIMATOR
     -------------------------------------------------------------------------- */
  function initRateCalculators() {
    const durationSwitchBtns = document.querySelectorAll("[data-rate-duration-switch]");
    if (durationSwitchBtns.length > 0) {
      durationSwitchBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const period = btn.getAttribute("data-rate-duration-switch");
          durationSwitchBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          document.querySelectorAll("[data-dynamic-rate]").forEach((priceEl) => {
            const val = priceEl.getAttribute(`data-rate-${period}`);
            const suffixEl = priceEl.parentElement.querySelector("[data-rate-suffix]");
            if (val) priceEl.textContent = formatINR(val);
            if (suffixEl) {
              suffixEl.textContent =
                period === "daily" ? "/ Day" : period === "weekly" ? "/ Week" : "/ Month";
            }
          });
        });
      });
    }

    const calcMachineSelect = document.getElementById("calcMachineSelect");
    const calcDurationSelect = document.getElementById("calcDurationSelect");
    const calcQtyInput = document.getElementById("calcQtyInput");
    const calcOperatorCheck = document.getElementById("calcOperatorCheck");
    const calcDeliveryKm = document.getElementById("calcDeliveryKm");

    if (calcMachineSelect && window.EQUIPMENT_DATA) {
      calcMachineSelect.innerHTML = window.EQUIPMENT_DATA.map(
        (eq) =>
          `<option value="${eq.slug}">${eq.name} (${eq.subCategory}) — ${formatINR(
            eq.rates.daily
          )}/day</option>`
      ).join("");

      const updateCalculation = () => {
        const slug = calcMachineSelect.value;
        const eq =
          window.EQUIPMENT_DATA.find((item) => item.slug === slug) ||
          window.EQUIPMENT_DATA[0];
        const durationType = calcDurationSelect ? calcDurationSelect.value : "daily";
        const qty = Math.max(1, parseInt(calcQtyInput ? calcQtyInput.value : "1", 10) || 1);
        const includeOperator = calcOperatorCheck ? calcOperatorCheck.checked : false;
        const distanceKm = Math.max(0, parseInt(calcDeliveryKm ? calcDeliveryKm.value : "0", 10) || 0);

        const baseUnitRate = eq.rates[durationType] || eq.rates.daily;
        const baseSubtotal = baseUnitRate * qty;

        const equivalentDays =
          durationType === "daily" ? qty : durationType === "weekly" ? qty * 6 : qty * 26;
        const operatorCost = includeOperator ? equivalentDays * 950 : 0;
        const billableKm = Math.max(0, distanceKm - 10);
        const deliveryCost = billableKm * 45;
        const totalEstimate = baseSubtotal + operatorCost + deliveryCost;

        const setElText = (id, text) => {
          const el = document.getElementById(id);
          if (el) el.textContent = text;
        };

        setElText("calcBaseCostDisplay", formatINR(baseSubtotal));
        setElText("calcOperatorCostDisplay", formatINR(operatorCost));
        setElText(
          "calcDeliveryCostDisplay",
          deliveryCost === 0 ? "₹0 (Within 10km / Pickup)" : formatINR(deliveryCost)
        );
        setElText("calcDepositDisplay", formatINR(eq.rates.securityDeposit));
        setElText("calcTotalEstimateDisplay", formatINR(totalEstimate));

        const bookQuoteLink = document.getElementById("calcBookQuoteLink");
        if (bookQuoteLink) {
          bookQuoteLink.setAttribute(
            "href",
            `contact.html?equipment=${encodeURIComponent(eq.slug)}&duration=${encodeURIComponent(
              durationType
            )}#enquiry-form`
          );
        }
      };

      [
        calcMachineSelect,
        calcDurationSelect,
        calcQtyInput,
        calcOperatorCheck,
        calcDeliveryKm
      ].forEach((input) => {
        if (input) {
          input.addEventListener("change", updateCalculation);
          input.addEventListener("input", updateCalculation);
        }
      });

      updateCalculation();
    }
  }

  /* --------------------------------------------------------------------------
     11. CONTACT & RENTAL ENQUIRY FORM INITIALIZATION & VALIDATION
     -------------------------------------------------------------------------- */
  function initRentalEnquiryForm() {
    const enquiryForm = document.getElementById("rentalEnquiryForm");
    if (!enquiryForm) return;

    const eqSelect = document.getElementById("enquiryEquipment");
    const startDateInput = document.getElementById("enquiryStartDate");
    const durationSelect = document.getElementById("enquiryDuration");

    if (eqSelect && window.EQUIPMENT_DATA) {
      const grouped = {
        Tractors: window.EQUIPMENT_DATA.filter((i) => i.category === "tractors"),
        "Land Preparation Equipment": window.EQUIPMENT_DATA.filter(
          (i) => i.category === "land-prep"
        ),
        "Planting & Harvesting Equipment": window.EQUIPMENT_DATA.filter(
          (i) => i.category === "planting-harvesting"
        ),
        "Other Agricultural Machinery": window.EQUIPMENT_DATA.filter(
          (i) => i.category === "other-machinery"
        )
      };

      let optionsHTML = `<option value="">-- Select Required Tractor or Equipment --</option>`;
      Object.entries(grouped).forEach(([groupLabel, items]) => {
        optionsHTML += `<optgroup label="${groupLabel}">`;
        items.forEach((item) => {
          optionsHTML += `<option value="${item.slug}">${item.name} (${formatINR(
            item.rates.daily
          )}/day)</option>`;
        });
        optionsHTML += `</optgroup>`;
      });
      optionsHTML += `<option value="custom-multi-machine">Multiple Machines / Custom Fleet Package</option>`;
      eqSelect.innerHTML = optionsHTML;
    }

    if (startDateInput) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const todayIso = `${yyyy}-${mm}-${dd}`;
      startDateInput.setAttribute("min", todayIso);
      if (!startDateInput.value) startDateInput.value = todayIso;
    }

    const params = new URLSearchParams(window.location.search);
    const preEq = params.get("equipment");
    const preDur = params.get("duration");
    if (preEq && eqSelect) eqSelect.value = preEq;
    if (preDur && durationSelect) {
      if (preDur === "daily") durationSelect.value = "Daily Rental (1–6 Days)";
      if (preDur === "weekly") durationSelect.value = "Weekly Rental (1–3 Weeks)";
      if (preDur === "monthly") durationSelect.value = "Monthly / Seasonal Contract";
    }

    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.getElementById("enquiryFullName");
      const phone = document.getElementById("enquiryPhone");
      const email = document.getElementById("enquiryEmail");
      const equipment = document.getElementById("enquiryEquipment");
      const startDate = document.getElementById("enquiryStartDate");
      const duration = document.getElementById("enquiryDuration");
      const location = document.getElementById("enquiryLocation");
      const feedbackBox = document.getElementById("enquiryFormFeedback");

      let errors = [];
      if (!fullName || fullName.value.trim().length < 2) errors.push("Please enter your full name.");
      const cleanedPhone = phone ? phone.value.replace(/\D/g, "") : "";
      if (cleanedPhone.length < 10) errors.push("Please enter a valid 10-digit mobile or phone number.");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) errors.push("Please enter a valid email address.");
      if (!equipment || !equipment.value) errors.push("Please select the agricultural equipment required.");
      if (!startDate || !startDate.value) errors.push("Please select your preferred rental start date.");
      if (!duration || !duration.value) errors.push("Please select your preferred rental duration.");
      if (!location || location.value.trim().length < 3) errors.push("Please enter your farm village, tehsil, or district location.");

      if (errors.length > 0) {
        if (feedbackBox) {
          feedbackBox.innerHTML = `
            <div class="alert alert-danger border-danger mb-0" role="alert">
              <strong class="d-block mb-1"><i class="bi bi-exclamation-triangle-fill me-2"></i>Please review the following fields:</strong>
              <ul class="mb-0 ps-3 small">${errors.map((err) => `<li>${err}</li>`).join("")}</ul>
            </div>
          `;
          feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      const selectedText = equipment.options[equipment.selectedIndex]?.text || equipment.value;
      const refCode = "IF-ENQ-" + Math.floor(100000 + Math.random() * 900000);
      const waMsg = `Hello IronField Agri Rentals, Enquiry Ref: ${refCode}. Name: ${fullName.value.trim()}, Phone: ${phone.value.trim()}, Equipment: ${selectedText}, Start Date: ${startDate.value}, Duration: ${duration.value}, Farm Location: ${location.value.trim()}.`;
      const waHref = `https://wa.me/${
        window.IRONFIELD_CONFIG?.whatsappNumber || "919876543210"
      }?text=${encodeURIComponent(waMsg)}`;

      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div class="p-4 rounded border border-success" style="background:var(--status-available-bg);color:var(--text-main);">
            <div class="d-flex align-items-center gap-2 mb-2">
              <i class="bi bi-check-circle-fill fs-4" style="color:var(--status-available-text);"></i>
              <h5 class="font-heading text-uppercase mb-0">Rental Enquiry Prepared — Reference #${refCode}</h5>
            </div>
            <p class="small mb-2">
              Thank you, <strong>${fullName.value.trim()}</strong>. Your rental enquiry for <strong>${selectedText}</strong> starting <strong>${startDate.value}</strong> (${duration.value}) at <strong>${location.value.trim()}</strong> has been validated.
            </p>
            <p class="small text-secondary-custom mb-3">
              <em>Note: This is a frontend template demonstration — submitting this form does not confirm a live database booking until connected to your backend API. You can forward this enquiry directly to our dispatch desk via WhatsApp below:</em>
            </p>
            <div class="d-flex flex-wrap gap-2">
              <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="btn-agri-forest py-2 px-3" style="font-size:0.9rem;">
                <i class="bi bi-whatsapp"></i> Send Enquiry Summary on WhatsApp
              </a>
              <button type="button" class="btn-agri-outline py-2 px-3" style="font-size:0.9rem;" onclick="document.getElementById('rentalEnquiryForm').reset();">
                Reset Form
              </button>
            </div>
          </div>
        `;
        feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  /* --------------------------------------------------------------------------
     12. AUTHENTICATION PAGES (LOGIN, SIGN UP & GOOGLE/APPLE SOCIAL ACTIONS)
     -------------------------------------------------------------------------- */
  function initAuthPages() {
    document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-toggle-password");
        const input = document.getElementById(targetId);
        const icon = btn.querySelector("i");
        if (!input) return;

        if (input.type === "password") {
          input.type = "text";
          if (icon) icon.className = "bi bi-eye-slash-fill";
          btn.setAttribute("aria-label", "Hide password");
        } else {
          input.type = "password";
          if (icon) icon.className = "bi bi-eye-fill";
          btn.setAttribute("aria-label", "Show password");
        }
      });
    });

    // Social Google / Apple Auth buttons feedback
    document.querySelectorAll("[data-social-auth]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const provider = btn.getAttribute("data-social-auth");
        const feedback =
          document.getElementById("loginFormFeedback") ||
          document.getElementById("signupFormFeedback");
        if (feedback) {
          feedback.innerHTML = `
            <div class="p-3 rounded border" style="background:var(--clr-accent-subtle);border-color:var(--border-accent) !important;">
              <strong class="d-block small mb-1"><i class="bi bi-shield-check me-1 text-accent"></i>${provider} OAuth Ready</strong>
              <span class="small text-secondary-custom d-block mb-2">Frontend ${provider} sign-in button verified. Connect your OAuth Client ID to enable live authentication, or preview the Farmer Dashboard now.</span>
              <a href="dashboard.html" class="btn-agri-primary py-1 px-3" style="font-size:0.84rem;">Open Farmer Dashboard</a>
            </div>
          `;
        }
      });
    });

    const loginForm = document.getElementById("farmerLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const identifier = document.getElementById("loginIdentifier");
        const password = document.getElementById("loginPassword");
        const feedback = document.getElementById("loginFormFeedback");

        if (!identifier || identifier.value.trim().length < 4) {
          if (feedback) {
            feedback.innerHTML = `<div class="alert alert-danger py-2 small mb-0"><i class="bi bi-exclamation-circle me-1"></i>Please enter a valid registered email address or 10-digit mobile number.</div>`;
          }
          return;
        }
        if (!password || password.value.length < 6) {
          if (feedback) {
            feedback.innerHTML = `<div class="alert alert-danger py-2 small mb-0"><i class="bi bi-exclamation-circle me-1"></i>Please enter your account password (minimum 6 characters).</div>`;
          }
          return;
        }

        if (feedback) {
          feedback.innerHTML = `
            <div class="p-3 rounded border border-success" style="background:var(--status-available-bg);color:var(--text-main);">
              <strong class="d-block small mb-1"><i class="bi bi-check2-circle me-1"></i>Frontend Login Validated (${identifier.value.trim()})</strong>
              <span class="small text-secondary-custom d-block mb-2">Standalone frontend validation passed. Proceed to your Farmer Dashboard to book equipment by date or view bills.</span>
              <a href="dashboard.html" class="btn-agri-primary py-1 px-3" style="font-size:0.85rem;">Go to Farmer Dashboard</a>
            </div>
          `;
        }
      });
    }

    const signupForm = document.getElementById("farmerSignupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signupFullName");
        const mobile = document.getElementById("signupMobile");
        const email = document.getElementById("signupEmail");
        const location = document.getElementById("signupLocation");
        const pass = document.getElementById("signupPassword");
        const confirmPass = document.getElementById("signupConfirmPassword");
        const terms = document.getElementById("signupTerms");
        const feedback = document.getElementById("signupFormFeedback");

        let errors = [];
        if (!name || name.value.trim().length < 2) errors.push("Full name is required.");
        const digits = mobile ? mobile.value.replace(/\D/g, "") : "";
        if (digits.length < 10) errors.push("Valid 10-digit mobile number is required.");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
          errors.push("Valid email address is required.");
        }
        if (!location || location.value.trim().length < 3) {
          errors.push("Farm village/district location is required.");
        }
        if (!pass || pass.value.length < 8) {
          errors.push("Password must be at least 8 characters long.");
        }
        if (!confirmPass || confirmPass.value !== (pass ? pass.value : "")) {
          errors.push("Password and Confirm Password do not match.");
        }
        if (!terms || !terms.checked) {
          errors.push("Please accept the Rental Terms & Conditions.");
        }

        if (errors.length > 0) {
          if (feedback) {
            feedback.innerHTML = `
              <div class="alert alert-danger py-2 small mb-0">
                <strong class="d-block mb-1">Please fix the following:</strong>
                <ul class="mb-0 ps-3">${errors.map((err) => `<li>${err}</li>`).join("")}</ul>
              </div>
            `;
          }
          return;
        }

        if (feedback) {
          feedback.innerHTML = `
            <div class="p-3 rounded border border-success" style="background:var(--status-available-bg);color:var(--text-main);">
              <strong class="d-block small mb-1"><i class="bi bi-check-circle-fill me-1"></i>Farmer / Client Registration Validated!</strong>
              <span class="small text-secondary-custom d-block mb-2">Welcome, <strong>${name.value.trim()}</strong> (${location.value.trim()}). Account UI verified.</span>
              <div class="d-flex flex-wrap gap-2">
                <a href="dashboard.html" class="btn-agri-primary py-1 px-3" style="font-size:0.85rem;">Open Farmer Dashboard</a>
                <a href="login.html" class="btn-agri-outline py-1 px-3" style="font-size:0.85rem;">Go to Login</a>
              </div>
            </div>
          `;
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     13. FARMER DASHBOARD (BOOK BY DATE, TRACK RENTALS, VIEW BILLS)
     -------------------------------------------------------------------------- */
  function initFarmerDashboard() {
    const dashboardShell = document.getElementById("farmerDashboardShell");
    if (!dashboardShell || !window.EQUIPMENT_DATA) return;

    // Sidebar Mobile Toggle
    const sidebar = document.getElementById("dashboardSidebar");
    const backdrop = document.getElementById("dashboardBackdrop");
    const openSidebarBtn = document.getElementById("openDashboardSidebar");
    const closeSidebarBtn = document.getElementById("closeDashboardSidebar");

    const toggleSidebar = (forceState) => {
      const shouldOpen =
        typeof forceState === "boolean"
          ? forceState
          : !sidebar.classList.contains("open");
      if (sidebar) sidebar.classList.toggle("open", shouldOpen);
      if (backdrop) backdrop.classList.toggle("show", shouldOpen);
    };

    if (openSidebarBtn) openSidebarBtn.addEventListener("click", () => toggleSidebar(true));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", () => toggleSidebar(false));
    if (backdrop) backdrop.addEventListener("click", () => toggleSidebar(false));

    // Default Seed Bookings & Bills
    const defaultBookings = [
      {
        id: "IF-RNT-2041",
        invoiceNo: "INV-2026-0841",
        equipmentSlug: "john-deere-5310-gearpro-4wd",
        equipmentName: "John Deere 5310 GearPro 4WD",
        image: "assets/images/tractor-jd-5310.jpg",
        startDate: "2026-11-11",
        endDate: "2026-11-14",
        days: 4,
        farmLocation: "Village Taraori, Karnal",
        status: "active",
        statusLabel: "In Field — Running",
        hoursUsed: 18.5,
        hoursIncluded: 32,
        includeOperator: true,
        deliveryKm: 18,
        baseAmount: 11200,
        operatorAmount: 3800,
        deliveryAmount: 360,
        securityDeposit: 15000,
        billStatus: "Deposit Held / Active"
      },
      {
        id: "IF-RNT-2058",
        invoiceNo: "INV-2026-0858",
        equipmentSlug: "shaktiman-semi-champion-rotavator-7ft",
        equipmentName: "Shaktiman Semi-Champion Plus 7ft Rotavator",
        image: "assets/images/equip-rotavator.jpg",
        startDate: "2026-11-16",
        endDate: "2026-11-18",
        days: 3,
        farmLocation: "Nilokheri East Block, Karnal",
        status: "scheduled",
        statusLabel: "Scheduled Dispatch",
        hoursUsed: 0,
        hoursIncluded: 24,
        includeOperator: false,
        deliveryKm: 0,
        baseAmount: 2850,
        operatorAmount: 0,
        deliveryAmount: 0,
        securityDeposit: 5000,
        billStatus: "Due at Dispatch"
      },
      {
        id: "IF-RNT-1984",
        invoiceNo: "INV-2026-0792",
        equipmentSlug: "apogee-laser-guided-land-leveler-7ft",
        equipmentName: "Apogee Laser Guided Land Leveler System (7ft)",
        image: "assets/images/equip-laser-leveler.jpg",
        startDate: "2026-10-28",
        endDate: "2026-10-30",
        days: 3,
        farmLocation: "Village Taraori, Karnal",
        status: "completed",
        statusLabel: "Returned & Audited",
        hoursUsed: 22.0,
        hoursIncluded: 24,
        includeOperator: true,
        deliveryKm: 18,
        baseAmount: 4200,
        operatorAmount: 2850,
        deliveryAmount: 360,
        securityDeposit: 10000,
        billStatus: "Paid & Deposit Refunded"
      }
    ];

    function loadBookings() {
      try {
        const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        // ignore storage errors
      }
      return defaultBookings;
    }

    function saveBookings(list) {
      try {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        // ignore
      }
    }

    let bookings = loadBookings();
    let rentalFilter = "all";

    // Sidebar Section Navigation
    const navBtns = document.querySelectorAll("[data-dash-section]");
    const sections = document.querySelectorAll(".dash-view-panel");

    function activateDashPanel(targetId) {
      navBtns.forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-dash-section") === targetId)
      );
      sections.forEach((sec) => {
        if (targetId === "overview") {
          sec.classList.remove("d-none");
        } else {
          sec.classList.toggle("d-none", sec.id !== targetId);
        }
      });
      if (window.innerWidth < 992) toggleSidebar(false);
    }

    navBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        activateDashPanel(btn.getAttribute("data-dash-section"));
      });
    });

    // Populate Booking Equipment Dropdown & Dates
    const eqSelect = document.getElementById("dashBookEquipment");
    const startInput = document.getElementById("dashBookStartDate");
    const endInput = document.getElementById("dashBookEndDate");
    const opCheck = document.getElementById("dashBookOperator");
    const kmInput = document.getElementById("dashBookDistance");
    const locInput = document.getElementById("dashBookLocation");
    const bookingForm = document.getElementById("dashBookingForm");
    const bookingFeedback = document.getElementById("dashBookingFeedback");

    if (eqSelect) {
      eqSelect.innerHTML = window.EQUIPMENT_DATA.map(
        (eq) =>
          `<option value="${eq.slug}">${eq.name} (${eq.subCategory}) — ${formatINR(
            eq.rates.daily
          )}/day</option>`
      ).join("");
    }

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    const toIso = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;

    if (startInput) {
      startInput.min = toIso(today);
      if (!startInput.value) startInput.value = toIso(today);
    }
    if (endInput) {
      endInput.min = toIso(today);
      if (!endInput.value) endInput.value = toIso(tomorrow);
    }

    function computeBookingPreview() {
      if (!eqSelect || !startInput || !endInput) return null;
      const eq =
        window.EQUIPMENT_DATA.find((i) => i.slug === eqSelect.value) ||
        window.EQUIPMENT_DATA[0];

      const sDate = new Date(startInput.value);
      const eDate = new Date(endInput.value);
      let days = 1;
      if (!isNaN(sDate) && !isNaN(eDate) && eDate >= sDate) {
        days = Math.round((eDate - sDate) / 86400000) + 1;
      }

      const includeOperator = opCheck ? opCheck.checked : false;
      const distanceKm = Math.max(0, parseInt(kmInput ? kmInput.value : "0", 10) || 0);

      const baseAmount = eq.rates.daily * days;
      const operatorAmount = includeOperator ? days * 950 : 0;
      const deliveryAmount = Math.max(0, distanceKm - 10) * 45;
      const totalRent = baseAmount + operatorAmount + deliveryAmount;

      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };
      setTxt("dashPreviewDays", `${days} ${days === 1 ? "Day" : "Days"} (${days * 8} Engine Hrs)`);
      setTxt("dashPreviewBase", formatINR(baseAmount));
      setTxt("dashPreviewOperator", formatINR(operatorAmount));
      setTxt("dashPreviewDelivery", formatINR(deliveryAmount));
      setTxt("dashPreviewDeposit", formatINR(eq.rates.securityDeposit));
      setTxt("dashPreviewTotal", formatINR(totalRent));

      return {
        eq,
        days,
        includeOperator,
        distanceKm,
        baseAmount,
        operatorAmount,
        deliveryAmount,
        totalRent
      };
    }

    [eqSelect, startInput, endInput, opCheck, kmInput].forEach((ctrl) => {
      if (ctrl) {
        ctrl.addEventListener("change", computeBookingPreview);
        ctrl.addEventListener("input", computeBookingPreview);
      }
    });

    function renderKPIs() {
      const activeCount = bookings.filter((b) => b.status === "active").length;
      const scheduledCount = bookings.filter((b) => b.status === "scheduled").length;
      const totalHours = bookings.reduce((sum, b) => sum + (b.hoursUsed || 0), 0);
      const totalBilled = bookings.reduce(
        (sum, b) => sum + b.baseAmount + b.operatorAmount + b.deliveryAmount,
        0
      );

      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };
      setTxt("kpiActiveRentals", activeCount);
      setTxt("kpiScheduledRentals", scheduledCount);
      setTxt("kpiEngineHours", `${totalHours.toFixed(1)} hrs`);
      setTxt("kpiTotalBills", formatINR(totalBilled));
    }

    function renderRentalsTable() {
      const tbody = document.getElementById("dashRentalsBody");
      if (!tbody) return;

      const list = bookings.filter(
        (b) => rentalFilter === "all" || b.status === rentalFilter
      );

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-4 text-muted-custom">
              No bookings in this status category. Use "Book Equipment by Date" to add one.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = list
        .map((b) => {
          const pillClass =
            b.status === "active"
              ? "status-available"
              : b.status === "scheduled"
              ? "status-limited"
              : "status-booked";

          return `
          <tr>
            <td>
              <strong class="font-mono d-block">${b.id}</strong>
              <span class="small text-muted-custom">${b.farmLocation}</span>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <img src="${b.image}" alt="${b.equipmentName}" class="rounded border" style="width:56px;height:40px;object-fit:cover;flex-shrink:0;">
                <div>
                  <strong class="d-block small">${b.equipmentName}</strong>
                  <span class="font-mono text-muted-custom" style="font-size:0.74rem;">${
                    b.includeOperator ? "With Certified Operator" : "Self-Drive Bare Machine"
                  }</span>
                </div>
              </div>
            </td>
            <td class="font-mono small">
              <div>${b.startDate} &rarr; ${b.endDate}</div>
              <span class="text-muted-custom">${b.days} Days (${b.hoursIncluded} hrs cap)</span>
            </td>
            <td class="font-mono small">
              <strong>${b.hoursUsed} / ${b.hoursIncluded} hrs</strong>
              <div class="progress mt-1" style="height:5px;">
                <div class="progress-bar bg-warning" style="width:${Math.min(
                  100,
                  Math.round((b.hoursUsed / Math.max(1, b.hoursIncluded)) * 100)
                )}%"></div>
              </div>
            </td>
            <td><span class="status-pill ${pillClass}">${b.statusLabel}</span></td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <button type="button" class="btn btn-sm btn-outline-secondary font-mono" data-view-details="${
                  b.equipmentSlug
                }">Specs</button>
                <button type="button" class="btn btn-sm btn-outline-primary font-mono" data-open-bill="${
                  b.id
                }">Bill</button>
                ${
                  b.status === "scheduled"
                    ? `<button type="button" class="btn btn-sm btn-outline-danger font-mono" data-cancel-booking="${b.id}">Cancel</button>`
                    : ""
                }
              </div>
            </td>
          </tr>
        `;
        })
        .join("");

      initImageFallbacks();
    }

    function renderBillsTable() {
      const tbody = document.getElementById("dashBillsBody");
      if (!tbody) return;

      tbody.innerHTML = bookings
        .map((b) => {
          const totalRent = b.baseAmount + b.operatorAmount + b.deliveryAmount;
          const badgeClass = b.billStatus.includes("Paid")
            ? "status-available"
            : b.billStatus.includes("Held")
            ? "status-limited"
            : "status-booked";

          return `
          <tr>
            <td class="font-mono small">
              <strong>${b.invoiceNo}</strong>
              <div class="text-muted-custom">Ref: ${b.id}</div>
            </td>
            <td>
              <strong class="small d-block">${b.equipmentName}</strong>
              <span class="font-mono text-muted-custom" style="font-size:0.74rem;">${b.startDate} to ${b.endDate} (${b.days}d)</span>
            </td>
            <td class="font-mono small">${formatINR(b.baseAmount)}</td>
            <td class="font-mono small">${formatINR(b.operatorAmount + b.deliveryAmount)}</td>
            <td class="price-tag-inr">${formatINR(totalRent)}</td>
            <td class="font-mono small">${formatINR(b.securityDeposit)}</td>
            <td><span class="status-pill ${badgeClass}">${b.billStatus}</span></td>
            <td>
              <button type="button" class="btn-agri-outline py-1 px-2" style="font-size:0.78rem;" data-open-bill="${b.id}">
                <i class="bi bi-receipt"></i> View Bill
              </button>
            </td>
          </tr>
        `;
        })
        .join("");
    }

    function openBillModal(bookingId) {
      const b = bookings.find((item) => item.id === bookingId);
      if (!b) return;
      const totalRent = b.baseAmount + b.operatorAmount + b.deliveryAmount;
      const bodyEl = document.getElementById("dashBillModalBody");
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div class="p-3 rounded bg-surface-alt border mb-3">
            <div class="d-flex justify-content-between flex-wrap gap-2">
              <div>
                <span class="font-mono small text-muted-custom d-block">INVOICE NUMBER</span>
                <h4 class="font-heading text-uppercase mb-0">${b.invoiceNo}</h4>
              </div>
              <div class="text-sm-end">
                <span class="font-mono small text-muted-custom d-block">RENTAL REFERENCE</span>
                <strong class="font-mono">${b.id}</strong>
              </div>
            </div>
          </div>

          <div class="row g-2 small mb-3 font-mono">
            <div class="col-sm-6"><strong>Equipment:</strong> ${b.equipmentName}</div>
            <div class="col-sm-6"><strong>Farm Location:</strong> ${b.farmLocation}</div>
            <div class="col-sm-6"><strong>Dates:</strong> ${b.startDate} to ${b.endDate} (${b.days} Days)</div>
            <div class="col-sm-6"><strong>Fuel Policy:</strong> Dry Rate (HSD Diesel Excluded)</div>
          </div>

          <div class="table-responsive border rounded mb-3">
            <table class="table table-sm mb-0 font-mono small">
              <thead>
                <tr class="bg-surface-alt">
                  <th class="p-2">Line Item Description</th>
                  <th class="p-2 text-end">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2">Base Machinery Dry Rental (${b.days} Days &times; ${b.hoursIncluded} Engine Hrs Cap)</td>
                  <td class="p-2 text-end">${formatINR(b.baseAmount)}</td>
                </tr>
                <tr>
                  <td class="p-2">Certified Operator Service (${b.includeOperator ? `${b.days} Days @ ₹950/day` : "Self-Drive — Not Included"})</td>
                  <td class="p-2 text-end">${formatINR(b.operatorAmount)}</td>
                </tr>
                <tr>
                  <td class="p-2">Transport / Delivery Charges (${b.deliveryKm} km @ ₹45/km beyond 10km)</td>
                  <td class="p-2 text-end">${formatINR(b.deliveryAmount)}</td>
                </tr>
                <tr class="fw-bold bg-surface-alt">
                  <td class="p-2">Total Rental Charges (Excluding Fuel)</td>
                  <td class="p-2 text-end text-accent fs-6">${formatINR(totalRent)}</td>
                </tr>
                <tr>
                  <td class="p-2">Refundable Security Deposit (${b.billStatus})</td>
                  <td class="p-2 text-end">${formatINR(b.securityDeposit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="small text-muted-custom mb-0">
            <i class="bi bi-info-circle me-1 text-accent"></i>Sample billing receipt generated for frontend template preview.
          </p>
        `;
      }
      const modalEl = document.getElementById("dashBillModal");
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    }

    // Track Filter Buttons
    document.querySelectorAll("[data-rental-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        rentalFilter = btn.getAttribute("data-rental-filter");
        document
          .querySelectorAll("[data-rental-filter]")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderRentalsTable();
      });
    });

    // Delegated clicks for Bill View & Cancel Booking
    dashboardShell.addEventListener("click", (e) => {
      const billBtn = e.target.closest("[data-open-bill]");
      if (billBtn) {
        openBillModal(billBtn.getAttribute("data-open-bill"));
        return;
      }

      const cancelBtn = e.target.closest("[data-cancel-booking]");
      if (cancelBtn) {
        const idToRemove = cancelBtn.getAttribute("data-cancel-booking");
        bookings = bookings.filter((b) => b.id !== idToRemove);
        saveBookings(bookings);
        renderKPIs();
        renderRentalsTable();
        renderBillsTable();
      }
    });

    // Submit New Booking by Date
    if (bookingForm) {
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const sDate = new Date(startInput.value);
        const eDate = new Date(endInput.value);
        if (isNaN(sDate) || isNaN(eDate) || eDate < sDate) {
          if (bookingFeedback) {
            bookingFeedback.innerHTML = `<div class="alert alert-danger py-2 small mb-0"><i class="bi bi-exclamation-triangle me-1"></i>Return date must be on or after the start date.</div>`;
          }
          return;
        }
        if (!locInput || locInput.value.trim().length < 3) {
          if (bookingFeedback) {
            bookingFeedback.innerHTML = `<div class="alert alert-danger py-2 small mb-0"><i class="bi bi-exclamation-triangle me-1"></i>Please enter your village / farm location.</div>`;
          }
          return;
        }

        const calc = computeBookingPreview();
        const numId = Math.floor(2100 + Math.random() * 800);
        const newBooking = {
          id: `IF-RNT-${numId}`,
          invoiceNo: `INV-2026-0${numId}`,
          equipmentSlug: calc.eq.slug,
          equipmentName: calc.eq.name,
          image: calc.eq.image,
          startDate: startInput.value,
          endDate: endInput.value,
          days: calc.days,
          farmLocation: locInput.value.trim(),
          status: "scheduled",
          statusLabel: "Scheduled Dispatch",
          hoursUsed: 0,
          hoursIncluded: calc.days * 8,
          includeOperator: calc.includeOperator,
          deliveryKm: calc.distanceKm,
          baseAmount: calc.baseAmount,
          operatorAmount: calc.operatorAmount,
          deliveryAmount: calc.deliveryAmount,
          securityDeposit: calc.eq.rates.securityDeposit,
          billStatus: "Due at Dispatch (Sample)"
        };

        bookings.unshift(newBooking);
        saveBookings(bookings);
        renderKPIs();
        renderRentalsTable();
        renderBillsTable();

        if (bookingFeedback) {
          bookingFeedback.innerHTML = `
            <div class="alert alert-success py-2 small mb-0">
              <i class="bi bi-check-circle-fill me-1"></i>
              <strong>Sample Booking Added (${newBooking.id})!</strong> Added to your Tracking Rentals list and Bills ledger below.
            </div>
          `;
        }
      });
    }

    const resetDemoBtn = document.getElementById("resetDashSampleData");
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener("click", () => {
        bookings = [...defaultBookings];
        saveBookings(bookings);
        renderKPIs();
        renderRentalsTable();
        renderBillsTable();
      });
    }

    computeBookingPreview();
    renderKPIs();
    renderRentalsTable();
    renderBillsTable();
  }

  /* --------------------------------------------------------------------------
     14. BACK TO TOP & GSAP SUBTLE ANIMATIONS
     -------------------------------------------------------------------------- */
  function initBackToTopAndAnimations() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > 360) {
            backToTopBtn.classList.add("visible");
          } else {
            backToTopBtn.classList.remove("visible");
          }
        },
        { passive: true }
      );

      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    if (window.gsap) {
      const animatedEls = document.querySelectorAll("[data-gsap-fade]");
      animatedEls.forEach((el, idx) => {
        window.gsap.fromTo(
          el,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            delay: Math.min(idx * 0.06, 0.25),
            ease: "power2.out",
            clearProps: "all"
          }
        );
      });
    }
  }

  /* --------------------------------------------------------------------------
     15. INITIALIZE ON DOM READY
     -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getInitialTheme());
    applyDirection(getInitialDir());

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    });

    document.querySelectorAll("[data-rtl-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const currentDir = document.documentElement.getAttribute("dir") || "ltr";
        applyDirection(currentDir === "rtl" ? "ltr" : "rtl");
      });
    });

    document.body.addEventListener("click", (e) => {
      const detailBtn = e.target.closest("[data-view-details]");
      if (detailBtn) {
        e.preventDefault();
        const slug = detailBtn.getAttribute("data-view-details");
        openEquipmentModal(slug);
      }
    });

    initNavbar();
    initConfigurableContacts();
    initHomeFeaturedEquipment();
    initEquipmentCatalogue();
    initRateCalculators();
    initRentalEnquiryForm();
    initAuthPages();
    initFarmerDashboard();
    initImageFallbacks();
    initBackToTopAndAnimations();
  });
})();
