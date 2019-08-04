'use strict';

const chalk = require('chalk');
const config = require('./config');
const graphql = require('@octokit/graphql');

/**
 * @param {Mozaik} mozaik
 */
const client = mozaik => {
  mozaik.loadApiConfig(config);

  const buildGraphQLApiRequest = (query, variables) => {
    const baseUrl = config.get('github.baseUrl');
    const token = config.get('github.token');
    const debug = config.get('github.debug');

    const queryWithHeaders = {
      query,
      baseUrl,
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const request = Object.assign(variables, queryWithHeaders);
    mozaik.logger.info(
      chalk.yellow(`[githubcontributions] calling ${baseUrl}`)
    );

    if (debug) {
      mozaik.logger.info(
        chalk.yellow(
          `[githubcontributions-debug] request data - ${JSON.stringify(
            request,
            null,
            2
          )}`
        )
      );
    }
    return graphql(request);
  };

  const userContributions = ({ username }) => {
    return buildGraphQLApiRequest(
      `query userContributions($username: String!) {
      user(login: $username) {
        name
        contributionsCollection {
          totalCommitContributions
          contributionCalendar {
            totalContributions
          }
        }
      }
    }`,
      { username }
    );
  };

  const apiCalls = {
    userContributions,
    usersContributions({ usernames }) {
      let promises = [];

      usernames.forEach(username => {
        promises.push(userContributions({ username }));
      });

      return Promise.all(promises);
    }
  };

  return apiCalls;
};

module.exports = client;
