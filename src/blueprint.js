const blueprint = {
  defaults: {
    global: {
      rounded: 'md'
    },

    VBtnIcon: {
      icon: 'icon',
      rounded: 0,
      VIcon: {
        size: 32
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
        size: 32
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
        size: 32
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
        size: 32
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
        size: 32
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
        size: 32
      }
    },

    VRating: {
      activeColor: 'secondary',
      color: 'grey-darken-1',
      density: 'comfortable',
      clearable: true,
      hover: true,
      VIcon: {
        class: ''
      }
    },

    VChip: {
      class: 'text-lowercase',
      closeIcon: 'mdi-close',
      label: true
    },

    VTab: {
      VIcon: {
        size: 32
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

    VToolbar: {
      VBtn: {
        color: null
      }
    },

    VBottomNavigation: {
      height: 60,
      VIcon: {
        size: 32
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
      VIcon: { size: 32 } // основний розмір іконок у VList
    },

    VListGroup: {
      VIcon: { size: 24 } // іконки у VListGroup
    },

    VTextField: {
      VIcon: {
        size: 24
      },
      VLabel: {
        class: 'text-uppercase'
      },
      variant: 'underlined',
      clearIcon: 'mdi-close',
      active: true
    },

    VTextarea: {
      VIcon: {
        size: 24
      },
      VLabel: {
        class: 'text-uppercase'
      },
      variant: 'underlined',
      clearIcon: 'mdi-close',
      active: true
    },

    VNumberInput: {
      VBtn: {
        width: 16,
        VIcon: {
          size: 12
        }
      }
    },

    VFileInput: {
      VLabel: {
        class: 'text-uppercase'
      },
      VIcon: {
        size: 24
      },
      variant: 'underlined',
      active: true
    },

    VSelect: {
      VTextField: {
        VLabel: {
          class: 'text-uppercase'
        },
        VIcon: {
          size: 24 // Розмір іконок для VSelect
        }
      },
      variant: 'underlined',
      clearIcon: 'mdi-close',
      active: true,
      VMenu: {
        VList: {
          VIcon: { size: 24 } // скидання розміру іконок у VMenu > VList
        }
      }
    },

    VCombobox: {
      VLabel: {
        class: 'text-uppercase'
      },
      VIcon: {
        size: 24 // розмір іконок для VCombobox
      },
      variant: 'underlined',
      clearIcon: 'mdi-close',
      active: true,
      VMenu: {
        VList: {
          VIcon: { size: 24 } // скидання розміру іконок у VMenu > VList
        }
      }
    },

    VAutocomplete: {
      VLabel: {
        class: 'text-uppercase'
      },
      VIcon: {
        size: 24
      },
      variant: 'underlined',
      clearIcon: 'mdi-close',
      active: true,
      VMenu: {
        VList: {
          VIcon: { size: 24 } // скидання розміру іконок у VMenu > VList
        }
      }
    },

    VSwitch: {
      color: 'success',
      density: 'comfortable',
      hideDetails: true
    },

    VCheckbox: {
      color: 'success',
      density: 'comfortable',
      hideDetails: true,
      VIcon: {
        size: 24
      }
    },

    VRadio: {
      color: 'success',
      density: 'comfortable',
      hideDetails: true,
      VIcon: {
        size: 24
      }
    },

    VRadioGroup: {
      color: 'success',
      density: 'comfortable',
      hideDetails: true
    },

    VTimeline: {
      density: 'compact',
      align: 'start',
      side: 'end',
      truncateLine: 'both'
    },

    VAppBar: {
      height: 72
    },

    VMain: {
      style: '--v-layout-bottom: 0px !important;'
    }
  }
}

export default blueprint
