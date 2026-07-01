import request from '@/router/axios';

export default class CustomsDeclarationApi {
    static getCostList(){
        return request({
            url: '/api/oa-portal/customsDeclaration/list',
            method: 'get',
        })
    }
    static getList(params) {
        return request({
            url: '/api/oa-portal/customsDeclaration/page',
            method: 'get',
            params: {
              ...params,
            }
        })
    }
    static add(data) {
        return request({
            url: '/api/oa-portal/customsDeclaration/saveOrUpdate',
            method: 'post',
            data
        })
    }
    static detail(id) {
        return request({
            url: `/api/oa-portal/customsDeclaration/detail?id=${id}`,
            method: 'get',
        })
    }
    // static update(data) {
    //     return request({
    //         url: '/api/oa-portal/customsDeclaration/update',
    //         method: 'post',
    //         data
    //     })
    // }
    static listInvoice(){
        return request({
            url: `/api/oa-portal/invoice/listInvoice`,
            method: 'get',
        }) 
    }
    static deleteRow(id) {
        return request({
            url: `/api/oa-portal/customsDeclaration/delete?ids=${id}`,
            method: 'get',
        })
    }
    static createBomOrderByCustomsDeclaration(id) {
        return request({
            url: `/api/oa-portal/stockOut/createBomOrderByCustomsDeclaration?id=${id}`,
            method: 'get',
        })
    }
}
