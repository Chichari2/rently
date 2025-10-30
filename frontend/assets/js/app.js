// Global config for the MVP
const BASE_PATH = '/rently'; // If you publish under a subpath, e.g. '/rent-berlin', set it here.
const DATA_URL = BASE_PATH + '/assets/data/items.json';
const GOOGLE_FORM_URL = ''; // <--- paste your Google Form "public" URL here

// Light data cache
let __ITEMS = [];

async function fetchJSON(url){
  const res = await fetch(url, {cache: 'no-store'});
  if(!res.ok) throw new Error('Failed to load ' + url);
  return await res.json();
}

function money(v){ return `${v}€ / день`; }

function el(html){
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

function linkToItem(id){
  return `item.html?id=${encodeURIComponent(id)}`;
}

function unique(arr){ return [...new Set(arr)]; }

// Home page enrich
document.addEventListener('DOMContentLoaded', async () => {
  const path = location.pathname.split('/').pop();
  if (path === '' || path === 'index.html'){
    try{
      __ITEMS = await fetchJSON(DATA_URL);
      // category chips
      const cats = unique(__ITEMS.map(i => i.category)).slice(0, 8);
      const wrap = document.getElementById('home-cats');
      cats.forEach(c => wrap.appendChild(el(`<a class="chip" href="catalog.html?category=${encodeURIComponent(c)}">${c}</a>`)));
      // popular (first 8)
      const grid = document.getElementById('popular-grid');
      __ITEMS.slice(0, 8).forEach(i => {
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
    }catch(e){ console.error(e); }
  }

  // add.html: plug form button if present
  const btn = document.getElementById('open-form');
  if(btn){
    btn.href = GOOGLE_FORM_URL || '#';
    if(!GOOGLE_FORM_URL){
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.remove('primary');
      btn.textContent = 'Добавь ссылку на Google Form в app.js';
    }
  }
});
