import request from '@/router/axios';

export const  tspOnlineDetail = (businessId) =>{
    return request({
        url: `/api/oa-flow/tspLaunch/detail?businessId=${businessId}`,
        method: 'get',
    })
}

export const tspInterfaceDetail = (businessId)=>{
    return request({
        url: `/api/oa-flow/tspUpdate/detail?businessId=${businessId}`,
        method: 'get',
    })
}

export const onlineDetail = (businessId)=>{
    return request({
        url: `/api/oa-flow/appLaunch/detail?businessId=${businessId}`,
        method: 'get',
    })
}

export const appOnline25Detail = (businessId)=>{
  return request({
    url: `/api/oa-flow/appLaunchApply25/detail?businessId=${businessId}`,
    method: 'get',
  })
}
