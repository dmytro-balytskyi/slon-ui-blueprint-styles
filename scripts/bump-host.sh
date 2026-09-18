#!/bin/sh
# Доставка нової версії @slonbeton/slon-ui-blueprint-styles у хост (slon-ui-menu24).
#
# Запускається в CI (.drone.yml, крок bump-host) одразу після publish: у проді
# blueprint.js і global.scss діють лише з бандла хоста, тож саме його lock має
# оновитись комітом у git, а не підміною пакета всередині контейнера збірки.
# Ремоути оновлює tools/bump-blueprint-styles.ps1 у воркспейсі, коли зручно.
#
# Оточення:
#   TARGET         owner/repo на GitHub (типово dmytro-balytskyi/slon-ui-menu24)
#   TARGET_REPO    явний URL або локальний шлях цільового репо (для проби); якщо не
#                  заданий — будується з TARGET за режимом доступу нижче
#   DEPLOY_KEY     приватний SSH deploy key з правом запису на цільове репо (секрет
#                  Drone; потрібен адмін репо на GitHub і в Drone). Якщо є — SSH.
#   DRONE_NETRC_USERNAME / DRONE_NETRC_PASSWORD
#                  git-облікові дані самого пайплайну: Drone віддає їх крокам для
#                  приватних репо (токен того, хто активував репо в Drone). Без
#                  DEPLOY_KEY пуш іде ними по HTTPS — нового секрету не треба.
#   TARGET_BRANCH  гілка (типово master)
#   REGISTRY       npm-реєстр (типово https://npm.taxi-beton.ua)
#   VERSION        версія для доставки (типово — з package.json цього репо)
#   PNPM           команда pnpm (типово pnpm; локально можна "npx -y pnpm@10.20.0")
#   DRY_RUN=1      усе, крім push; наприкінці показує diff --stat
set -eu

PKG='@slonbeton/slon-ui-blueprint-styles'
VERSION=${VERSION:-$(node -p "require('./package.json').version")}
TARGET=${TARGET:-dmytro-balytskyi/slon-ui-menu24}
TARGET_BRANCH=${TARGET_BRANCH:-master}
REGISTRY=${REGISTRY:-https://npm.taxi-beton.ua}
PNPM=${PNPM:-pnpm}
DRY_RUN=${DRY_RUN:-0}
WORKDIR=$(mktemp -d)

log() { echo "[bump-host] $*"; }

# 1. Дзеркало реєстру може віддати щойно опубліковану версію не одразу.
i=0
until $PNPM view "$PKG@$VERSION" version --registry "$REGISTRY" >/dev/null 2>&1; do
  i=$((i + 1))
  if [ "$i" -ge 10 ]; then
    log "ERROR: $PKG@$VERSION is not visible in $REGISTRY after 10 tries"
    exit 1
  fi
  log "waiting for $PKG@$VERSION in $REGISTRY ($i/10)"
  sleep 15
done
log "$PKG@$VERSION is in $REGISTRY"

# 2. Доступ до цільового репо: deploy key (SSH) → облікові дані пайплайну (HTTPS) → явний TARGET_REPO.
if [ -n "${DEPLOY_KEY:-}" ]; then
  mkdir -p "$HOME/.ssh"
  chmod 700 "$HOME/.ssh"
  printf '%s\n' "$DEPLOY_KEY" > "$HOME/.ssh/id_deploy"
  chmod 600 "$HOME/.ssh/id_deploy"
  ssh-keyscan -t ed25519,ecdsa,rsa github.com >> "$HOME/.ssh/known_hosts" 2>/dev/null
  export GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_deploy -o IdentitiesOnly=yes"
  TARGET_REPO=${TARGET_REPO:-git@github.com:$TARGET.git}
  log "auth: deploy key (ssh)"
elif [ -n "${DRONE_NETRC_PASSWORD:-}" ]; then
  # Значення не друкуємо і не кладемо в URL: git читає ~/.netrc сам.
  printf 'machine %s\nlogin %s\npassword %s\n' \
    "${DRONE_NETRC_MACHINE:-github.com}" "${DRONE_NETRC_USERNAME:-x-access-token}" "$DRONE_NETRC_PASSWORD" > "$HOME/.netrc"
  chmod 600 "$HOME/.netrc"
  TARGET_REPO=${TARGET_REPO:-https://${DRONE_NETRC_MACHINE:-github.com}/$TARGET.git}
  log "auth: pipeline netrc credentials (https)"
elif [ -n "${TARGET_REPO:-}" ]; then
  log "auth: none, using TARGET_REPO as given (local run)"
else
  log "ERROR: no DEPLOY_KEY, no DRONE_NETRC_PASSWORD and no TARGET_REPO — cannot reach $TARGET"
  exit 1
fi

# 3. Клон цільового репо.
git clone --quiet --depth 1 --branch "$TARGET_BRANCH" "$TARGET_REPO" "$WORKDIR/repo"
cd "$WORKDIR/repo"
$PNPM config set registry "$REGISTRY"

CURRENT=$(node -p "const p=require('./package.json');(p.devDependencies||{})['$PKG']||(p.dependencies||{})['$PKG']||''")
IN_DEPS=$(node -p "const p=require('./package.json');(p.dependencies||{})['$PKG']?'1':''")
log "target $TARGET_REPO@$TARGET_BRANCH has '$CURRENT', delivering $VERSION"

# 4. Bump лише цього пакета (pnpm add не перерозв'язує решту дерева, на відміну від pnpm update).
if [ -n "$IN_DEPS" ]; then
  $PNPM add "$PKG@$VERSION"
else
  $PNPM add -D "$PKG@$VERSION"
fi

if git diff --quiet -- package.json pnpm-lock.yaml; then
  log "lockfile already at $VERSION, nothing to commit"
  exit 0
fi

# Самоперевірка: рівно те, що зробить CI цільового репо.
$PNPM install --frozen-lockfile
git --no-pager diff --stat -- package.json pnpm-lock.yaml

git -c user.name=drone-bot -c user.email=drone-bot@users.noreply.github.com \
  commit --quiet -am "chore: blueprint-styles → $VERSION"

if [ "$DRY_RUN" = "1" ]; then
  log "DRY_RUN: commit $(git rev-parse --short HEAD) created in $WORKDIR/repo, not pushed"
  exit 0
fi

# 5. Push з одним повтором на non-fast-forward.
if ! git push --quiet origin "HEAD:$TARGET_BRANCH"; then
  log "push rejected, retrying after rebase"
  git pull --quiet --rebase origin "$TARGET_BRANCH"
  git push --quiet origin "HEAD:$TARGET_BRANCH"
fi
log "pushed $(git rev-parse --short HEAD) to $TARGET_REPO $TARGET_BRANCH"
