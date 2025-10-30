async function initItem(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const wrap = document.getElementById('item-wrap');
  __ITEMS = await fetchJSON(DATA_URL);
  const it = __ITEMS.find(x => String(x.id) === String(id));
  if(!it){
    wrap.innerHTML = '<p>Предмет не найден.</p>';
    return;
  }
  const img = it.images?.[0] || 'assets/img/placeholder.jpg';
  const contact = it.contact || {};
  const formUrl = GOOGLE_FORM_URL ? (GOOGLE_FORM_URL) : null;

  wrap.innerHTML = `
    <div class="item-gallery">
      <img src="${img}" alt="${it.title}">
    </div>
    <aside class="item-info">
      <h1>${it.title}</h1>
      <div class="muted">${it.category} · ${it.district}</div>
      <div class="price" style="margin:8px 0">${money(it.price_per_day)}</div>
      <div class="muted">Залог: ${it.deposit ? it.deposit + '€' : 'без залога'}</div>
      <p>${it.description}</p>
      <div style="margin:12px 0">
        <span class="badge">${it.location || 'Berlin'}</span>
        <span class="badge">Состояние: ${it.condition || 'нормальное'}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${formUrl ? `<a class="btn primary" target="_blank" rel="noopener" href="${formUrl}">Запросить аренду</a>` : ''}
        ${contact.telegram ? `<a class="btn" target="_blank" href="https://t.me/${contact.telegram.replace('@','')}">Написать в Telegram</a>` : ''}
        ${contact.email ? `<a class="btn" href="mailto:${contact.email}?subject=Аренда: ${encodeURIComponent(it.title)}">Написать на email</a>` : ''}
      </div>
    </aside>
  `;
}

document.addEventListener('DOMContentLoaded', () => initItem().catch(console.error));
