import { HarmonyExtension } from '@harmony-js/core';
import { readDefaultContract } from '../service/api';
import { createAction } from '../utils/index';

export default {
  namespace: 'global',
  state: {
    abi: undefined,
    bin: undefined,
    contractAddress: '0x',
    chainId: undefined,
    chainType: undefined,
    url: '',
    netWork: '',
    harmony: undefined,
    shardID: 0,
  },
  effects: {
    *intializeNetwork({ _ }, { call, put }) {
      const { abi, bin, address, network } = yield call(readDefaultContract);
      const { chainId, chainType, url } = network;
      const netWork = network.network;

      const harmony = new HarmonyExtension(window.harmony);

      harmony.setProvider(url);
      const struct = (yield harmony.blockchain.getShardingStructure()).result;
      // console.log({ struct });
      harmony.shardingStructures(struct);

      const currentShardID = harmony.messenger.getCurrentShardID();

      yield put(
        createAction('updateState')({
          abi,
          bin,
          contractAddress: address,
          chainId,
          chainType,
          url,
          netWork,
          harmony,
          shardID: currentShardID,
        }),
      );
      yield put(createAction('contract/getContractState')());
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {},
};
