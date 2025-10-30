// === CONFIG ===
const API_BASE = "https://rently-api.onrender.com"; // ← подставь свой URL с Render
const ITEMS_URL = `${API_BASE}/items`;

// Коды категорий -> человекочитаемое (RU). Потом подкинем EN/DE через i18n.
const CATEGORY_LABEL = {
  tools: "Инструменты",
  electronics: "Электроника",
  sports: "Спорт",
  party: "Праздники",
  kids: "Детские товары"
};

let __ITEMS = [];

// универсальная загрузка JSON
async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function money(v) {
  if (v == null || isNaN(v)) return "—";
  return `${v}€ / день`;
}

function linkToItem(id) {
  return `item.html?id=${encodeURIComponent(id)}`;
}

async function initCatalog() {
  // 1) грузим предметы из API
  __ITEMS = await fetchJSON(ITEMS_URL);

  // 2) собираем ссылки на элементы
  const params = new URLSearchParams(location.search);
  const qInput = document.getElementById("q");
  const catSel = document.getElementById("category");
  const distSel = document.getElementById("district");
  const sortSel = document.getElementById("sort");
  const grid   = document.getElementById("catalog-grid");
  const empty  = document.getElementById("empty");

  // 3) подготовка значений фильтров
  const cats = ["Все категории", ...Array.from(new Set(__ITEMS.map(i => i.category_code).filter(Boolean)))];
  catSel.innerHTML = cats
    .map(code => code === "Все категории"
      ? `<option value="Все категории">Все категории</option>`
      : `<option value="${code}">${CATEGORY_LABEL[code] || code}</option>`
    ).join("");

  const dists = ["Любой район", ...Array.from(new Set(__ITEMS.map(i => i.district).filter(Boolean)))];
  distSel.innerHTML = dists.map(d => `<option value="${d}">${d}</option>`).join("");

  // 4) читаем параметры из URL
  qInput.value = params.get("q") || "";
  const urlCat = params.get("category");
  if (urlCat && cats.includes(urlCat)) catSel.value = urlCat;

  // 5) функция применения фильтров/сортировки и рендера
  function apply() {
    const q    = qInput.value.trim().toLowerCase();
    const cat  = catSel.value;
    const dist = distSel.value;
    const sort = sortSel.value;

    let list = __ITEMS.filter(i => {
      const txt = `${i.title || ""} ${i.description || ""}`.toLowerCase();
      const matchesQ = !q || txt.includes(q);
      const matchesC = cat === "Все категории" || cat === i.category_code;
      const matchesD = dist === "Любой район" || dist === i.district;
      return matchesQ && matchesC && matchesD;
    });

    if (sort === "price_asc")  list.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
    if (sort === "price_desc") list.sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0));

    grid.innerHTML = "";
    for (const i of list) {
      const category = CATEGORY_LABEL[i.category_code] || i.category_code || "—";
      const img = i.image_url || "assets/img/placeholder.jpg";
      grid.appendChild(el(`
        <a class="card" href="${linkToItem(i.id)}">
          <img class="thumb" src="${img}" alt="">
          <div class="pad">
            <div class="muted">${category} · ${i.district || "—"}</div>
            <div>${i.title || "—"}</div>
            <div class="price">${money(i.price_per_day)}</div>
          </div>
        </a>
      `));
    }
    empty.classList.toggle("hidden", list.length > 0);
  }

  // 6) подписки
  qInput.addEventListener("input",  apply);
  catSel.addEventListener("change", apply);
  distSel.addEventListener("change", apply);
  sortSel.addEventListener("change", apply);

  // 7) первичный рендер
  apply();
}

document.addEventListener("DOMContentLoaded", () => initCatalog().catch(console.error));
