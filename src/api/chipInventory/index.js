import request from '@/router/axios';

export default class ChipInventoryApi {
    static selectChipInventoryPage(params) {
        return request({
            url: `/api/oa-portal/chipInventory/selectChipInventoryPage`,
            method: 'get',
            params
        })
    }
    static exportChipInventory(){
        return request({
            url: `/api/oa-portal/chipInventory/exportChipInventory`,
            method: 'get',
            responseType: 'blob'
        })
    }

    static importChipInventory(){
        return request({
            url: `/api/oa-portal/chipInventory/importChipInventory`,
            method: 'get',
            responseType: 'blob'
        })
    }

}
