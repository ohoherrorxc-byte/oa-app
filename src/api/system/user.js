import request from '@/router/axios';

export const getList = (current, size, params, deptId) => {
  return request({
    url: '/api/oa-user/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      deptId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-user/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-user/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-user/update',
    method: 'post',
    data: row
  })
}

export const updatePlatform = (userId, userType, userExt) => {
  return request({
    url: '/api/oa-user/update-platform',
    method: 'post',
    params: {
      userId,
      userType,
      userExt,
    }
  })
}

export const getUser = (id) => {
  return request({
    url: '/api/oa-user/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getUserPlatform = (id) => {
  return request({
    url: '/api/oa-user/platform-detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getUserInfo = () => {
  return request({
    url: '/api/oa-user/info',
    method: 'get',
  })
}

export const resetPassword = (userIds) => {
  return request({
    url: '/api/oa-user/reset-password',
    method: 'post',
    params: {
      userIds,
    }
  })
}

export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: '/api/oa-user/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  })
}

export const updateFleetPassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  })
}

export const updateInfo = (row) => {
  return request({
    url: '/api/oa-user/update-info',
    method: 'post',
    data: row
  })
}

export const grant = (userIds, roleIds) => {
  return request({
    url: '/api/oa-user/grant',
    method: 'post',
    params: {
      userIds,
      roleIds,
    }
  })
}

export const updateSecondPassword = (data) => {
  return request({
    url: '/api/oa-user/v2.0/updateSecondPassword',
    method: 'post',
    data: data
  })
}

export const getSecondPasswordStatus = (userId) => {
  return request({
    url: `/api/oa-user/v2.0/getSecondPasswordStatus?userId=${userId}`,
    method: 'get',
  })
}

export const checkSecondPassword = (passWord) => {
  return request({
    url: `/api/oa-user/v2.0/checkSecondPassword?passWord=${passWord}`,
    method: 'get',
  })
}

export const removeSecondPassword = (userIds)=>{
  return request({
    url: `/api/oa-user/v2.0/removeSecondPassword?userIds=${userIds}`,
    method: 'get',
  })
}
