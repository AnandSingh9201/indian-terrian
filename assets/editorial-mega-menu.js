function initialiseEditorialMegaMenu(menu) {
  if (menu.dataset.editorialMegaReady === 'true') return;

  const tabs = Array.from(menu.querySelectorAll('[data-editorial-mega-tab]'));
  const panels = Array.from(menu.querySelectorAll('[data-editorial-mega-panel]'));
  if (!tabs.length || !panels.length) return;

  const activate = (tab) => {
    const panelId = tab.getAttribute('aria-controls');
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      const active = panel.id === panelId;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('pointerenter', () => activate(tab));
    tab.addEventListener('focus', () => activate(tab));
  });

  menu.dataset.editorialMegaReady = 'true';
}

function initialiseAllEditorialMegaMenus(root = document) {
  root.querySelectorAll('[data-editorial-mega-menu]').forEach(initialiseEditorialMegaMenu);
}

document.addEventListener('DOMContentLoaded', () => initialiseAllEditorialMegaMenus());
document.addEventListener('shopify:section:load', (event) => initialiseAllEditorialMegaMenus(event.target));
