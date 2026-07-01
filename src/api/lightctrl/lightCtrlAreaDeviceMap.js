import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getAreaDevicesList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/list',
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
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/submit',
    method: 'post',
    data: row
  })
}

export const listAreaGroups = () => {
  return request({
    url: '/api/oa-portal/soimt-lightctrlareadevicemap/lightCtrlAreaDeviceMap/area-groups',
    method: 'get'
  });
}



