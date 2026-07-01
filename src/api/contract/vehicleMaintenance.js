import request from '@/router/axios';

//补卡s

export default class VehicleMaintenanceApi {
    //列表
    static selectPage(data) {
        return request({
            url: `/api/oa-portal/vehicleMaterialBom/selectPage`,
            method: 'post',
            data
        })
    }

    //新增和更新
    static saveOrUpdate(data){
        return request({
            url: `/api/oa-portal/vehicleMaterialBom/saveOrUpdate`,
            method: 'post',
            data
        })
    }
    //详情
    static detail(id){
        return request({
            url: `/api/oa-portal/vehicleMaterialBom/detail?id=${id}`,
            method: 'get',
        })
    }
     //查询
     static materialList(id){
        return request({
            url: `/api/oa-portal/vehicleModelManage/materialList?id=${id}`,
            method: 'get',
        })
    }

}