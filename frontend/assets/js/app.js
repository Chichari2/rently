// === CONFIG ===
const API_BASE  = 'http://127.0.0.1:8000';   // локальный FastAPI
const DATA_URL  = API_BASE + '/items/';      // читаем из бэка

// сопоставление кодов категорий -> i18n-ключи
const CATEGORY_I18N_KEY = {
  tools: 'cat_tools',
  electronics: 'cat_electronics',
  sports: 'cat_sports',
  party: 'cat_party',
  kids: 'cat_kids'
};

// Light data cache
let __ITEMS = [];

// utils
async function fetchJSON(url){
  const res = await fetch(url, { cache: 'no-store' });
  if(!res.ok) throw new Error('Failed to load ' + url);
  return await res.json();
}

function money(v){
  // "12 € / Tag" / "12 € / day" / "12 € / день" — зависит от i18n
  return `${v} ${t('per_day')}`;
}

function el(html){
  const tplt = document.createElement('template');
  tplt.innerHTML = html.trim();
  return tplt.content.firstElementChild;
}

function linkToItem(id){
  return `item.html?id=${encodeURIComponent(id)}`;
}

function i18nCategory(code){
  const k = CATEGORY_I18N_KEY[code] || code;
  return t(k);
}

// Применяем переводы к статическому тексту страницы
function applyI18nStatic(){
  // установить атрибут lang документа
  if (window.LANG) {
    document.documentElement.setAttribute('lang', window.LANG);
  }

  const byIdText = (id, key) => {
    const n = document.getElementById(id);
    if (n) n.textContent = t(key);
  };

  // header
  byIdText('nav-catalog',  'nav_catalog');
  byIdText('nav-add',      'nav_add');
  byIdText('t_rent_title', 'rent_title');
  byIdText('t_rent_sub',   'rent_sub');
  byIdText('t_popular',    'popular');

  const search = document.getElementById('t_search');
  if (search) {
    const ph = t('search_placeholder');
    search.placeholder = ph;
    search.setAttribute('aria-label', ph);
  }
  const findBtn = document.getElementById('t_find_btn');
  if (findBtn) findBtn.textContent = t('find_btn');

  // footer
  byIdText('t_footer_note',  'footer_note');
  byIdText('t_footer_about', 'footer_about');
  byIdText('t_footer_add',   'footer_add');
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1) статические надписи
  applyI18nStatic();

  // 2) главная: чипсы и «Популярное» из API
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
          wrap.appendChild(
            el(`<a class="chip" href="catalog.html?category=${encodeURIComponent(code)}">${i18nCategory(code)}</a>`)
          );
        });
      }

      // Популярное (первые 8)
      const grid = document.getElementById('popular-grid');
      if (grid) {
        grid.innerHTML = '';
        __ITEMS.slice(0, 8).forEach(i => {
          const cat = i18nCategory(i.category_code) || '—';
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
