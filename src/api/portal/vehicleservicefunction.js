import request from '@/router/axios';

//列表
export const functionList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/vehicle/service/application/functionList',
    method: 'get',
    params: {
      ...params,
      current,
      size

    }
  })
}

//新增
export const save = (row) => {
  return request({
    url: '/api/oa-portal/vehicle/service/application/save',
    method: 'post',
    data: row
  })
}

//更新
export const update = (row) => {
  return request({
    url: '/api/oa-portal/vehicle/service/application/update',
    method: 'post',
    data: row
  })
}

//逻辑删除应用
export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/vehicle/service/application/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
//逻辑删除功能
export const removeFunction = (ids) => {
  return request({
    url: '/api/oa-portal/vehicle/service/application/function/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

//附件上传
export const serviceFunupload = (fileName, file) => {
  const directory ='bladex/vehicle/service/'
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', directory+fileName);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/oa-resource/oss/endpoint/put-file-attach-by-name',
    method: 'post',
    data: formData
  })
}

//导出服务功能
export const exportExcel =((funcCodeNum) =>{
  return request({
    url: '/api/oa-portal/vehicle/service/application/export-applicationInfo',
    method: 'get' ,
    params: {
      funcCodeNum,
    },
    responseType: 'blob'
  })
})

