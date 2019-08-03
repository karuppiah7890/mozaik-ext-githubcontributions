import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shasum from 'shasum';

import {
  TrapApiError,
  Widget,
  WidgetHeader,
  WidgetBody,
  WidgetLoader,
  GithubIcon
} from '@mozaik/ui';
import WidgetBigCounter from './WidgetBigCounter';

export default class UsersContributions extends Component {
  static propTypes = {
    usernames: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string,
    apiData: PropTypes.shape({}),
    apiError: PropTypes.object
  };

  static getApiRequest({ usernames }) {
    return {
      id: `githubcontributions.usersContributions.${shasum({ usernames })}`,
      params: { usernames }
    };
  }

  render() {
    const { title, apiData, apiError } = this.props;

    let body = <WidgetLoader />;
    if (apiData && !apiError) {
      let totalCommitContributions = apiData.reduce((prevValue, current) => {
        return (
          prevValue +
          current.user.contributionsCollection.totalCommitContributions
        );
      }, 0);

      body = (
        <WidgetBigCounter
          align="center"
          postLabel="Commits"
          count={totalCommitContributions}
        />
      );
    }

    return (
      <Widget>
        <WidgetHeader
          title={title || 'GitHub User Contributions'}
          icon={GithubIcon}
        />
        <WidgetBody>
          <TrapApiError error={apiError}>{body}</TrapApiError>
        </WidgetBody>
      </Widget>
    );
  }
}
