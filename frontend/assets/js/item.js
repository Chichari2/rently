const DATA_URL = '/items';

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

function money(v){ return v != null ? `${v} € / Tag` : "—"; }

document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id");
  const wrap = document.getElementById("item-wrap");
  if(!id){ wrap.textContent = "Parameter 'id' fehlt."; return; }

  try{
    const i = await fetchJSON(`${DATA_URL}/${encodeURIComponent(id)}`);
    const img = i.image_url || "assets/img/placeholder.jpg";

    wrap.innerHTML = "";
    wrap.appendChild(el(`
      <article class="item">
        <div class="item-gallery"><img src="${img}" alt=""></div>
        <div class="item-info">
          <h1>${i.title || "—"}</h1>
          <div class="muted">${i.category_code || "—"} · ${i.district || "—"}</div>
          <div class="price big">${money(i.price_per_day)}</div>
          <p>${i.description || ""}</p>

          <div class="card" style="padding:12px;margin-top:12px">
            <div class="muted">Kontakt</div>
            <div>Telefon: ${i.phone || "—"}</div>
            <div>Telegram: ${i.telegram || "—"}</div>
          </div>

          <div class="actions" style="margin-top:12px">
            <a class="btn" href="catalog.html">← Zurück zum Katalog</a>
          </div>
        </div>
      </article>
    `));
  }catch(err){
    console.error(err);
    wrap.textContent = "Artikel konnte nicht geladen werden.";
  }
});
