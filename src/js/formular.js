// src/js/formular.js

import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kontaktniFormular");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let token = "";
    try {
      token = grecaptcha.getResponse();
    } catch {
      iziToast.error({
        title: "Chyba",
        message: "Nepodařilo se načíst reCAPTCHA.",
        position: "topRight"
      });
      return;
    }

    if (!token) {
      iziToast.warning({
        title: "Pozor",
        message: "Potvrďte prosím CAPTCHA.",
        position: "topRight"
      });
      return;
    }

    const data = new FormData(form);
    const response = await fetch("https://formspree.io/f/xanboklo", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      iziToast.success({
        title: "Odesláno",
        message: "Děkujeme za zprávu. Ozveme se vám co nejdříve.",
        position: "topRight"
      });
      form.reset();
      grecaptcha.reset();
    } else {
      iziToast.error({
        title: "Chyba",
        message: "Chyba při odesílání. Zkuste to prosím znovu.",
        position: "topRight"
      });
    }
  });
});
