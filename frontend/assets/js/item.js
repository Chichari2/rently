const API_BASE = "http://127.0.0.1:8000";

async function fetchJSON(url){
  const res = await fetch(url, {cache: "no-store"});
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function el(html){
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function money(v){ return v != null ? `${v}€ / день` : "—"; }

async function initItem(){
  const id = new URLSearchParams(location.search).get("id");
  const wrap = document.getElementById("item-wrap");
  if(!id){ wrap.textContent = "Не указан id предмета."; return; }

  try{
    const i = await fetchJSON(`${API_BASE}/items/${encodeURIComponent(id)}`);
    const category = (i.category_code || "—");
    const img = i.image_url || "assets/img/placeholder.jpg";

    wrap.innerHTML = "";
    wrap.appendChild(el(`
      <article class="item">
        <div class="item-media">
          <img src="${img}" alt="">
        </div>
        <div class="item-body">
          <h1>${i.title || "—"}</h1>
          <div class="muted">${category} · ${i.district || "—"}</div>
          <div class="price big">${money(i.price_per_day)}</div>
          <p>${i.description || ""}</p>

          <div class="card">
            <div class="muted">Контакты</div>
            <div>Телефон: ${i.phone || "—"}</div>
            <div>Telegram: ${i.telegram || "—"}</div>
          </div>

          <div class="actions">
            <a class="btn" href="catalog.html">← Вернуться в каталог</a>
          </div>
        </div>
      </article>
    `));
  }catch(err){
    console.error(err);
    wrap.textContent = "Не удалось загрузить предмет.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initItem().catch(console.error);
});
