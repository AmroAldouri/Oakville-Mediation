const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const servicesToggle = document.querySelector("[data-services-toggle]");
const yearNodes = document.querySelectorAll("[data-year]");

yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const setNav = (open) => {
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  const label = toggle.querySelector(".nav-toggle-label");
  if (label) label.textContent = open ? "Close" : "Menu";
  document.body.classList.toggle("nav-open", open);
};

toggle?.addEventListener("click", () => {
  setNav(!nav.classList.contains("is-open"));
});

servicesToggle?.addEventListener("click", () => {
  const drop = servicesToggle.closest(".nav-drop");
  const open = drop.classList.toggle("is-open");
  servicesToggle.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNav(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  setNav(false);
  const drop = document.querySelector(".nav-drop.is-open");
  if (!drop) return;
  drop.classList.remove("is-open");
  drop.querySelector("[data-services-toggle]")?.setAttribute("aria-expanded", "false");
});

const onScroll = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const credentialBar = document.querySelector("[data-credential-bar]");
if (credentialBar) {
  const counters = credentialBar.querySelectorAll("[data-count]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let revealed = false;

  const runCounters = () => {
    counters.forEach((node) => {
      const target = Number(node.getAttribute("data-count") || "0");
      if (!target) return;
      if (reducedMotion) {
        node.textContent = String(target);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 4;
        node.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    credentialBar.classList.add("is-visible");
    runCounters();
  };

  const inViewport = () => {
    const rect = credentialBar.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < viewHeight * 0.92 && rect.bottom > viewHeight * 0.08;
  };

  if (reducedMotion) {
    reveal();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal();
          observer.disconnect();
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(credentialBar);

    const checkNow = () => {
      if (inViewport()) reveal();
    };

    checkNow();
    window.addEventListener("load", checkNow);
    window.addEventListener("scroll", checkNow, { passive: true });
  }
}

const form = document.querySelector("[data-contact-form]");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const meeting = String(data.get("meeting") || "").trim();
  const message = String(data.get("message") || "").trim();
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Preferred meeting: ${meeting}`,
    "",
    message,
  ].join("\n");
  const href = `mailto:scrossmediation@icloud.com?subject=${encodeURIComponent(`Consultation request from ${name}`)}&body=${encodeURIComponent(body)}`;
  const status = form.querySelector("[data-form-status]");
  if (status) {
    status.hidden = false;
    status.textContent = "Your email app should open with this message addressed to Stephen. If it does not, email scrossmediation@icloud.com directly.";
  }
  window.location.href = href;
});
