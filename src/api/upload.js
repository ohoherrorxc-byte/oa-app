import request from '@/router/axios';

export default class UploadApi {
    static upload(data) {
        return request({
            url: "/icarx-resource/resource/oss/endpoint/put-file-attach-by-name",
            method: "post",
            ContentType:"multipart/form-data",
            data
          })
    }

    static getUrl(data){
        return request({
            url:`/api/oa-portal/file/getFileUrl`,
            method: "post",
            data
        })
    }
    static saveFileUrl(data){
        return request({
            url:`/api/oa-portal/file/saveFileUrl`,
            method: "post",
            data
        })
    }
    static saveFileUrlAccept(data){
        return request({
            url:`/api/oa-portal/file/saveFileUrlAccept`,
            method: "post",
            data
        })
    }
    
}
