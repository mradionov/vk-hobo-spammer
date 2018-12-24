function setupPersist(store, ipc) {
  store.subscribe((mutation) => {
    console.log('persist', mutation);
    if (mutation.type === 'reset') {
      return;
    }
    ipc.send('app:renderer/state/update', store.state);
  });

  ipc.on('app:main/state/update', (ev, state) => {
    store.commit('reset', state);
  });
}

export default setupPersist;
