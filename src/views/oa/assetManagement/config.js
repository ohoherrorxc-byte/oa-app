export  const  assetStatus = {
    //在库状态
    0:'进行中',
    1:'闲置中',
    2:'领用中',
    3:'维修中',
    4:'已报废',
    5:'已归还'
} 

export const getAssetStatusList = ()=>{
    let arr = []
    for(let key in assetStatus){
        arr.push({value:Number(key),label:assetStatus[key]})
    }
    return arr
}

