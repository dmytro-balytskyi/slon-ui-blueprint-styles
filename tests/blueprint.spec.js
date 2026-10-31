import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as components from 'vuetify/components'

// Пакет імпортуємо так, як споживачі: через `main` з package.json, а не з src/blueprint.js
// напряму — тоді й перейменування файлів у src/ (ТЗ 4.2) лишається під цим тестом.
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const { blueprint, themes } = await import(new URL(`../${pkg.main}`, import.meta.url).href)

// Псевдоніми споживачі ставлять самі (`blueprint.aliases` у plugins/vuetify.*): усі три — VBtn.
const ALIASES = { VBtnIcon: 'VBtn', SBtn: 'VBtn', FBtn: 'VBtn' }

// Тип — так, як перевіряє Vue: null і undefined не перевіряються, Object — будь-який об'єкт.
const TYPE_CHECKS = new Map([
  [String, (value) => typeof value === 'string'],
  [Number, (value) => typeof value === 'number'],
  [Boolean, (value) => typeof value === 'boolean'],
  [Function, (value) => typeof value === 'function'],
  [Object, (value) => typeof value === 'object'],
  [Array, (value) => Array.isArray(value)]
])

function typeMatches(type, value) {
  if (value == null || type == null || type === true) return true
  return [type].flat().some((T) => (TYPE_CHECKS.get(T) ?? ((v) => v instanceof T))(value))
}

const isComponentKey = (key, value) =>
  /^V[A-Z]/.test(key) && value !== null && typeof value === 'object'

/** Обходить дефолти: вкладені `V*` — окремі компоненти зі своїм шляхом. */
function walk(name, defaults, path, out) {
  out.components.push({ path, name })
  for (const [prop, value] of Object.entries(defaults)) {
    if (prop === 'class' || prop === 'style') continue
    if (isComponentKey(prop, value)) walk(prop, value, `${path}.${prop}`, out)
    else out.props.push({ path: `${path}.${prop}`, name, prop, value })
  }
  return out
}

const { components: usedComponents, props: usedProps } = Object.entries(blueprint.defaults)
  .filter(([name]) => name !== 'global')
  .reduce((out, [name, defaults]) => walk(name, defaults, name, out), { components: [], props: [] })

const componentOf = (name) => components[ALIASES[name] ?? name]

// ТЗ 2.1: дефолт із неіснуючою пропсою чи значенням, яке Vuetify відкидає, мовчки не діє — у бою
// нічого не червоніє, просто вигляд не той. Тут таке видно до публікації.
describe('blueprint.defaults проти встановленого Vuetify', () => {
  it.each(usedComponents.map(({ path, name }) => [path, name]))(
    '%s — компонент є у vuetify/components',
    (_, name) => {
      expect(componentOf(name), `немає компонента ${ALIASES[name] ?? name}`).toBeDefined()
    }
  )

  for (const { path, name, prop, value } of usedProps) {
    const shown = JSON.stringify(value)
    it(`${path} = ${shown} — пропса є, тип і validator приймають`, () => {
      const raw = componentOf(name)?.props?.[prop]
      expect(raw, `у ${ALIASES[name] ?? name} немає пропси ${prop}`).toBeDefined()
      const def = typeof raw === 'function' || Array.isArray(raw) ? { type: raw } : raw
      expect(typeMatches(def.type, value), `тип ${prop} не приймає ${shown}`).toBe(true)
      if (def.validator) {
        expect(def.validator(value), `validator ${prop} відкидає ${shown}`).toBe(true)
      }
    })
  }
})

// Сейфнет під ТЗ 3.1 і 3.5 (зняття мертвих дефолтів, константи розмірів іконок): зміна, яку не
// задумували, видна в diff знімка, а задумана — оновлюється разом із нею (`vitest -u`).
describe('знімки пакета', () => {
  it('blueprint.defaults', () => {
    expect(blueprint.defaults).toMatchSnapshot()
  })

  it('themes', () => {
    expect(themes).toMatchSnapshot()
  })
})
