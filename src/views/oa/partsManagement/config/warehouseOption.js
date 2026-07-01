export const inReceiptColumn = (that) => {
    let arr = [
        {
            label: "领用人员",
            prop: "recipient",
            searchLabelWidth: 80,
            searchSpan: 8,
            search: true,
            display: false,
        },
        {
            label: "领用部门",
            prop: "recipientDept",
            search: true,
            display: false,
            type: "tree",
            multiple: false,
            dicUrl: '/api/oa-system/dept/v2.0/tree?tenantId=629965',
            props: {
                label: "title",
                value: 'title'
            },
            checkStrictly: true,
            slot: true,
        },
        {
            label: "领用日期",
            prop: "usageTime",
            type: 'date',
            searchRange: true,
            searchSpan: 8,
            searchLabelWidth: 80,
            search: true,
            display: false,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            change: that.getTimer
        },
        {
            label: "零件名称",
            prop: "partName",
            display: false,
        },
        {
            label: "零件编号",
            prop: "partNumber",
            width: 100,
            search: false,
            display: false,
        },
        {
            label: "采购零件号",
            prop: "purchasePartNumber",
            width: 100,
            search: false,
            display: false,
        },
        {
            label: "规格型号",
            prop: "specificationAndModel",
            width: 100,
            search: false,
            display: false,
        },
        {
            label: "适用项目",
            prop: "partsProject",
            width: 100,
            search: false,
            display: false,
        },
        {
            label: "相关流程",
            prop: "titleName",
            display: false,

        },
        {
            label: "零件BOM名称",
            prop: "partBomName",
            display: false,
        },
        {
            label: "零件大类",
            prop: "partsCategory",
            search: true,
            display: false,
            props: {
                value: 'dictValue',
                label: 'dictValue'
            },
            type: 'select',
            dicUrl: "/api/oa-system/dict-biz/dictionary?code=partCategories"
        },
        {
            label: "存放地点",
            prop: "storageLocation",
            display: false,
        },
        {
            label: "相关流程",
            prop: "titleName",
            display: false,

        },

        {
            label: "申请编号",
            prop: "approvalCode",
            search: true,
            display: false,
        },
        {
            label: "用途说明",
            prop: "usageDescription",
            display: false,
        },
        {
            label: "预计归还日期",
            prop: "expectReturnTime",
            display: false,
        },

    ]
    return arr
}

export const returnColumn = (that) => {
    let arr = [{
        label: "归还人员",
        prop: "returnPerson",
        searchLabelWidth: 80,
        searchSpan: 8,
        search: true,
        display: false,
    },
    {
        label: "归还部门",
        prop: "returnDept",
        slot: true,
        search: true,
        display: false,
    },
    {
        label: "归还日期",
        prop: "returnTime",
        searchSpan: 8,
        searchLabelWidth: 80,
        search: true,
        searchRange: true,
        type: 'date',
        format: "yyyy-MM-dd HH:mm:ss",
        valueFormat: "yyyy-MM-dd HH:mm:ss",
        display: false,
        change: that.getTimerReturn
    },
    {
        label: "零件名称",
        prop: "partName",
        display: false,
    },
    {
        label: "零件编号",
        prop: "partNumber",
        width: 100,
        search: false,
        display: false,
    },
    // {
    //     label: "零件BOM名称",
    //     prop: "partBomName",
    //     display: false,
    // },
    {
        label: "零件大类",
        prop: "partsCategory",
        // search: true,
        display: false,
    },
    {
        label: "相关流程",
        prop: "titleName",
        display: false,

    },
    {
        label: "申请编号",
        prop: "approvalCode",
        // search: true,
        display: false,
    },
    ]
    return arr
}


export const scrapColumn =(that)=>{
    let arr =  [
        {
            label: "报废人员",
            prop: "scrapPerson",
            searchLabelWidth: 80,
            searchSpan: 8,
            search: true,
            display: false,
        },
        {
            label: "报废部门",
            prop: "scrapDept",
            slot: true,
            search: true,
            display: false,
        },
        {
            label: "报废日期",
            prop: "scrapTime",
            searchSpan: 8,
            searchLabelWidth: 80,
            search: true,
            searchRange: true,
            type: 'date',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            display: false,
            change: that.getTimerScrap
        },
        {
            label: "零件名称",
            prop: "partName",
            display: false,
        },
        {
            label: "零件编号",
            prop: "partNumber",
            width: 100,
            // search: false,
            display: false,
        },
        // {
        //     label: "零件BOM名称",
        //     prop: "partBomName",
        //     display: false,
        // },
        {
            label: "零件大类",
            prop: "partsCategory",
            // search: true,
            display: false,
        },
        {
            label: "报废方式",
            prop: "scrapWay",
            // search: true,
            display: false,
        },
        {
            label: "相关流程",
            prop: "titleName",
            display: false,
    
        },
        {
            label: "申请编号",
            prop: "approvalCode",
            // search: true,
            display: false,
        },
        {
            label: "零件单价",
            prop: "unitPrice",
            // search: true,
            display: false,
        },
    ]
    return arr
}