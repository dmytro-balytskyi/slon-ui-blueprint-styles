# slon-ui-blueprint-styles

Дизайн-система SLON24 для Vuetify 3: `blueprint` (дефолти компонентів), `themes` (світла й темна),
`src/styles/global.scss` (глобальні класи) і `src/styles/settings.scss` (SCSS-змінні Vuetify).

## Що станеться після push у `master`

Окремого тестового контуру немає — push іде в бій. Drone: `test` (`pnpm test`) → `publish` у **публічний**
npmjs.org (нова версія; наявну пропускає) → `trigger` перебудовує й деплоїть `slon-ui-menu24`. Червоний
`test` зупиняє все: пакет не публікується, хост не перебудовується. Тому правки збирайте в **один** push.
`.drone.yml` підписаний: правити лише з перепідписом `tools/drone-sign.ps1` (воркспейс), інакше впадуть усі білди.

## Реліз

```sh
pnpm test              # блупринт проти Vuetify, SCSS, еталон CSS; задумана зміна еталонів — pnpm test -u
pnpm run patch         # нова версія: коміт і тег vX.Y.Z
git push --follow-tags # без прапорця тег лишиться локально
```

## Як версія доходить до бою

`global.scss` у бою діє лише з бандла `menu24`; ремоути беруть пакет у CI через
`pnpm update @slonbeton/slon-ui-blueprint-styles --latest`. Дзеркало `npm.taxi-beton.ua` віддає pnpm нову
версію із затримкою до ~12 год: перебілд `menu24` від `trigger` може зібратися ще зі старою, новий CSS у бою —
після restart білду `menu24`, коли дзеркало оновилось. Standalone і Storybook — після bump lock.

## Підключення в UI

`vite.config`: `vuetify({ styles: { configFile: 'node_modules/@slonbeton/slon-ui-blueprint-styles/src/styles/settings.scss' } })`;
`plugins/vuetify.js`:

```js
import 'vuetify/styles'
import '@slonbeton/slon-ui-blueprint-styles/src/styles/global.scss'
import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { blueprint, themes } from '@slonbeton/slon-ui-blueprint-styles'
blueprint.aliases = { VBtnIcon: VBtn, SBtn: VBtn, FBtn: VBtn }
export default createVuetify({ blueprint, theme: { defaultTheme: 'light', themes } })
```
