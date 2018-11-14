export default ({ $axios, app }) => {
  $axios.setHeader("Accept", "application/json");
  $axios.setHeader("Content-Type", "application/json", ["post"]);

  // Set the default URL for $axios to be the URL connecting to the venue-server installation,
  // which will eventually contain only the Bitcoin Talk campaign data.
  if (process.env.NUXT_ENV_BTT_URL) {
    $axios.defaults.baseURL = process.env.NUXT_ENV_BTT_URL;
  }

  // This should be handled by resetOnError in the config, but it's broke now
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 401) {
      // 401 Unauthorized
      $axios.setToken(false);
      app.$auth.reset();
    }
  });
};
