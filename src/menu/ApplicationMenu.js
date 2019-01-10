const EventEmitter = require('events');

const { Menu } = require('electron');

const messagesEN = require('./messages/en.json');
const messagesRU = require('./messages/ru.json');

const LOCALE_EN = 'en';
const LOCALE_RU = 'ru';

const messages = {
  [LOCALE_EN]: messagesEN,
  [LOCALE_RU]: messagesRU,
};

class ApplicationMenu extends EventEmitter {

  constructor(defaultLocale = LOCALE_EN) {
    super();

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
            label: this.translate('file.language'),
            submenu: [
              {
                label: this.translate('file.language.ru'),
                type: 'radio',
                checked: this.isLocale(LOCALE_RU),
                click: () => {
                  this.setLocale(LOCALE_RU);
                },
              },
              {
                label: this.translate('file.language.en'),
                type: 'radio',
                checked: this.isLocale(LOCALE_EN),
                click: () => {
                  this.setLocale(LOCALE_EN);
                },
              }
            ],
          },
          {
            type: 'separator',
          },
          {
            label: this.translate('devtools'),
            role: 'toggleDevTools',
          },
          {
            type: 'separator',
          },
          {
            label: this.translate('quit'),
            role: 'quit',
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

}


module.exports = ApplicationMenu;
