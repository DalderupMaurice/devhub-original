// @flow

import { Map } from 'immutable';

import {
  LOAD_NOTIFICATIONS_REQUEST,
  LOAD_NOTIFICATIONS_FAILURE,
  LOAD_NOTIFICATIONS_SUCCESS,
  MARK_NOTIFICATIONS_AS_READ_REQUEST,
  MARK_NOTIFICATIONS_AS_READ_FAILURE,
  MARK_NOTIFICATIONS_AS_READ_SUCCESS,
} from '../../utils/constants/actions';

import type {
  Action,
  ApiResponsePayload,
} from '../../utils/types';

type State = {
  updatedAt: Date,
  lastModifiedAt?: string,
  pollInterval?: number,
  rateLimit?: number,
  rateLimitRemaining?: number,
  rateLimitReset?: number,
  loading: boolean,
  error?: string,
};

const initialState: State = Map({
  lastModifiedAt: undefined,
});

export default (state: State = initialState, { type, payload, error }: Action<any>): State => {
  switch (type) {
    case LOAD_NOTIFICATIONS_REQUEST:
    case MARK_NOTIFICATIONS_AS_READ_REQUEST:
      return state.set('loading', true);

    case LOAD_NOTIFICATIONS_FAILURE:
    case MARK_NOTIFICATIONS_AS_READ_FAILURE:
      return state.mergeDeep({
        loading: false,
        error,
      });

    case LOAD_NOTIFICATIONS_SUCCESS:
    case MARK_NOTIFICATIONS_AS_READ_SUCCESS:
      return (({ meta }: ApiResponsePayload) => (
        state.mergeDeep({
          updatedAt: new Date(),
          ...(meta && meta['last-modified'] ? {
            lastModifiedAt: meta['last-modified'],
            pollInterval: Number(meta['x-poll-interval']),
            rateLimit: Number(meta['x-ratelimit-limit']),
            rateLimitRemaining: Number(meta['x-ratelimit-remaining']),
            rateLimitReset: meta['x-ratelimit-reset'],
          } : {}),
          loading: false,
          error: null,
        })
      ))(payload || {});

    default:
      return state;
  }
};