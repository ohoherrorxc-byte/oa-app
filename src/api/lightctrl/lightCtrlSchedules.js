import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/Schedules/list',
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
    url: '/api/oa-portal/soimt-lightctrl/Schedules/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/Schedules/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  // if (row.id === "") {
  //   row.id = null;
  // }
  return request({
    url: '/api/oa-portal/soimt-lightctrl/Schedules/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/Schedules/submit',
    method: 'post',
    data: row
  })
}

// api/lightctrlschedules/lightCtrlSchedules.js
export function updateBatch(rows) {
  return request({
    url: '/api/oa-portal/soimt-lightctrl/Schedules/batchUpdate',
    method: 'post',
    data: rows,
  });
}



