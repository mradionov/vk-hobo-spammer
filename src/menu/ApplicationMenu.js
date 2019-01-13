const EventEmitter = require('events');

const { dialog, Menu, shell } = require('electron');

const { DEFAULT_LOCALE, LOCALES } = require('../constants/locale');
const { SUPPORT_URLS } = require('../config/support');

const messagesEN = require('./messages/en.json');
const messagesRU = require('./messages/ru.json');

const messages = {
  [LOCALES.en]: messagesEN,
  [LOCALES.ru]: messagesRU,
};

class ApplicationMenu extends EventEmitter {

  constructor(defaultLocale = DEFAULT_LOCALE, onDataReset = () => {}) {
    super();

    this.onDataReset = onDataReset;

    this.setLocale(defaultLocale);
  }

  setLocale(locale) {
    if (locale === this.locale) {
      return;
    }

    this.locale = locale;

    const template = this.getTemplate();
    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);

    this.emit('change', locale);
  }

  getTemplate() {
    const template = [
      {
        label: this.translate('file'),
        submenu: [
          {
            label: this.translate('file.quit'),
            role: 'quit',
          },
        ],
      },
      {
        label: this.translate('preferences'),
        submenu: [
          {
            label: this.translate('preferences.language'),
            submenu: [
              {
                label: this.translate('preferences.language.ru'),
                type: 'radio',
                checked: this.isLocale(LOCALES.ru),
                click: () => {
                  this.setLocale(LOCALES.ru);
                },
              },
              {
                label: this.translate('preferences.language.en'),
                type: 'radio',
                checked: this.isLocale(LOCALES.en),
                click: () => {
                  this.setLocale(LOCALES.en);
                },
              }
            ],
          },
          {
            type: 'separator',
          },
          {
            label: this.translate('preferences.devtools'),
            role: 'toggleDevTools',
          },
          {
            type: 'separator',
          },
          {
            label: this.translate('preferences.reset'),
            click: () => {
              dialog.showMessageBox({
                type: 'warning',
                buttons: [
                  this.translate('preferences.reset.cancel'),
                  this.translate('preferences.reset.confirm'),
                ],
                defaultId: 0,
                cancelId: 0,
                title: this.translate('preferences.reset.title'),
                message: this.translate('preferences.reset.message'),
                checkboxLabel: this.translate('preferences.reset.label'),
              }, (response, isChecked) => {
                // Cancelled
                if (response === 0) {
                  return;
                }
                // Not confirmed
                if (!isChecked) {
                  return;
                }

                this.onDataReset();
              });
            },
          },
        ],
      },
      {
        role: 'help',
        label: this.translate('help'),
        submenu: [
          {
            label: this.translate('help.support'),
            click: () => {
              this.openURL(SUPPORT_URLS.BUGS);
            },
          },
          {
            label: this.translate('help.about'),
            click: () => {
              this.openURL(SUPPORT_URLS.ABOUT);
            },
          },
        ],
      },
    ];

    return template;
  }

  translate(id, defaultMessage = '???') {
    const dictionary = messages[this.locale];
    if (!dictionary) {
      return defaultMessage;
    }

    const message = dictionary[id];
    if (!message) {
      return defaultMessage;
    }

    return message;
  }

  isLocale(locale) {
    return this.locale === locale;
  }

  openURL(url) {
    shell.openExternal(url);
  }

}


module.exports = ApplicationMenu;
