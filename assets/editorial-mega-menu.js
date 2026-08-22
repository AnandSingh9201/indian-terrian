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

function closeEditorialPanel(panel, restoreFocus = true) {
  if (!panel || panel.hidden) return;

  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  const trigger = panel._editorialPanelTrigger;
  trigger?.setAttribute('aria-expanded', 'false');

  if (!document.querySelector('[data-editorial-panel]:not([hidden])')) {
    document.documentElement.classList.remove('editorial-panel-is-open');
  }

  if (restoreFocus) trigger?.focus();
}

function openEditorialPanel(panel, trigger) {
  document.querySelectorAll('[data-editorial-panel]:not([hidden])').forEach((openPanel) => {
    closeEditorialPanel(openPanel, false);
  });

  panel._editorialPanelTrigger = trigger;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  trigger.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('editorial-panel-is-open');
  panel.focus({ preventScroll: true });
}

function initialiseEditorialPanels(root = document) {
  root.querySelectorAll('[data-editorial-panel-open]').forEach((trigger) => {
    if (trigger.dataset.editorialPanelReady === 'true') return;

    const panel = document.getElementById(trigger.dataset.editorialPanelOpen);
    if (!panel) return;

    trigger.addEventListener('click', () => openEditorialPanel(panel, trigger));
    trigger.dataset.editorialPanelReady = 'true';
  });

  root.querySelectorAll('[data-editorial-panel]').forEach((panel) => {
    if (panel.dataset.editorialPanelReady === 'true') return;

    panel.querySelectorAll('[data-editorial-panel-close]').forEach((button) => {
      button.addEventListener('click', () => closeEditorialPanel(panel));
    });
    panel.dataset.editorialPanelReady = 'true';
  });
}

function initialiseEditorialMenus(root = document) {
  root.querySelectorAll('[data-editorial-mega-menu]').forEach(initialiseEditorialMegaMenu);
  initialiseEditorialPanels(root);
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const panel = document.querySelector('[data-editorial-panel]:not([hidden])');
  if (panel) closeEditorialPanel(panel);
});

document.addEventListener('DOMContentLoaded', () => initialiseEditorialMenus());
document.addEventListener('shopify:section:load', (event) => initialiseEditorialMenus(event.target));
