const FORMSUBMIT_AJAX_ENDPOINT =
  "https://formsubmit.co/ajax/pullcuts1@gmail.com";

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

function setMenuOpen(isOpen) {
  if (!menuToggle || !nav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  nav.classList.toggle("open", isOpen);
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (menuToggle.getAttribute("aria-expanded") !== "true") {
      return;
    }

    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (nav.contains(target) || menuToggle.contains(target)) {
      return;
    }

    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const honeypot = String(formData.get("_honey") ?? "").trim();

    if (honeypot) {
      return;
    }

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.classList.add("error");
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(FORMSUBMIT_AJAX_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage =
          typeof data.message === "string"
            ? data.message
            : "Something went wrong. Please try again.";
        throw new Error(errorMessage);
      }

      formStatus.textContent = "Message sent — I'll get back to you soon.";
      formStatus.classList.add("success");
      contactForm.reset();
    } catch (error) {
      const messageText =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email pullcuts1@gmail.com.";
      formStatus.textContent = messageText;
      formStatus.classList.add("error");
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});
