import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

/** Компілює SCSS пакета й збирає попередження Sass замість друку в консоль. */
function compileScss(file) {
  const warnings = []
  const { css } = compile(file, {
    loadPaths: ['node_modules'],
    logger: { warn: (message) => warnings.push(message), debug: () => {} }
  })
  return { css, warnings }
}

/** Правила верхнього рівня скомпільованого CSS: перелік селекторів і тіло. */
function cssRules(css) {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
    selectors: selectors.split(',').map((selector) => selector.trim()),
    body
  }))
}

// settings.scss тягне `vuetify/settings` — його компіляція чекає devDependency vuetify
// (ТЗ blueprint 2.1), тож тут лише global.scss.
describe('global.scss', () => {
  it('компілюється без попереджень Sass', () => {
    expect(compileScss('src/styles/global.scss').warnings).toEqual([])
  })

  // ТЗ shared 4.18a: стек оверлеїв Vuetify — модульний стан кожної копії, а ремоути везуть
  // кожен свою. Тултіп споживача в діалозі shared бере з порожнього стеку своєї копії 2000
  // і лягає під картку (2400). Два класи — специфічність (0,2,0): перебиває вирівнювач
  // `.v-overlay--active { z-index: 2000 !important }` споживачів (0,1,0) за будь-якого
  // порядку CSS.
  it('піднімає тултіпи над діалогами: .v-overlay.v-tooltip — 10000 !important', () => {
    const rule = cssRules(compileScss('src/styles/global.scss').css).find(({ selectors }) =>
      selectors.includes('.v-overlay.v-tooltip')
    )

    expect(rule, 'немає правила з селектором .v-overlay.v-tooltip').toBeDefined()
    expect(rule.body).toMatch(/z-index:\s*10000\s*!important/)
  })
})
