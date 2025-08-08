// src/js/formular.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kontaktniFormular");
  if (!form) {
    console.warn("Formulář #kontaktniFormular nebyl nalezen na této stránce.");
    return;
  }

  // pomocná funkce: počká až bude grecaptcha dostupné (max 5s)
  function waitForGrecaptcha(timeout = 5000) {
    return new Promise((resolve) => {
      const start = Date.now();
      (function check() {
        if (window.grecaptcha && typeof window.grecaptcha.getResponse === "function") {
          resolve(true);
        } else if (Date.now() - start > timeout) {
          resolve(false);
        } else {
          setTimeout(check, 200);
        }
      })();
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // čekej na grecaptcha (pokud se nenačetlo, upozorni)
    const greReady = await waitForGrecaptcha(5000);
    if (!greReady) {
      alert("reCAPTCHA se nenačetla. Prosím obnovte stránku a zkuste to znovu.");
      console.error("reCAPTCHA nebyla dostupná (timeout).");
      return;
    }

    // získej token (uživatel musí potvrdít checkbox)
    const token = grecaptcha.getResponse();
    if (!token) {
      alert("Potvrďte prosím CAPTCHA (zaškrtněte, že nejste robot).");
      return;
    }

    // vytvoř FormData a přidej token do ní (NUTNÉ pro Formspree)
    const data = new FormData(form);
    data.append("g-recaptcha-response", token);

    // (volitelné) logni data pro debug v dev režimu
    // for (let pair of data.entries()) console.log(pair[0], pair[1]);

    try {
      const response = await fetch("https://formspree.io/f/xanboklo", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      // zkus přečíst odpověď těla (pomůže při debug)
      let respBody = null;
      try {
        respBody = await response.json();
      } catch (err) {
        // ne vždy posílají JSON
      }

      if (response.ok) {
        alert("Děkujeme za zprávu. Ozveme se vám co nejdříve.");
        form.reset();
        try { grecaptcha.reset(); } catch {}
      } else {
        console.error("Formspree returned non-OK", response.status, respBody);
        // ukaž smysluplnou zprávu uživateli
        alert(
          respBody && respBody.error
            ? `Chyba: ${respBody.error}`
            : `Došlo k chybě (${response.status}). Zkuste to prosím později.`
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Chyba sítě při odesílání formuláře. Zkontrolujte připojení a zkuste to znovu.");
    }
  });
});
