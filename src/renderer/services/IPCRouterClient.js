import { ipcRenderer } from 'electron';

const NAMESPACE = 'ipc-router';
const STAGE_NOTIFY = 'notify';
const STAGE_REQUEST = 'request';
const STAGE_SUCCESS = 'success';
const STAGE_FAILURE = 'failure';

class IPCRouterClient {

  async send(path, requestData) {
    return new Promise((resolve, reject) => {
      const requestEventName = this.createEventName(path, STAGE_REQUEST);
      const successEventName = this.createEventName(path, STAGE_SUCCESS);
      const failureEventName = this.createEventName(path, STAGE_FAILURE);

      const handlers = {
        success: (ev, responseData) => {
          ipcRenderer.off(failureEventName, handlers.failure);
          resolve(responseData);
        },
        failure: (ev, responseData) => {
          ipcRenderer.off(successEventName, handlers.success);
          reject(responseData);
        },
      };

      ipcRenderer.once(successEventName, handlers.success);
      ipcRenderer.once(failureEventName, handlers.failure);
      ipcRenderer.send(requestEventName, requestData);
    });
  }

  createEventName(path, stage) {
    return `${NAMESPACE}:${path}/${stage}`;
  }

  onSuccess(path, listener) {
    const successEventName = this.createEventName(path, STAGE_SUCCESS);
    ipcRenderer.on(successEventName, (ev, data) => {
      listener(data);
    });
  }

  listen(path, listener) {
    const notifyEventName = this.createEventName(path, STAGE_NOTIFY);
    ipcRenderer.on(notifyEventName, listener);
  }

  unlisten(path, listener) {
    const notifyEventName = this.createEventName(path, STAGE_NOTIFY);
    ipcRenderer.off(notifyEventName, listener);
  }

}

export default IPCRouterClient;
