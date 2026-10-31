// Типи пакета (ТЗ blueprint 3.7): споживачам на TS більше не потрібен шим `declare module … any`.
import type { Blueprint, ThemeDefinition } from 'vuetify'

export const blueprint: Blueprint
export const themes: { light: ThemeDefinition; dark: ThemeDefinition }
