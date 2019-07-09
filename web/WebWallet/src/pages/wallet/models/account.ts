import { Blockchain } from '@harmony-js/core';
import { getAddress } from '@harmony-js/crypto';
import { hexToNumber, Unit } from '@harmony-js/utils';
import { createAction } from '@/utils';
import create from 'antd/lib/icon/IconFont';

export default {
  namespace: 'account',
  state: {
    balance: '0',
    nonce: 0,
    gasPrice: '0',
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getBalance({ payload }: any, { call, put, select }: any) {
      const messenger = yield select(
        (state: { network: { messenger: any } }) => state.network.messenger,
      );
      const blockchain = new Blockchain(messenger);

      const balance = yield blockchain.getBalance({
        address: payload.address,
        blockNumber: 'latest',
      });

      const nonce = yield blockchain.getTransactionCount({
        address: payload.address,
        blockNumber: 'latest',
      });

      yield put(
        createAction('updateState')({
          balance: hexToNumber(balance.result),
          nonce: Number.parseInt(hexToNumber(nonce.result), 10),
        }),
      );
    },
    *getGasPrice({ _ }: any, { call, put, select }: any) {
      const messenger = yield select(
        (state: { network: { messenger: any } }) => state.network.messenger,
      );
      const blockchain = new Blockchain(messenger);

      const gasPrice = yield blockchain.gasPrice();
      yield put(createAction('updateState')({ gasPrice: hexToNumber(gasPrice.result) }));
    },
  },
  subscriptions: {
    // setup({ dispatch, history }: any) {
    //   if (
    //     history.location.pathname.startsWith('/wallet/') &&
    //     history.location.pathname.length > 8
    //   ) {
    //     dispatch({
    //       type: 'getBalance',
    //       payload: {
    //         address: getAddress(history.location.pathname.replace('/wallet/', '')).checksum,
    //       },
    //     });
    //   }
    // },
  },
};
