// Типи пакета (ТЗ blueprint 3.7): споживачам на TS більше не потрібен шим `declare module … any`.
import type { Blueprint, ThemeDefinition } from 'vuetify'

export const blueprint: Blueprint
export const themes: { light: ThemeDefinition; dark: ThemeDefinition }

// Псевдоніми кнопок (ТЗ blueprint 3.9): createVuetify({ blueprint, aliases: createAliases(VBtn) }).
export function createAliases<T>(btn: T): { VBtnIcon: T; SBtn: T; FBtn: T }
