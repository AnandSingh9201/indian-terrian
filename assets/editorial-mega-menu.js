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

function getEditorialHeaderSections(root = document) {
  const headers = [];
  if (root.matches?.('.header-section')) headers.push(root);
  root.querySelectorAll?.('.header-section').forEach((header) => headers.push(header));
  return [...new Set(headers)];
}

function populateEditorialPanelNavigation(root = document) {
  getEditorialHeaderSections(root).forEach((header) => {
    const primaryMenuItems = Array.from(
      header.querySelectorAll('.editorial-header-experience > .editorial-panel-block > .editorial-panel-trigger')
    );

    header.querySelectorAll('[data-editorial-primary-menu-slot]').forEach((slot) => {
      if (slot.dataset.editorialPrimaryMenuReady === 'true') return;

      primaryMenuItems.forEach((item) => {
        const copy = item.cloneNode(true);
        copy.removeAttribute('data-editorial-panel-ready');
        slot.append(copy);
      });
      slot.dataset.editorialPrimaryMenuReady = 'true';
    });

    const secondaryMenuTemplate = header.querySelector('[data-editorial-secondary-menu-template]');
    if (!secondaryMenuTemplate) return;

    header.querySelectorAll('[data-editorial-secondary-menu-slot]').forEach((slot) => {
      if (slot.dataset.editorialSecondaryMenuReady === 'true') return;
      slot.append(secondaryMenuTemplate.content.cloneNode(true));
      slot.dataset.editorialSecondaryMenuReady = 'true';
    });
  });
}

function setEditorialMobileMenu(drawer, menuId) {
  drawer.querySelectorAll('[data-editorial-mobile-menu-content]').forEach((content) => {
    content.hidden = content.dataset.editorialMobileMenuContent !== menuId;
  });

  drawer.querySelectorAll('[data-editorial-mobile-menu-open]').forEach((item) => {
    const active = item.dataset.editorialMobileMenuOpen === menuId;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-expanded', String(active));
  });
}

function populateEditorialMobileDrawer(root = document) {
  getEditorialHeaderSections(root).forEach((header) => {
    const drawer = header.querySelector('[data-editorial-mobile-drawer]');
    if (!drawer) return;

    const primaryMenuSlot = drawer.querySelector('[data-editorial-mobile-primary-menu-slot]');
    if (primaryMenuSlot && primaryMenuSlot.dataset.editorialMobileMenuReady !== 'true') {
      const primaryMenuItems = header.querySelectorAll(
        '.editorial-header-experience > .editorial-panel-block > .editorial-panel-trigger'
      );

      primaryMenuItems.forEach((item) => {
        const copy = item.cloneNode(true);
        const menuId = copy.dataset.editorialPanelOpen;
        if (menuId) {
          copy.dataset.editorialMobileMenuOpen = menuId;
          copy.removeAttribute('data-editorial-panel-open');
          copy.removeAttribute('data-editorial-panel-ready');
          copy.removeAttribute('aria-controls');
          copy.setAttribute('aria-expanded', 'false');
        }
        primaryMenuSlot.append(copy);
      });
      primaryMenuSlot.dataset.editorialMobileMenuReady = 'true';
    }

    const contentSlot = drawer.querySelector('[data-editorial-mobile-content-slot]');
    if (contentSlot && contentSlot.dataset.editorialMobileContentReady !== 'true') {
      header.querySelectorAll('[data-editorial-mobile-menu-template]').forEach((template) => {
        contentSlot.append(template.content.cloneNode(true));
      });
      contentSlot.dataset.editorialMobileContentReady = 'true';
    }

    const secondaryMenuTemplate = header.querySelector('[data-editorial-secondary-menu-template]');
    const secondaryMenuSlot = drawer.querySelector('[data-editorial-mobile-secondary-menu-slot]');
    if (secondaryMenuTemplate && secondaryMenuSlot && secondaryMenuSlot.dataset.editorialMobileSecondaryMenuReady !== 'true') {
      secondaryMenuSlot.append(secondaryMenuTemplate.content.cloneNode(true));
      secondaryMenuSlot.dataset.editorialMobileSecondaryMenuReady = 'true';
    }
  });
}

function openEditorialMobileDrawer(drawer) {
  if (!window.matchMedia('(max-width: 749px)').matches) return;

  const firstMenu = drawer.querySelector('[data-editorial-mobile-menu-open]');
  if (firstMenu) setEditorialMobileMenu(drawer, firstMenu.dataset.editorialMobileMenuOpen);

  drawer.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  document.documentElement.classList.add('editorial-mobile-drawer-is-open');
  drawer.focus({ preventScroll: true });
}

function closeEditorialMobileDrawer(drawer, nativeHeaderDrawer) {
  if (drawer.hidden) return;

  drawer.hidden = true;
  drawer.setAttribute('aria-hidden', 'true');
  document.documentElement.classList.remove('editorial-mobile-drawer-is-open');
  nativeHeaderDrawer?.close?.();
}

function initialiseEditorialMobileDrawer(root = document) {
  getEditorialHeaderSections(root).forEach((header) => {
    const drawer = header.querySelector('[data-editorial-mobile-drawer]');
    const nativeHeaderDrawer = header.querySelector('header-drawer');
    const nativeDrawerDetails = header.querySelector('header-drawer .menu-drawer-container');
    if (!drawer || !nativeHeaderDrawer || !nativeDrawerDetails || drawer.dataset.editorialMobileDrawerReady === 'true') return;

    nativeDrawerDetails.addEventListener('toggle', () => {
      if (nativeDrawerDetails.open) {
        openEditorialMobileDrawer(drawer);
      } else {
        closeEditorialMobileDrawer(drawer, nativeHeaderDrawer);
      }
    });

    drawer.querySelectorAll('[data-editorial-mobile-drawer-close]').forEach((button) => {
      button.addEventListener('click', () => closeEditorialMobileDrawer(drawer, nativeHeaderDrawer));
    });

    drawer.querySelectorAll('[data-editorial-mobile-menu-open]').forEach((button) => {
      button.addEventListener('click', () => setEditorialMobileMenu(drawer, button.dataset.editorialMobileMenuOpen));
    });

    drawer.querySelectorAll('.editorial-mobile-menu-list__item > details').forEach((accordionItem) => {
      accordionItem.addEventListener('toggle', () => {
        if (!accordionItem.open) return;

        const menuContent = accordionItem.closest('[data-editorial-mobile-menu-content]');
        menuContent?.querySelectorAll('.editorial-mobile-menu-list__item > details[open]').forEach((otherItem) => {
          if (otherItem !== accordionItem) otherItem.open = false;
        });
      });
    });

    drawer.dataset.editorialMobileDrawerReady = 'true';
  });
}

function updateEditorialPanelNavigation(panel, isOpen) {
  const header = panel.closest('.header-section');
  if (!header) return;

  header.querySelectorAll('[data-editorial-panel-open]').forEach((item) => {
    if (item.dataset.editorialPanelOpen !== panel.id) return;
    item.classList.toggle('is-active', isOpen);
    if (item.matches('button')) item.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      item.setAttribute('aria-current', 'page');
    } else {
      item.removeAttribute('aria-current');
    }
  });
}

function closeEditorialPanel(panel, restoreFocus = true) {
  if (!panel || panel.hidden) return;

  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  updateEditorialPanelNavigation(panel, false);
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

  const header = panel.closest('.header-section');
  const outerTrigger = Array.from(
    header?.querySelectorAll('.editorial-header-experience > .editorial-panel-block > [data-editorial-panel-open]') || []
  ).find((item) => item.dataset.editorialPanelOpen === panel.id);

  panel._editorialPanelTrigger = outerTrigger || trigger;
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  trigger.setAttribute('aria-expanded', 'true');
  updateEditorialPanelNavigation(panel, true);
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
  populateEditorialPanelNavigation(root);
  populateEditorialMobileDrawer(root);
  initialiseEditorialPanels(root);
  initialiseEditorialMobileDrawer(root);
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const panel = document.querySelector('[data-editorial-panel]:not([hidden])');
  if (panel) closeEditorialPanel(panel);
});

document.addEventListener('DOMContentLoaded', () => initialiseEditorialMenus());
document.addEventListener('shopify:section:load', (event) => initialiseEditorialMenus(event.target));
