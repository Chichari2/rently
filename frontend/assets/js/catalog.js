import { DATA_URL, fetchJSON, el, linkToItem, money } from './app.js';

const CATEGORY_LABEL = {
  tools: "Werkzeuge",
  electronics: "Elektronik",
  sports: "Sport",
  party: "Partyartikel",
  kids: "Kinderbedarf"
};

let __ITEMS = [];

function uniq(arr) { return Array.from(new Set(arr.filter(Boolean))); }

function renderCard(i) {
  const category = CATEGORY_LABEL[i.category_code] || i.category_code || "—";
  const img = i.image_url || "assets/img/placeholder.jpg";
  return el(`
    <a class="card" href="${linkToItem(i.id)}">
      <img class="thumb" src="${img}" alt="">
      <div class="pad">
        <div class="muted">${category} · ${i.district || "—"}</div>
        <div>${i.title || "—"}</div>
        <div class="price">${money(i.price_per_day)}</div>
      </div>
    </a>
  `);
}

async function initCatalog() {
  __ITEMS = await fetchJSON(DATA_URL);

  const params = new URLSearchParams(location.search);
  const qInput = document.getElementById("q");
  const catSel = document.getElementById("category");
  const distSel = document.getElementById("district");
  const sortSel = document.getElementById("sort");
  const grid   = document.getElementById("catalog-grid");
  const empty  = document.getElementById("empty");

  const catCodes = uniq(__ITEMS.map(i => i.category_code));
  // оставляем HTML-опции, просто проставим выбранную при переходе из главной
  if (params.get("category") && catCodes.includes(params.get("category"))) {
    catSel.value = params.get("category");
  }

  function apply() {
    const q    = (qInput.value || '').toLowerCase().trim();
    const cat  = catSel.value;
    const dist = distSel.value;
    const sort = sortSel.value;

    let list = __ITEMS.filter(i => {
      const txt = `${i.title || ""} ${i.description || ""}`.toLowerCase();
      const matchesQ = !q || txt.includes(q);
      const matchesC = (cat === "all")  || (cat === i.category_code);
      const matchesD = (dist === "all") || (dist === i.district);
      return matchesQ && matchesC && matchesD;
    });

    switch (sort) {
      case 'price_asc':  list.sort((a,b) => (a.price_per_day||0) - (b.price_per_day||0)); break;
      case 'price_desc': list.sort((a,b) => (b.price_per_day||0) - (a.price_per_day||0)); break;
      case 'newest':     list.sort((a,b) => new Date(b.created_at||0) - new Date(a.created_at||0)); break;
      default: break;
    }

    grid.innerHTML = '';
    list.forEach(i => grid.appendChild(renderCard(i)));
    empty.classList.toggle("hidden", list.length > 0);

    const added = params.get('added');
    if (added) {
      const node = grid.querySelector(`a.card[href*="id=${CSS.escape(added)}"]`);
      if (node) {
        node.classList.add('highlight');
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  qInput.addEventListener("input",  apply);
  catSel.addEventListener("change", apply);
  distSel.addEventListener("change", apply);
  sortSel.addEventListener("change", apply);

  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  initCatalog().catch(err => {
    console.error(err);
    const empty  = document.getElementById("empty");
    empty.textContent = 'Katalog konnte nicht geladen werden. Server prüfen.';
    empty.classList.remove('hidden');
  });
});
