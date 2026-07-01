"use strict";

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.querySelector(".back-to-top");
const sections = [...document.querySelectorAll("main section[id]")];

// Navbar dinámica y botón de regreso.
function updateScrollUI() {
  const scrolled = window.scrollY > 40;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 600);

  let currentId = "inicio";
  const readingLine = window.scrollY + header.offsetHeight + 160;
  sections.forEach((section) => {
    if (section.offsetTop <= readingLine) currentId = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

// Menú responsive accesible.
function closeMenu() {
  menu.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

// El header es fijo: forzamos el origen exacto al pulsar cualquier enlace a Inicio.
document.querySelectorAll('a[href="#inicio"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Revelado progresivo al entrar en el viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -50px" });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
updateScrollUI();

// Validación local del formulario (sin backend).
const form = document.querySelector("#contact-form");
const statusMessage = document.querySelector("#form-status");

function validationMessage(field) {
  if (field.validity.valueMissing) return "Este campo es obligatorio.";
  if (field.validity.typeMismatch) return "Ingresa un correo electrónico válido.";
  if (field.validity.tooShort) return `Escribe al menos ${field.minLength} caracteres.`;
  return "Revisa este campo.";
}

function validateField(field) {
  const wrapper = field.closest(".form-field");
  const error = wrapper.querySelector(".error");
  const valid = field.checkValidity();
  wrapper.classList.toggle("invalid", !valid);
  field.setAttribute("aria-invalid", String(!valid));
  error.textContent = valid ? "" : validationMessage(field);
  return valid;
}

form.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.closest(".form-field").classList.contains("invalid")) validateField(field);
    statusMessage.textContent = "";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    statusMessage.textContent = "Revisa los campos marcados antes de continuar.";
    statusMessage.style.color = "#ff7587";
    form.querySelector(".invalid input, .invalid textarea")?.focus();
    return;
  }

  statusMessage.textContent = "Mensaje validado. La conexión de envío se añadirá próximamente.";
  statusMessage.style.color = "#91e5b0";
  form.reset();
  fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
});

document.querySelector("#year").textContent = new Date().getFullYear();
