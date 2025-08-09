import '../css/basic.css';

document.addEventListener("DOMContentLoaded", () => {
  const typSelect = document.getElementById("typ");
  const dumFields = document.getElementById("dum-fields");
  const bytFields = document.getElementById("byt-fields");

  if (!typSelect || !dumFields || !bytFields) return;

  typSelect.addEventListener("change", () => {
    if (typSelect.value === "dum") {
      dumFields.style.display = "block";
      bytFields.style.display = "none";
    } else {
      dumFields.style.display = "none";
      bytFields.style.display = "block";
    }
  });

  document.getElementById("spocitatBtn")?.addEventListener("click", spocitejCenu);

  const aktualniRokEl = document.getElementById("aktualniRok");
  if (aktualniRokEl) {
    aktualniRokEl.textContent = new Date().getFullYear();
  }
});

window.spocitejCenu = function() {
  const vysledek = document.getElementById("vysledek");
  vysledek.innerHTML = `<p><span class="loader"></span></p>`;  

  const delay = Math.random() * 1000 + 500;

  setTimeout(() => {
    const lokalita = document.getElementById("lokalita").value;
    const typ = document.getElementById("typ").value;

    const cenyLokalit = {
      praha1: 492, praha2: 470, praha3: 460, praha4: 418,
      praha5: 433, praha6: 417, praha7: 441, praha8: 417,
      praha9: 421, praha10: 405
    };

    const cenaZaM2 = cenyLokalit[lokalita] || 350;

    if (typ === "dum") {
      const jednotky = parseInt(document.getElementById("jednotky").value);
      const plocha = parseFloat(document.getElementById("plocha-dum").value);
      if (!jednotky || !plocha) {
        vysledek.innerText = "Zadejte platné údaje pro dům.";
        return;
      }
      const celkovyNajem = plocha * cenaZaM2;
      const sprava = celkovyNajem * 0.07;
      vysledek.innerHTML = `
        <p><strong>Přibližná cena správy:</strong> ${sprava.toLocaleString()} Kč / měsíc</p>
        <p><strong>Přibližná cena nájmu:</strong> ${celkovyNajem.toLocaleString()} Kč / měsíc</p>
      `;
    } else {
      const plocha = parseFloat(document.getElementById("plocha-byt").value);
      const dispozice = document.getElementById("dispozice").value;
      const koeficienty = { "1kk": 1, "1+1": 1.05, "2kk": 1.1, "2+1": 1.15, "3kk": 1.2, "3+1": 1.25, "4+": 1.3 };
      const koef = koeficienty[dispozice] || 1;
      const najem = plocha * cenaZaM2 * koef;
      const sprava = najem * 0.1;
      vysledek.innerHTML = `
        <p><strong>Správa:</strong> ${sprava.toLocaleString()} Kč / měsíc</p>
        <p><strong>Příjem:</strong> ${najem.toLocaleString()} Kč / měsíc</p>
      `;
    }
  }, delay);
}
