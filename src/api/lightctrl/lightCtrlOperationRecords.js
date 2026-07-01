import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/detail',
    method: 'get',
    params: {
      id
    }
  })
}

// 开灯
export function toTurnOn(selectedArea, uuids) {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/to-turn-on',
    method: 'post',
    data: {
      selectedArea: selectedArea,
      uuids: uuids, // 传递数组
    }
  });
}

// 关灯
export function toTurnOff(selectedArea, uuids) {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/to-turn-off',
    method: 'post',
    data: {
      selectedArea: selectedArea,
      uuids: uuids, // 传递数组
    }
  });
}

// New API: Fetch device names (replacing /light-ctrl.json)
export const getDeviceNames = () => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/deviceNames',
    method: 'get',
  });
};

// New API: Fetch device list with relay states
export const getDevices = () => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/devices',
    method: 'get',
  });
};

// New API: Toggle individual relay
export const setRelay = (uuid, relayIndex, state, selectedArea) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/OperationRecords/setRelay',
    method: 'post',
    data: {
      uuid,
      relayIndex,
      state, // '0' or '1'
      selectedArea: selectedArea,
    },
  })
};

