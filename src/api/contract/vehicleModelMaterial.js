import request from '@/router/axios';

export const getList = (current, size, params) => {
    let data = { current:current, size:size, ...params }
    return request({
        url: '/api/oa-portal/vehicleModelManage/vehicleModelWithMaterial',
        method: 'post',
        data
    })
}

//车型物料号新增或者更新
export const saveOrUpdateVehicleModelMaterial = (params) => {
    return request({
        url: '/api/oa-portal/vehicleModelManage/saveOrUpdateVehicleModelWithMaterial',
        method: 'post',
        data: {
            ...params,
        }
    })
}



export const exportList = () => {
    return request({
        url: '/api/oa-portal/vehicleModelManage/export',
        method: 'get',
        responseType: 'blob'
    })
}



export const getSeriesName = (params) => {

    return request({
        url: '/api/oa-portal/contractLicenseSeries/getSeriesName',
        method: 'post',
        params: {
            ...params,
        }
    })
}

export const vehicleModelWithMaterialDetail = (params) => {
    return request({
        url: '/api/oa-portal/vehicleModelManage/vehicleModelWithMaterialDetail',
        method: 'get',
        params: {
            ...params,
        }
    })
}
