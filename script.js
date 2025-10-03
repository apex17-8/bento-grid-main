const gridEl = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const themeToggle = document.getElementById("themeToggle");

const detail = document.getElementById("detail");
const detailClose = document.getElementById("detailClose");

let countries = [];
let countriesByCode = {};

async function loadData() {
  const res = await fetch("data.json");
  countries = await res.json();
  countries.forEach(c => countriesByCode[c.alpha3Code] = c);
  renderGrid(countries);
}
function renderGrid(list) {
  gridEl.innerHTML = list.map(c => `
    <article class="card" data-code="${c.alpha3Code}">
      <img src="${c.flag}" class="flag" alt="flag of ${c.name}">
      <div class="card-body">
        <h3>${c.name}</h3>
        <p><strong>Population:</strong> ${c.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${c.region}</p>
        <p><strong>Capital:</strong> ${c.capital}</p>
      </div>
    </article>
  `).join("");
  document.querySelectorAll(".card").forEach(card =>
    card.addEventListener("click", () => openDetail(card.dataset.code))
  );
}
function openDetail(code) {
  const c = countriesByCode[code];
  if (!c) return;
  document.getElementById("detailFlag").src = c.flag;
  document.getElementById("detailName").textContent = c.name;
  document.getElementById("nativeName").textContent = c.nativeName || c.name;
  document.getElementById("detailPopulation").textContent = c.population.toLocaleString();
  document.getElementById("detailRegion").textContent = c.region;
  document.getElementById("detailSubregion").textContent = c.subregion || "—";
  document.getElementById("detailCapital").textContent = c.capital || "—";
  document.getElementById("detailTLD").textContent = (c.topLevelDomain || []).join(", ");
  document.getElementById("detailCurrencies").textContent = (c.currencies || []).map(cur => cur.name).join(", ");
  document.getElementById("detailLanguages").textContent = (c.languages || []).map(l => l.name).join(", ");
  const bordersEl = document.getElementById("borders");
  bordersEl.innerHTML = "";
  (c.borders || []).forEach(b => {
    const other = countriesByCode[b];
    const chip = document.createElement("span");
    chip.className = "border-chip";
    chip.textContent = other ? other.name : b;
    bordersEl.appendChild(chip);
  });
  detail.classList.remove("hidden");
}
document.querySelector(".back-btn").addEventListener("click", () => detail.classList.add("hidden"));
detail.addEventListener("click", e => { if (e.target === detail) detail.classList.add("hidden"); });

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  const region = regionFilter.value;
  const filtered = countries.filter(c =>
    (!region || c.region === region) &&
    (c.name.toLowerCase().includes(q) || (c.capital || "").toLowerCase().includes(q))
  );
  renderGrid(filtered);
}
searchInput.addEventListener("input", applyFilters);
regionFilter.addEventListener("change", applyFilters);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

loadData();

