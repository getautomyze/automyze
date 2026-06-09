/**
 * Automyze B2B Lead Capture & Analytics Controller
 * -------------------------------------------------------------
 * Centralized script to handle:
 * 1. Centralized Google Analytics injection.
 * 2. Favicon redirection to the correct logo (/favicon.jpg).
 * 3. Intercepting CTAs (href="#request-audit") to open the Lead Capture Popup.
 * 4. Premium AJAX Lead Form submission with custom success notification.
 */

(function () {
  // === CONFIGURATION ===
  const CONFIG = {
    // Replace with your actual Web3Forms Access Key (Get one free at web3forms.com)
    // Or set to a custom webhook URL (Make.com, Zapier, etc.)
    ACCESS_KEY_OR_WEBHOOK: "86d58836-724d-4927-9f26-62c59660681b", 
    
    // Replace with your Google Analytics Measurement ID (e.g. 'G-XXXXXXXXXX')
    GA_MEASUREMENT_ID: "G-NTG0WD79NS", 
  };

  // === 1. GOOGLE ANALYTICS INTEGRATION ===
  if (CONFIG.GA_MEASUREMENT_ID && CONFIG.GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", CONFIG.GA_MEASUREMENT_ID);
    window.gtag = gtag; // Make it globally accessible
  }

  // === 2. DYNAMIC FAVICON CORRECTION ===
  function fixFavicon() {
    const faviconUrl = "favicon.jpg";
    
    // Remove any existing favicons
    const existingIcons = document.querySelectorAll("link[rel*='icon']");
    existingIcons.forEach(icon => icon.remove());

    // Create and append the new favicon links
    const newIcon = document.createElement("link");
    newIcon.rel = "icon";
    newIcon.type = "image/jpeg";
    newIcon.href = faviconUrl;
    document.head.appendChild(newIcon);

    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = faviconUrl;
    document.head.appendChild(appleIcon);

    const shortcutIcon = document.createElement("link");
    shortcutIcon.rel = "shortcut icon";
    shortcutIcon.href = faviconUrl;
    document.head.appendChild(shortcutIcon);
  }

  // Run favicon fix immediately when script runs or DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fixFavicon);
  } else {
    fixFavicon();
  }

  // === 3. INJECT MODAL STYLES ===
  function injectModalResources() {
    if (!document.getElementById("automyze-popup-styles")) {
      const style = document.createElement("style");
      style.id = "automyze-popup-styles";
      style.textContent = `
        /* Modal Backdrop */
        .automyze-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          padding: 1rem;
        }
        .automyze-modal-backdrop.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* Modal Box */
        .automyze-modal {
          background: #FAFAF8;
          border: 1px solid #F2F0EB;
          border-radius: 1.5rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          transform: translateY(20px) scale(0.95);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          opacity: 0;
        }
        .automyze-modal-backdrop.active .automyze-modal {
          transform: translateY(0) scale(1);
          opacity: 1;
        }

        /* Scrollbar styling for modal */
        .automyze-modal::-webkit-scrollbar {
          width: 6px;
        }
        .automyze-modal::-webkit-scrollbar-track {
          background: transparent;
        }
        .automyze-modal::-webkit-scrollbar-thumb {
          background: #C9A96E;
          border-radius: 3px;
        }

        /* Focus rings */
        .automyze-input:focus {
          border-color: #C9A96E !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.2) !important;
        }

        /* Checkmark Animation */
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // === 4. INJECT MODAL HTML ===
  let modalBackdrop = null;

  function createModalHTML() {
    if (document.getElementById("automyze-lead-modal")) return;

    modalBackdrop = document.createElement("div");
    modalBackdrop.id = "automyze-lead-modal";
    modalBackdrop.className = "automyze-modal-backdrop";
    modalBackdrop.innerHTML = `
      <div class="automyze-modal p-6 md:p-10 font-sans">
        <!-- Close Button -->
        <button id="automyze-modal-close" class="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors" aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Dynamic Content Area -->
        <div id="automyze-modal-body">
          <div class="text-center mb-8">
            <span class="inline-block bg-luxury-gold/15 text-luxury-gold text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3">AI Operations Audit</span>
            <h3 class="text-2xl md:text-3xl font-heading font-semibold text-luxury-black mb-2" style="font-family: 'Playfair Display', serif;">Request AI Operational Audit</h3>
            <p class="text-sm text-neutral-500 max-w-sm mx-auto">Fill in the details below to unlock operational leaks and submit your consulting request.</p>
          </div>

          <form id="automyze-lead-form" class="space-y-5">
            <!-- Full Name -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-name">Full Name *</label>
              <input type="text" id="lead-name" name="name" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. Rajesh Kumar" />
            </div>

            <!-- Email & Phone Grid -->
            <div class="grid md:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-email">Work Email *</label>
                <input type="email" id="lead-email" name="email" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. rajesh@company.in" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-phone">Contact Number *</label>
                <input type="tel" id="lead-phone" name="phone" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. +91 98765 43210" />
              </div>
            </div>

            <!-- Company Name -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-company">Company Name *</label>
              <input type="text" id="lead-company" name="company" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. Apex Logistics Solutions" />
            </div>

            <!-- Bottlenecks / Pain points -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-notes">Primary Operational Bottleneck *</label>
              <textarea id="lead-notes" name="notes" rows="3" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950 resize-none" placeholder="Explain where manual work or bottlenecks are draining your team's time..."></textarea>
            </div>

            <!-- Submit Button -->
            <div class="pt-2">
              <button type="submit" id="lead-submit-btn" class="w-full bg-luxury-black text-white py-3.5 px-6 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                <span>Submit Audit Request →</span>
              </button>
            </div>

            <div id="form-error-msg" class="text-xs text-red-500 hidden text-center font-medium"></div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modalBackdrop);

    // Event listener to close modal on background click
    modalBackdrop.addEventListener("click", function (e) {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    // Close button click listener
    document.getElementById("automyze-modal-close").addEventListener("click", closeModal);

    // Form submission listener
    document.getElementById("automyze-lead-form").addEventListener("submit", handleFormSubmission);
  }

  // === 5. MODAL TRIGGER CONTROLLER ===
  function openModal(e) {
    if (e) e.preventDefault();
    injectModalResources();
    createModalHTML();

    // Reset Form if it exists
    const form = document.getElementById("automyze-lead-form");
    if (form) {
      // Re-create the form html if success screen over-wrote it
      const modalBody = document.getElementById("automyze-modal-body");
      modalBody.innerHTML = `
        <div class="text-center mb-8">
          <span class="inline-block bg-luxury-gold/15 text-luxury-gold text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3">AI Operations Audit</span>
          <h3 class="text-2xl md:text-3xl font-heading font-semibold text-luxury-black mb-2" style="font-family: 'Playfair Display', serif;">Request AI Operational Audit</h3>
          <p class="text-sm text-neutral-500 max-w-sm mx-auto">Fill in the details below to unlock operational leaks and submit your consulting request.</p>
        </div>

        <form id="automyze-lead-form" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-name">Full Name *</label>
            <input type="text" id="lead-name" name="name" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. Rajesh Kumar" />
          </div>

          <!-- Email & Phone Grid -->
          <div class="grid md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-email">Work Email *</label>
              <input type="email" id="lead-email" name="email" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. rajesh@company.in" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-phone">Contact Number *</label>
              <input type="tel" id="lead-phone" name="phone" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. +91 98765 43210" />
            </div>
          </div>

          <!-- Company Name -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-company">Company Name *</label>
            <input type="text" id="lead-company" name="company" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950" placeholder="e.g. Apex Logistics Solutions" />
          </div>

          <!-- Bottlenecks / Pain points -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5" for="lead-notes">Primary Operational Bottleneck *</label>
            <textarea id="lead-notes" name="notes" rows="3" required class="automyze-input w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-sm transition-all text-neutral-950 resize-none" placeholder="Explain where manual work or bottlenecks are draining your team's time..."></textarea>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button type="submit" id="lead-submit-btn" class="w-full bg-luxury-black text-white py-3.5 px-6 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
              <span>Submit Audit Request →</span>
            </button>
          </div>

          <div id="form-error-msg" class="text-xs text-red-500 hidden text-center font-medium"></div>
        </form>
      `;

      // Re-bind form submission
      document.getElementById("automyze-lead-form").addEventListener("submit", handleFormSubmission);
    }

    modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background page scroll
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scroll
    }
  }

  // === 6. INTERCEPT CTA BUTTON CLICKS ===
  function bindInterceptors() {
    // Select all links referencing the specific contact anchors or old Calendly URLs
    const ctaLinks = document.querySelectorAll('a[href="#request-audit"], a[href*="calendly.com"]');
    ctaLinks.forEach((link) => {
      // Avoid binding repeatedly
      if (!link.dataset.popupBound) {
        link.addEventListener("click", openModal);
        link.dataset.popupBound = "true";
      }
    });
  }

  // Bind links when DOM load is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bindInterceptors();
      // Watch for dynamically loaded elements as well
      setInterval(bindInterceptors, 2000);
    });
  } else {
    bindInterceptors();
    setInterval(bindInterceptors, 2000);
  }

  // === 7. FORM SUBMISSION VIA AJAX ===
  function handleFormSubmission(e) {
    e.preventDefault();

    const submitBtn = document.getElementById("lead-submit-btn");
    const errorMsg = document.getElementById("form-error-msg");
    errorMsg.classList.add("hidden");

    // Form inputs values
    const name = document.getElementById("lead-name").value.trim();
    const email = document.getElementById("lead-email").value.trim();
    const phone = document.getElementById("lead-phone").value.trim();
    const company = document.getElementById("lead-company").value.trim();
    const notes = document.getElementById("lead-notes").value.trim();

    // Basic Validation
    if (!name || !email || !phone || !company || !notes) {
      errorMsg.textContent = "Please fill in all required fields.";
      errorMsg.classList.remove("hidden");
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Submitting Audit Request...
    `;

    // Choose Endpoint logic
    let submissionUrl = "https://api.web3forms.com/submit";
    let bodyData = {};

    const isWebhook = CONFIG.ACCESS_KEY_OR_WEBHOOK.startsWith("http://") || CONFIG.ACCESS_KEY_OR_WEBHOOK.startsWith("https://");
    
    if (isWebhook) {
      submissionUrl = CONFIG.ACCESS_KEY_OR_WEBHOOK;
      bodyData = {
        name,
        email,
        phone,
        company,
        notes,
        source: window.location.pathname,
        submittedAt: new Date().toISOString()
      };
    } else {
      // Default to Web3Forms API structure
      bodyData = {
        access_key: CONFIG.ACCESS_KEY_OR_WEBHOOK,
        name: name,
        email: email,
        phone: phone,
        company: company,
        notes: notes,
        subject: `[New Automyze Lead] ${company} - ${name}`,
        from_name: "Automyze Lead Capture",
      };
    }

    // Submit Lead Data to Backend
    fetch(submissionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyData),
    })
      .then(async (response) => {
        if (response.ok) {
          // Send custom event to Google Analytics if enabled
          if (window.gtag) {
            window.gtag("event", "lead_captured", {
              event_category: "Engagement",
              event_label: company,
            });
          }
          // Proceed to render Success Screen
          renderSuccessScreen(name, email);
        } else {
          const json = await response.json();
          throw new Error(json.message || "Failed to submit lead data.");
        }
      })
      .catch((err) => {
        console.error("Submission Error:", err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = "<span>Submit Audit Request →</span>";
        errorMsg.textContent = "Submission failed. Please check your network or try again later.";
        errorMsg.classList.remove("hidden");
      });
  }

  // === 8. SHOW SUCCESS CONFIRMATION SCREEN ===
  function renderSuccessScreen(name, email) {
    const modalBody = document.getElementById("automyze-modal-body");
    
    // Custom Success Card with pulse gold checkmark
    modalBody.innerHTML = `
      <div class="text-center py-8 px-4 animate-scale-in">
        <div class="w-20 h-20 bg-luxury-gold/10 border-2 border-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="h-10 w-10 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 class="text-3xl font-heading font-bold text-luxury-black mb-4" style="font-family: 'Playfair Display', serif;">Audit Request Received</h3>
        <p class="text-neutral-600 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          Thank you, <strong class="text-neutral-900">${name}</strong>. We have captured your company details and bottleneck report.
        </p>
        
        <div class="bg-luxury-beige/40 border border-luxury-beige p-5 rounded-xl text-left text-xs text-neutral-600 leading-relaxed mb-8 max-w-md mx-auto space-y-2">
          <p class="font-bold text-luxury-gold uppercase tracking-widest text-[10px]">What Happens Next?</p>
          <p>1. Our AI Operations Consultant will review your submission.</p>
          <p>2. We will run an initial feasibility audit on your workflow bottleneck.</p>
          <p>3. We will reach out to you at <strong class="text-neutral-900">${email}</strong> within 24 hours to schedule your walk-through.</p>
        </div>
        
        <button id="automyze-success-close-btn" class="bg-luxury-black text-white px-10 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
          Return to Website
        </button>
      </div>
    `;

    // Bind Close event
    document.getElementById("automyze-success-close-btn").addEventListener("click", closeModal);
  }
})();
