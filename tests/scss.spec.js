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

// ТЗ blueprint 2.2: settings.scss кожен UI підключає як `styles.configFile` у vite-plugin-vuetify.
// Змінна, якої у Vuetify немає, чи deprecation Sass тут видно один раз — а не в CI споживачів.
describe('settings.scss', () => {
  it('компілюється з vuetify/settings без помилок і попереджень Sass', () => {
    expect(compileScss('src/styles/settings.scss').warnings).toEqual([])
  })
})

describe('global.scss', () => {
  it('компілюється без попереджень Sass', () => {
    expect(compileScss('src/styles/global.scss').warnings).toEqual([])
  })

  // Еталон скомпільованого CSS: правки без зміни вигляду (константи кольорів — ТЗ 3.6, поділ
  // файлу — 3.10, форматування — 4.1) мусять лишити його без diff. Задумана зміна правил —
  // оновлюється разом із нею (`vitest -u`), і diff еталона видно в рев'ю.
  it('скомпільований CSS збігається з еталоном __snapshots__/global.css', async () => {
    await expect(compileScss('src/styles/global.scss').css).toMatchFileSnapshot(
      '__snapshots__/global.css'
    )
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

  // ТЗ blueprint 5.3: дія рядка видима лише під курсором. Без запасного варіанта для дотику
  // прозора ціль на телефоні клікабельна, але невидима; з клавіатури її показує фокус у рядку.
  it('.s-hover-reveal: ціль прихована, під курсором і у фокусі видима, на дотику — завжди', () => {
    const { css } = compileScss('src/styles/global.scss')
    const rules = cssRules(css)
    const target = '.s-hover-reveal .s-hover-reveal__target'

    // перше правило з цим селектором — базове; друге, з тим самим, — у @media нижче
    const hidden = rules.find(({ selectors }) => selectors.includes(target))
    expect(hidden, `немає правила з селектором ${target}`).toBeDefined()
    expect(hidden.body).toMatch(/opacity:\s*0;/)
    expect(hidden.body).toMatch(/transition:\s*opacity/)

    const shown = rules.find(({ selectors }) =>
      selectors.includes('.s-hover-reveal:hover .s-hover-reveal__target')
    )
    expect(shown, 'немає правила для :hover').toBeDefined()
    expect(shown.selectors).toContain('.s-hover-reveal:focus-within .s-hover-reveal__target')
    expect(shown.body).toMatch(/opacity:\s*1;/)

    expect(css).toMatch(
      /@media \(hover: none\)\s*\{\s*\.s-hover-reveal \.s-hover-reveal__target\s*\{\s*opacity:\s*1;\s*\}/
    )
  })

  // ТЗ blueprint 5.2: збіг пошуку сервер віддає в `<em>`; без спільного правила кожен ремоут стилізував
  // його сам, а messages — голим `em` на весь хост.
  it('.s-search-highlight em: збіг пошуку — малиновий фон теми, білий текст, без курсиву', () => {
    const rule = cssRules(compileScss('src/styles/global.scss').css).find(({ selectors }) =>
      selectors.includes('.s-search-highlight em')
    )

    expect(rule, 'немає правила з селектором .s-search-highlight em').toBeDefined()
    expect(rule.body).toMatch(/font-style:\s*normal;/)
    expect(rule.body).toMatch(/background-color:\s*rgb\(var\(--v-theme-selected\)\);/)
    expect(rule.body).toMatch(/color:\s*#fff;/)
    expect(rule.body).toMatch(/padding:\s*0 2px;/)
  })

  // ТЗ blueprint 5.1: смуга статусу зліва на картці. Колір — змінною, тож модифікатор не змагається
  // специфічністю з `.v-card`; без модифікатора — колір рамки Vuetify (так виглядає скелетон).
  it('.s-card-stripe: смуга 11px кольором зі змінної, модифікатори — кольори теми й сірий #616161', () => {
    const rules = cssRules(compileScss('src/styles/global.scss').css)
    const body = (selector) => rules.find(({ selectors }) => selectors.includes(selector))?.body

    expect(body('.s-card-stripe'), 'немає правила .s-card-stripe').toMatch(
      /border-left:\s*11px solid rgba\(var\(--s-stripe-color\), var\(--s-stripe-opacity\)\) !important;/
    )
    expect(body('.s-card-stripe')).toMatch(/--s-stripe-color:\s*var\(--v-border-color\);/)
    for (const color of ['primary', 'secondary', 'success', 'error', 'warning', 'info']) {
      expect(body(`.s-card-stripe--${color}`), `немає модифікатора --${color}`).toMatch(
        new RegExp(`--s-stripe-color:\\s*var\\(--v-theme-${color}\\);`)
      )
    }
    // статус «перенесено» в замовленнях — той самий #616161, що був, у світлій і темній темі
    expect(body('.s-card-stripe--grey'), 'немає модифікатора --grey').toMatch(/--s-stripe-color:\s*97, 97, 97;/)
  })

  // ТЗ blueprint 5.4: SortableJS на мить dragstart вішає `.sortable-drag` на рядок, поки браузер знімає
  // «привида» перетягування; прозорий рядок — однаково в усіх списках (рішення користувача 2026-10-31).
  it('.sortable-drag: «привид» перетягування прозорий', () => {
    const rule = cssRules(compileScss('src/styles/global.scss').css).find(({ selectors }) =>
      selectors.includes('.sortable-drag')
    )

    expect(rule, 'немає правила .sortable-drag').toBeDefined()
    expect(rule.body).toMatch(/opacity:\s*0 !important;/)
  })
})
