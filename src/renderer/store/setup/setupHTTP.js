import { merge } from 'lodash';

function setupHTTP(store, http) {
  http.addOptionsInterceptor((options) => {
    const { accessToken } = store.getters;

    if (accessToken === null) {
      return options;
    }

    return merge(options, {
      params: {
        access_token: accessToken,
      },
    });
  });
}

export default setupHTTP;
