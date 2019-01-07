const { ipcMain } = require('electron');

const NAMESPACE = 'ipc-router';
const STAGE_NOTIFY = 'notify';
const STAGE_REQUEST = 'request';
const STAGE_SUCCESS = 'success';
const STAGE_FAILURE = 'failure';

class IPCRouterServer {

  constructor() {
    this.window = null;
  }

  setWindow(window) {
    this.window = window;
  }

  route(path, handler) {
    const config = {
      path,
      handler,
    };

    const handleRequest = this.handleRequest.bind(this, config);

    const requestEventName = this.createEventName(path, STAGE_REQUEST);
    ipcMain.on(requestEventName, handleRequest);
  }

  notify(path) {
    const notifyEventName = this.createEventName(path, STAGE_NOTIFY);
    this.window.webContents.send(notifyEventName);
  }

  createEventName(path, stage) {
    return `${NAMESPACE}:${path}/${stage}`;
  }

  handleRequest(config, ev, data) {
    const req = {
      path: config.path,
      data,
    };

    const handleSend = this.handleSend.bind(this, config);
    const handleFail = this.handleFail.bind(this, config);

    const res = {
      send: handleSend,
      fail: handleFail,
    };

    config.handler(req, res);
  }

  handleSend(config, data) {
    const successEventName = this.createEventName(config.path, STAGE_SUCCESS);
    this.window.webContents.send(successEventName, data);
  }

  handleFail(config, data) {
    const failureEventName = this.createEventName(config.path, STAGE_FAILURE);

    let failData = data;
    if (failData instanceof Error) {
      failData = JSON.stringify(data, Object.getOwnPropertyNames(data));
    }

    this.window.webContents.send(failureEventName, failData);
  }

}

module.exports = IPCRouterServer;
