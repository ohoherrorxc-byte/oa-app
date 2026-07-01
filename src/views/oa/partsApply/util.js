import AssetsManageApi from '@/api/assetsManage/index'
export const getCategories = async () => {
    let res = await AssetsManageApi.getDictionary('assetCategories')
    if (res.data.code === 0 || res.data.code === 200) {
        return res.data.data
    }
}

export const getPartCategories = async () => {
    let res = await AssetsManageApi.getDictionary('partCategories')
    if (res.data.code === 0 || res.data.code === 200) {
        return res.data.data
    }
}

export const getPlace = async () => {
    let res = await AssetsManageApi.getDictionary('storageLocation')
    if (res.data.code === 0 || res.data.code === 200) {
        return res.data.data
    }
}

export const remoteMethodPartName = (query) => {
    console.log('querrut======')
    console.log(query)
}