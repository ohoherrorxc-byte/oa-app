import {getStore, setStore} from '@/util/store'

import {getDictionary} from '@/api/system/dict'

const dict = {
  state: {
    flowRoutes: getStore({name: 'flowRoutes'}) || {},
  },
  actions: {
    FlowRoutes({commit}) {
      return new Promise((resolve, reject) => {
        getDictionary({code: 'flow'}).then(res => {
          commit('SET_FLOW_ROUTES', res.data.data);
          resolve();
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  mutations: {
    SET_FLOW_ROUTES: (state, data) => {
      // 防御性：后端有时返回 { data: null } 或 res.data.data 为 undefined
      if (!Array.isArray(data)) {
        state.flowRoutes = {}
        setStore({name: 'flowRoutes', content: state.flowRoutes})
        return
      }
      state.flowRoutes = data.map(item => {
        return {
          routeKey: `${item.code}_${item.dictKey}`,
          routeValue: item.remark,
        };
      });
      setStore({name: 'flowRoutes', content: state.flowRoutes})
    },
  }

};

export default dict;
