// Розміри іконок: великі — кнопки, вкладки, навігація, списки; середні — поля, перемикачі, групи списків.
const ICON_L = 32
const ICON_M = 24

// Поля вводу. У VFileInput немає пропси clearIcon, тому два рівні: clearIcon: undefined лишив би ключ в об'єкті.
const fieldBase = {
  VLabel: {
    class: 'text-uppercase'
  },
  VIcon: {
    size: ICON_M
  },
  variant: 'underlined',
  active: true
}

const fieldDefaults = { ...fieldBase, clearIcon: 'mdi-close' }

// Список у меню полів вибору — іконки середні, а не ICON_L, як у VList.
const menuListIcon = {
  VList: {
    VIcon: { size: ICON_M }
  }
}

// Перемикачі. У VRadio немає пропси hideDetails, тому теж два рівні.
const selectionBase = {
  color: 'success',
  density: 'comfortable'
}

const selectionDefaults = { ...selectionBase, hideDetails: true }

const blueprint = {
  defaults: {
    global: {
      rounded: 'md'
    },

    VBtnIcon: {
      icon: true,
      rounded: 0,
      VIcon: {
        size: ICON_L
      }
    },

    VBtn: {
      rounded: 0
    },

    SBtn: {
      class: 's-btn',
      variant: 'text',
      rounded: 0,
      height: 48,
      VIcon: {
        size: ICON_L
      },
      style: {
        fontSize: '16px'
      }
    },

    FBtn: {
      class: 'f-btn',
      variant: 'tonal',
      rounded: 0,
      height: 48,
      VIcon: {
        size: ICON_L
      },
      style: {
        fontSize: '16px'
      }
    },

    VBtnToggle: {
      rounded: 0,
      color: 'success',
      variant: 'text',
      VIcon: {
        size: ICON_L
      }
    },

    VBtnGroup: {
      rounded: 0
    },

    VFab: {
      color: 'primary',
      size: 'large',
      appear: true,
      VIcon: {
        size: ICON_L
      }
    },

    VSpeedDial: {
      transition: 'slide-y-reverse-transition',
      scrollStrategy: 'close',
      VBtn: {
        width: 56,
        height: 56,
        rounded: 'circle'
      },
      VIcon: {
        size: ICON_L
      }
    },

    VRating: {
      activeColor: 'secondary',
      color: 'grey-darken-1',
      density: 'comfortable',
      clearable: true,
      hover: true
    },

    VChip: {
      class: 'text-lowercase',
      closeIcon: 'mdi-close',
      label: true
    },

    VTab: {
      VIcon: {
        size: ICON_L
      },
      variant: 'text'
    },

    VTabs: {
      color: 'primary',
      sliderColor: 'primary',
      mobileBreakpoint: 'md'
    },

    VAvatar: {
      rounded: 'circle'
    },

    VBanner: {
      color: 'primary'
    },

    VCard: {
      rounded: 0
    },

    VCardTitle: {
      style: 'user-select: none;'
    },

    VBottomNavigation: {
      height: 60,
      VIcon: {
        size: ICON_L
      },
      grow: true
    },

    VSlider: {
      color: 'primary'
    },

    VTooltip: {
      openDelay: 3000,
      location: 'top'
    },

    VSnackbar: {
      rounded: 0,
      timeout: 4000
    },

    VList: {
      class: 'pa-0',
      style: 'user-select: none;',
      slim: true,
      rounded: 0,
      activatable: true,
      VIcon: { size: ICON_L }
    },

    VListGroup: {
      VIcon: { size: ICON_M }
    },

    VTextField: { ...fieldDefaults },

    VTextarea: { ...fieldDefaults },

    VNumberInput: {
      ...fieldDefaults,
      VBtn: {
        width: 16,
        VIcon: {
          size: 12
        }
      }
    },

    VFileInput: { ...fieldBase },

    // Не fieldDefaults: підпис та іконка поля задані під VTextField (ТЗ blueprint 3.5 — структуру не міняти).
    VSelect: {
      VTextField: {
        VLabel: {
          class: 'text-uppercase'
        },
        VIcon: {
          size: ICON_M
        }
      },
      variant: 'underlined',
      clearIcon: 'mdi-close',
      active: true,
      VMenu: menuListIcon
    },

    VCombobox: {
      ...fieldDefaults,
      VMenu: menuListIcon
    },

    VAutocomplete: {
      ...fieldDefaults,
      VMenu: menuListIcon
    },

    VSwitch: { ...selectionDefaults },

    VCheckbox: {
      ...selectionDefaults,
      VIcon: {
        size: ICON_M
      }
    },

    VRadio: {
      ...selectionBase,
      VIcon: {
        size: ICON_M
      }
    },

    VRadioGroup: { ...selectionDefaults },

    VTimeline: {
      density: 'compact',
      side: 'end',
      truncateLine: 'both',
      hideOpposite: true
    },

    VAppBar: {
      height: 72
    },

    // Свідомо (рішення 2026-10-31, ТЗ blueprint 3.4): v-main не резервує місце під v-bottom-navigation —
    // застосунок компенсує нижнє меню сам (menu24 UsersView, shared SSnackbarQueue --v-layout-bottom: 60px,
    // мобільні висоти calc(100dvh − N)). Зняти правило = зсунути 8 сторінок у 4 репо (ТЗ §1.1 B6).
    VMain: {
      style: '--v-layout-bottom: 0px !important;'
    }
  }
}

export default blueprint
