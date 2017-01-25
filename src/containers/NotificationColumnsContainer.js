// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationColumns from '../components/columns/NotificationColumns';

import {
  makeGroupedUnarchivedNotificationsSelector,
} from '../selectors/notifications';

import * as actionCreators from '../actions';
import type { ActionCreators, State } from '../utils/types';

const makeMapStateToProps = () => {
  // passing 0, we memoize it forever: it will always return the same value
  const groupedUnarchivedNotificationsSelector = makeGroupedUnarchivedNotificationsSelector(0);
  const denormalizedGNSelectorParams = { includeAllGroup: true };

  return (state: State) => ({
    columns: groupedUnarchivedNotificationsSelector(state, denormalizedGNSelectorParams),
  });
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Object,
  };

  render() {
    const { actions, columns, ...props } = this.props;

    return (
      <NotificationColumns
        key="notification-columns"
        actions={actions}
        columns={columns}
        {...props}
      />
    );
  }
}