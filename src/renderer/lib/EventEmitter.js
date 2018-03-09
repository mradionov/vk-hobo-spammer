(() => {
  const EventEmitter = require('events');

  window.vhs = window.vhs || {};
  window.vhs.lib = window.vhs.lib || {};
  window.vhs.lib.EventEmitter = EventEmitter;
})();
