import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/list',
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
    url: '/api/oa-portal/fleetuserblade/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/update',
    method: 'post',
    data: row
  })
}

export const getQR = (amount, channel, uid, needInvoice) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/pay',
    method: 'get',
    params: {
      amount,
      channel,
      uid,
      needInvoice,
    }
  })
}

export const resetPassword = (id, pwd) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/reset-password',
    method: 'post',
    params: {
      id,
      pwd
    }
  })
}

export const editLimit = (id, limit) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/edit-limit',
    method: 'post',
    params: {
      id,
      limit
    }
  })
}

