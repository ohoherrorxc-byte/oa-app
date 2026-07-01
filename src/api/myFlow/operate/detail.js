import request from '@/router/axios';

export const  budgetApprovalDetail = (businessId) =>{
    return request({
        url: `/api/oa-flow/project/budget/detail?businessId=${businessId}`,
        method: 'get',
    })
}

export const firewallDetail = (businessId)=>{
    return request({
        url: `/api/oa-flow/operation/fireWall/detail?businessId=${businessId}`,
        method: 'get',
    })
}

export const customDetail = (businessId)=>{
    return request({
        url: `/api/oa-flow/custom/approval/detail?businessId=${businessId}`,
        method: 'get',
    })
}

