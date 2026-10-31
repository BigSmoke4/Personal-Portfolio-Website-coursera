document.addEventListener("DOMContentLoaded", () => {
  /* ---- Footer year ---- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---- Mobile navigation toggle ---- */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  siteNav.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---- Dark mode toggle (remembers choice) ---- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    const dark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.textContent = dark ? "Light mode" : "Dark mode";
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));
  themeToggle.addEventListener("click", () =>
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
  );

  /* ---- Project filter ---- */
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll("#projectGrid .card");
  const status = document.getElementById("filterStatus");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.filter;
      filters.forEach(b => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      let shown = 0;
      cards.forEach(card => {
        const match = type === "all" || card.dataset.category.split(" ").includes(type);
        card.hidden = !match;
        if (match) shown++;
      });
      status.textContent = `Showing ${shown} project${shown === 1 ? "" : "s"}.`;
    });
  });

  /* ---- Contact form validation ---- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  function showError(input, message) {
    document.getElementById(input.id + "Error").textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    let valid = true;
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;

    if (name.value.trim().length < 2) { showError(name, "Please enter your name."); valid = false; }
    else showError(name, "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Please enter a valid email address, like name@example.com."); valid = false;
    } else showError(email, "");

    if (message.value.trim().length < 10) { showError(message, "Please write at least 10 characters."); valid = false; }
    else showError(message, "");

    return valid;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    formStatus.textContent = "";
    if (validate()) {
      formStatus.textContent = "Thanks! Your message is ready to send (demo only, no server connected).";
      form.reset();
    } else {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });
});
