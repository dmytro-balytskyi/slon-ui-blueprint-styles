# slon-ui-blueprint-styles
SlonBeton blueprint and global scss

Після внесення змін, запиши їх та онови версію пакету:

```sh
pnpm run patch
git push
```

Після пушу CI публікує пакет і сам оновлює хост: крок `bump-host` (`scripts/bump-host.sh`)
робить у `slon-ui-menu24` коміт `chore: blueprint-styles → <версія>` із новим
`pnpm-lock.yaml`, і хост перезбирається з нею. У проді дефолти блупринту й `global.scss`
діють лише з бандла хоста, тож нова версія видна одразу. Ремоути оновлюються окремо:
`tools/bump-blueprint-styles.ps1` у воркспейсі (або `pnpm add -D @slonbeton/slon-ui-blueprint-styles@<версія>`
і коміт lock у потрібному репо). У CI споживачів `pnpm update … --latest` більше немає:
збірка йде рівно з того, що в lock.