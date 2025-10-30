async function initCatalog(){
  __ITEMS = await fetchJSON(DATA_URL);
  const params = new URLSearchParams(location.search);
  const qInput = document.getElementById('q');
  const catSel = document.getElementById('category');
  const distSel = document.getElementById('district');
  const sortSel = document.getElementById('sort');
  const grid = document.getElementById('catalog-grid');
  const empty = document.getElementById('empty');

  // seed filters
  const cats = ['Все категории', ...new Set(__ITEMS.map(i => i.category))];
  catSel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  const dists = ['Любой район', ...new Set(__ITEMS.map(i => i.district))];
  distSel.innerHTML = dists.map(d => `<option value="${d}">${d}</option>`).join('');

  // read params
  qInput.value = params.get('q') || '';
  const urlCat = params.get('category');
  if(urlCat && cats.includes(urlCat)) catSel.value = urlCat;

  function apply(){
    const q = qInput.value.trim().toLowerCase();
    const cat = catSel.value;
    const dist = distSel.value;
    const sort = sortSel.value;

    let list = __ITEMS.filter(i => {
      const matchesQ = !q || (i.title + ' ' + i.description).toLowerCase().includes(q);
      const matchesC = cat === 'Все категории' || cat === i.category;
      const matchesD = dist === 'Любой район' || dist === i.district;
      return matchesQ && matchesC && matchesD;
    });

    if(sort === 'price_asc') list.sort((a,b) => a.price_per_day - b.price_per_day);
    else if(sort === 'price_desc') list.sort((a,b) => b.price_per_day - a.price_per_day);

    grid.innerHTML = '';
    list.forEach(i => {
      grid.appendChild(el(`
        <a class="card" href="${linkToItem(i.id)}">
          <img class="thumb" src="${i.images?.[0] || 'assets/img/placeholder.jpg'}" alt="">
          <div class="pad">
            <div class="muted">${i.category} · ${i.district}</div>
            <div>${i.title}</div>
            <div class="price">${money(i.price_per_day)}</div>
          </div>
        </a>
      `));
    });
    empty.classList.toggle('hidden', list.length > 0);
  }

  qInput.addEventListener('input', apply);
  catSel.addEventListener('change', apply);
  distSel.addEventListener('change', apply);
  sortSel.addEventListener('change', apply);

  apply();
}

document.addEventListener('DOMContentLoaded', () => initCatalog().catch(console.error));
