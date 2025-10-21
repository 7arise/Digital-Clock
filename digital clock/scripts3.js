/* scripts.js
   Comentarios en español.
   Funcionalidades:
   - mostrar hora (12/24)
   - mostrar fecha legible
   - toggle tema claro/oscuro (persistencia)
   - toggle formato 12/24 (persistencia)
*/

/* ================= CONFIG ================= */
const CONFIG = {
  // (no se usa OpenWeather en esta versión)
  useWeather: false
};

/* ================= LÓGICA PRINCIPAL ================= */
(function(){
  "use strict";

  window.addEventListener("DOMContentLoaded", () => {
    // Logs para depuración
    console.log("[clock] script arrancando...");

    // Selección de elementos del DOM
    const root = document.documentElement;
    const hourEl = document.querySelector(".hour_num");
    const minEl  = document.querySelector(".min_num");
    const secEl  = document.querySelector(".sec_num");
    const ampmEl = document.querySelector(".am_pm");
    const dateTextEl = document.querySelector(".date-text");
    const themeToggle  = document.querySelector(".theme-toggle");
    const formatToggle = document.querySelector(".format-toggle");

    // Comprobación de elementos esenciales
    if(!hourEl || !minEl || !secEl || !ampmEl || !dateTextEl){
      console.error("[clock] Error: faltan elementos HTML (hour_min_sec/am_pm/date). Revisa clases.");
      return;
    }

    // --- utilidades para la fecha legible --- //
    function ordinalSuffix(n){
      const j = n % 10, k = n % 100;
      if (j === 1 && k !== 11) return n + "st";
      if (j === 2 && k !== 12) return n + "nd";
      if (j === 3 && k !== 13) return n + "rd";
      return n + "th";
    }
    const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    function formatDateReadable(d){
      const weekday = WEEKDAYS[d.getDay()];
      const month = MONTHS[d.getMonth()];
      const day = ordinalSuffix(d.getDate());
      return `${weekday}, ${month} ${day}`;
    }

    // --- tema (claro/oscuro) --- //
    function applyTheme(theme){
      if(theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      if(themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      localStorage.setItem("clock-theme", theme);
    }

    // --- formato horario (12/24) --- //
    function applyFormat(is24){
      localStorage.setItem("clock-format-24", is24 ? "1" : "0");
      if(formatToggle) formatToggle.setAttribute("aria-pressed", is24 ? "true" : "false");
    }

    // Cargar preferencias guardadas (o usar preferencias del sistema para el tema)
    let use24 = localStorage.getItem("clock-format-24") === "1";
    const savedTheme = localStorage.getItem("clock-theme");
    if(savedTheme) applyTheme(savedTheme);
    else {
      if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) applyTheme("dark");
      else applyTheme("light");
    }
    if(formatToggle) formatToggle.setAttribute("aria-pressed", use24 ? "true" : "false");

    // --- función que actualiza la hora y la fecha en el DOM --- //
    function updateClock(){
      const now = new Date();
      const hr24 = now.getHours();
      let displayHour = hr24;
      let ampm = "";

      if(!use24){
        ampm = hr24 >= 12 ? "PM" : "AM";
        displayHour = hr24 % 12;
        displayHour = displayHour === 0 ? 12 : displayHour;
      }

      const hh = String(displayHour).padStart(2,"0");
      const mm = String(now.getMinutes()).padStart(2,"0");
      const ss = String(now.getSeconds()).padStart(2,"0");

      hourEl.textContent = hh;
      minEl.textContent = mm;
      secEl.textContent = ss;
      ampmEl.textContent = use24 ? "" : ampm;
      dateTextEl.textContent = formatDateReadable(now);
    }

    // Ejecutar por primera vez y lanzar intervalo de 1s
    updateClock();
    setInterval(updateClock, 1000);

    // --- eventos para botones --- //
    if(themeToggle){
      themeToggle.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        applyTheme(isDark ? "dark" : "light");
      });
    } else {
      console.warn("[clock] No se encontró .theme-toggle");
    }

    if(formatToggle){
      formatToggle.addEventListener("click", () => {
        use24 = !use24;
        applyFormat(use24);
        updateClock(); // actualizar inmediatamente al cambiar formato
      });
    } else {
      console.warn("[clock] No se encontró .format-toggle");
    }

    console.log("[clock] script listo.");
  });
})();
