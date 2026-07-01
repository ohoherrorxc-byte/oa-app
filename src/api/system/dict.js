import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-system/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getParentList = (current, size, params) => {
  return request({
    url: '/api/oa-system/dict/parent-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getChildList = (current, size, parentId, params) => {
  return request({
    url: '/api/oa-system/dict/child-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      parentId: parentId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-system/dict/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-system/dict/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-system/dict/submit',
    method: 'post',
    data: row
  })
}


export const getDict = (id) => {
  return request({
    url: '/api/oa-system/dict/detail',
    method: 'get',
    params: {
      id,
    }
  })
}
export const getDictTree = () => {
  return request({
    url: '/api/oa-system/dict/tree?code=DICT',
    method: 'get'
  })
}

export const getDictionary = (params) => {
  return request({
    url: '/api/oa-system/dict/dictionary',
    method: 'get',
    params,
  })
}
