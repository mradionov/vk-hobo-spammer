const rootGetters = {
  accessToken: state => state.session.accessToken,
  isAuthenticated: state => state.session.accessToken !== null,
};

export default rootGetters;
