import request from '@/router/axios';

export default class AddressApi{
    static addressTree(){
        return request({
            url: `/api/oa-system/dept/v2.0/deptTree?parentId=0`,
            method: 'get',
        })
    }
    static addressPerson(params){
        return request({
            url: `/api/oa-user/v2.0/userList`,
            method: 'get',
            params
        })
    }

    static recentPerson( params){
        return request({
          url: `/api/oa-user/recentlyContacted/page`,
          method: 'get',
          params
        })
      }

    static recentlyContactedAdd(data){
        return request({
            url: `/api/oa-user/recentlyContacted/add`,
            method: 'post',
            data
        })
    }

    static deptWithUserTree(data){
        return request({
            url: `/api/oa-system/dept/v2.0/deptWithUserTree`,
            method: 'get',
        })
    }
    static getSubordinateInfo(userId){
        return request({
            url: `/api/oa-user/v2.0/getSubordinateInfo?userId=${userId}`,
            method: 'get',
        })
    }
}
