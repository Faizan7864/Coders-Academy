/* ============================================================
   js/app.js  –  Application entry point & SDK initialization
   ============================================================ */

'use strict';

async function initApp() {

  /* ---- Element SDK (visual config / theming) ---- */
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (cfg) => {
        config = cfg;
        applyConfig();
      },
      mapToCapabilities: (cfg) => ({
        recolorables: [
          {
            get: () => cfg.background_color  || defaultConfig.background_color,
            set: (v) => { cfg.background_color  = v; window.elementSdk.setConfig({ background_color:  v }); }
          },
          {
            get: () => cfg.surface_color     || defaultConfig.surface_color,
            set: (v) => { cfg.surface_color     = v; window.elementSdk.setConfig({ surface_color:     v }); }
          },
          {
            get: () => cfg.text_color        || defaultConfig.text_color,
            set: (v) => { cfg.text_color        = v; window.elementSdk.setConfig({ text_color:        v }); }
          },
          {
            get: () => cfg.primary_color     || defaultConfig.primary_color,
            set: (v) => { cfg.primary_color     = v; window.elementSdk.setConfig({ primary_color:     v }); }
          },
          {
            get: () => cfg.secondary_color   || defaultConfig.secondary_color,
            set: (v) => { cfg.secondary_color   = v; window.elementSdk.setConfig({ secondary_color:   v }); }
          }
        ],
        borderables:   [],
        fontEditable:  undefined,
        fontSizeable:  undefined
      }),
      mapToEditPanelValues: (cfg) => new Map([
        ['academy_name',  cfg.academy_name  || defaultConfig.academy_name],
        ['hero_title',    cfg.hero_title    || defaultConfig.hero_title],
        ['hero_subtitle', cfg.hero_subtitle || defaultConfig.hero_subtitle]
      ])
    });
  }

  /* ---- Data SDK (user records + enrollments) ---- */
  if (window.dataSdk) {
    const result = await window.dataSdk.init(dataHandler);
    if (!result.isOk) {
      console.error('Failed to initialize Data SDK');
    }
  }

  /* ---- UI Setup ---- */
  createParticles();
  applyConfig();
  renderCourseGrid();
}

// Boot
initApp();
