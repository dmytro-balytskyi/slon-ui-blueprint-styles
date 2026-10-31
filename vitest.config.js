import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    server: {
      deps: {
        // vuetify/components тягне .css: зовнішнім модулем Node падає на імпорті стилю,
        // інлайн — його обробляє Vite (ТЗ 2.1, тест блупринту проти встановленого Vuetify)
        inline: ['vuetify']
      }
    }
  }
})
