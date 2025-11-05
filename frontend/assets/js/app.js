// === CONFIG ===
export const DATA_URL = '/items';  // относительный путь для Render

const CATEGORY_LABEL = {
  tools: 'Werkzeuge',
  electronics: 'Elektronik',
  sports: 'Sport',
  party: 'Partyartikel',
  kids: 'Kinderbedarf'
};

let __ITEMS = [];

// utils
export async function fetchJSON(url){
  const res = await fetch(url, { cache: 'no-store' });
  if(!res.ok) throw new Error('Failed to load ' + url + ' (' + res.status + ')');
  return await res.json();
}

export function money(v){ return `${v} € / Tag`; }

export function el(html){
  const tplt = document.createElement('template');
  tplt.innerHTML = html.trim();
  return tplt.content.firstElementChild;
}

export function linkToItem(id){ return `item.html?id=${encodeURIComponent(id)}`; }

document.addEventListener('DOMContentLoaded', async () => {
  const path = location.pathname.split('/').pop();
  if (path === '' || path === 'index.html') {
    try {
      __ITEMS = await fetchJSON(DATA_URL);

      // Чипсы категорий
      const cats = [...new Set(__ITEMS.map(i => i.category_code).filter(Boolean))].slice(0, 8);
      const wrap = document.getElementById('home-cats');
      if (wrap) {
        wrap.innerHTML = '';
        cats.forEach(code => {
          const label = CATEGORY_LABEL[code] || code;
          wrap.appendChild(el(`<a class="chip" href="catalog.html?category=${encodeURIComponent(code)}">${label}</a>`));
        });
      }

      // Популярное
      const grid = document.getElementById('popular-grid');
      if (grid) {
        grid.innerHTML = '';
        __ITEMS.slice(0, 8).forEach(i => {
          const cat = CATEGORY_LABEL[i.category_code] || i.category_code || '—';
          const img = i.image_url || 'assets/img/placeholder.jpg';
          grid.appendChild(el(`
            <a class="card" href="${linkToItem(i.id)}">
              <img class="thumb" src="${img}" alt="">
              <div class="pad">
                <div class="muted">${cat} · ${i.district || '—'}</div>
                <div>${i.title || '—'}</div>
                <div class="price">${money(i.price_per_day)}</div>
              </div>
            </a>
          `));
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
});
