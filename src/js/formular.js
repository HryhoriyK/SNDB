document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kontaktniFormular");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let token = "";
    try {
      token = grecaptcha.getResponse();
    } catch {
      alert("Nepodařilo se načíst reCAPTCHA.");
      return;
    }

    if (!token) {
      alert("Potvrďte prosím CAPTCHA.");
      return;
    }

    const data = new FormData(form);
    const response = await fetch("https://formspree.io/f/xanboklo", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      alert("Děkujeme za zprávu. Ozveme se vám co nejdříve.");
      form.reset();
      grecaptcha.reset();
    } else {
      alert("Chyba při odesílání. Zkuste to prosím znovu.");
    }
  });
});
