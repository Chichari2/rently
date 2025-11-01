// i18n.js — простая локализация фронта

// язык берём из localStorage, по умолчанию DE
const LANG = localStorage.getItem('lang') || 'de';

const translations = {
  ru: {
    nav_catalog: 'Каталог',
    nav_add: 'Сдать в аренду',
    rent_title: 'Аренда вещей в Берлине — быстро и без лишних затрат',
    rent_sub: 'Спорт, инструменты, электроника, праздники, детские товары — найди и возьми в аренду рядом с тобой.',
    search_placeholder: 'Поиск: дрель, велосипед, проектор...',
    find_btn: 'Найти',
    popular: 'Популярное',
    footer_note: 'MVP для теста спроса. Без регистрации и оплаты на сайте.',
    footer_about: 'О проекте',
    footer_add: 'Сдать вещь',

    // категории
    cat_tools: 'Инструменты',
    cat_electronics: 'Электроника',
    cat_sports: 'Спорт',
    cat_party: 'Праздники',
    cat_kids: 'Детские товары',
    per_day: '€ / день'
  },
  en: {
    nav_catalog: 'Catalog',
    nav_add: 'Rent out',
    rent_title: 'Rent anything in Berlin — fast and affordable',
    rent_sub: 'Sports, tools, electronics, party gear, kids’ items — find and rent near you.',
    search_placeholder: 'Search: drill, bike, projector...',
    find_btn: 'Search',
    popular: 'Popular',
    footer_note: 'MVP to test demand. No sign-ups or payments on site.',
    footer_about: 'About',
    footer_add: 'List an item',

    cat_tools: 'Tools',
    cat_electronics: 'Electronics',
    cat_sports: 'Sports',
    cat_party: 'Party',
    cat_kids: 'Kids',
    per_day: '€ / day'
  },
  de: {
    nav_catalog: 'Katalog',
    nav_add: 'Vermieten',
    rent_title: 'Dinge in Berlin mieten — schnell und günstig',
    rent_sub: 'Sport, Werkzeuge, Elektronik, Partyartikel, Kinderbedarf — finde und miete in deiner Nähe.',
    search_placeholder: 'Suche: Bohrer, Fahrrad, Beamer...',
    find_btn: 'Suchen',
    popular: 'Beliebt',
    footer_note: 'MVP zur Nachfrageprüfung. Keine Registrierung oder Zahlungen auf der Website.',
    footer_about: 'Über das Projekt',
    footer_add: 'Artikel einstellen',

    cat_tools: 'Werkzeuge',
    cat_electronics: 'Elektronik',
    cat_sports: 'Sport',
    cat_party: 'Party',
    cat_kids: 'Kinder',
    per_day: '€ / Tag'
  }
};

function t(key) {
  return (translations[LANG] && translations[LANG][key]) || key;
}

// публичная функция для переключателя
function setLang(lang) {
  localStorage.setItem('lang', lang);
  location.reload();
}

// экспортируем в глобал для app.js и кнопок
window.t = t;
window.setLang = setLang;
window.LANG = LANG;
