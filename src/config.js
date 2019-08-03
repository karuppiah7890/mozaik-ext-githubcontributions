const convict = require('convict');

const config = convict({
  github: {
    baseUrl: {
      doc: 'The GitHub GraphQL API v4 endpoint',
      default: 'https://api.github.com',
      format: String,
      env: 'GITHUB_BASE_URL'
    },
    token: {
      doc: 'The GitHub API token',
      default: null,
      format: String,
      env: 'GITHUB_API_TOKEN'
    },
    debug: {
      doc:
        'To enable debug mode. BEWARE! This will log sensitive data in the console like request data, bearer token',
      default: false,
      format: Boolean,
      env: 'DEBUG'
    }
  }
});

module.exports = config;
