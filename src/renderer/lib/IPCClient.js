import { ipcRenderer } from 'electron';

class IPCClient {
  send(...args) {
    ipcRenderer.send(...args);
  }

  on(...args) {
    ipcRenderer.on(...args);
  }

  once(...args) {
    ipcRenderer.once(...args);
  }

  off(...args) {
    ipcRenderer.off(...args);
  }
}

export default IPCClient;
