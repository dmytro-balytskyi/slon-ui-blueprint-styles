// Псевдоніми кнопок (ТЗ blueprint 3.9): блупринт задає дефолти під іменами VBtnIcon, SBtn і FBtn, а тут — що всі три
// є VBtn. Кнопку передає споживач: пакет не імпортує Vuetify, щоб не мати залежності (пастка peer у 0.0.46, ТЗ 3.8).
// Щоразу новий об'єкт — спільного стану між викликами немає.
export function createAliases(VBtn) {
  return { VBtnIcon: VBtn, SBtn: VBtn, FBtn: VBtn }
}
