import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/servicesubpackage/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getPage = (current, size, params) => {
  return request({
    url: '/api/oa-portal/servicesubpackage/page',
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
    url: '/api/oa-portal/servicesubpackage/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/servicesubpackage/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/servicesubpackage/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/servicesubpackage/submit',
    method: 'post',
    data: row
  })
}

export const exportExcel = (ids) => {
  const formData = new FormData();
  formData.append('ids', ids);
  return request({
    url: '/api/oa-portal/servicesubpackage/export',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}

/**
 * 删除oss文件，备用。目前不做删除
 * @param fileName
 * @returns {AxiosPromise}
 */
export const deleteOssFile = (fileName) => {
  const formData = new FormData();
  formData.append('fileName', fileName);
  return request({
    url: '/api/oa-resource/oss/endpoint/remove-file',
    method: 'post',
    data: formData,
  })
}
