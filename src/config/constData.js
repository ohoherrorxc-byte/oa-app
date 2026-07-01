export default {
  orderStatus: [
    {
      label: '出口确认',
      value: 1
    },
    {
      label: '待确认',
      value: 2
    },
    {
      label: '待开票中',
      value: 3
    },
    {
      label: '已开票',
      value: 4
    },
    /*{
      label: '收款中',
      value: 5
    },*/
    {
      label: '已收款',
      value: 6
    }
  ],
  billStatus: [
    {
      label: '待确认',
      value: 2
    },
    {
      label: '待收票中',
      value: 3
    },
    {
      label: '已收票',
      value: 4
    },
    /*{
      label: '付款中',
      value: 5
    },*/
    {
      label: '已付款',
      value: 6
    }
  ],
  orderType: [
    {name: '天气', value: 1, type: 'weather'},
    {name: '语音', value: 2, type: 'voice'},
    {name: '地图（导航）', value: 3, type: 'map'},
    {name: '地图（图资）', value: 4, type: 'mapData'},
  ],
  currency: [
    {
      label: 'RMB',
      symbol: '￥',
      value: '0'
    },
    {
      label: 'USD',
      symbol: '$',
      value: '1'
    },
  ],
  modelType: [
    {value: 0, label: "网联车"},
    {value: 1, label: "Color Radio Lite"},
    {value: 2, label: "Color Radio"},
    {value: 3, label: "待确认"},
  ],
  countryList: [
    {value: "3G02", label: "欧盟"},
    {value: "3G08", label: "英国"},
    {value: "3G05", label: "泰国"},
    {value: "3G07", label: "印度"},
    {value: "3F02", label: "澳洲设计标准"},
    {value: "3G16", label: "印尼"},
    {value: "3G01", label: "以色列"},
    {value: "3G00", label: "越南"},
    {value: "8", label: "中东"},
    {value: "21", label: "中国"},
  ],
  booleanValue: [
    {value: 1, label: "是"},
    {value: 0, label: "否"},
  ],
  // 供应商类型
  supplierType: [
    {
      label: "IT",
      value: "1",
    },
    {
      label: "代理",
      value: "2",
    },
    {
      label: "行政",
      value: "3",
    },
    {
      label: "项目咨询",
      value: "4",
    },
    {
      label: "制作",
      value: "5",
    },
    {
      label: "代理",
      value: "6",
    },
    {
      label: "工程",
      value: "7",
    },
    {
      label: "物流",
      value: "8",
    },
    {
      label: "培训",
      value: "9",
    },
    {
      label: "活动",
      value: "10",
    },
    {
      label: "生产",
      value: "11",
    },
    {
      label: "产品",
      value: "12",
    },
    {
      label: "人力",
      value: "13",
    },
    {
      label: "实验",
      value: "14",
    },
  ],
  // 项目类型
   projectType: [
    {
      label: "N1",
      value: 1,
    },
    {
      label: "N2",
      value: 2,
    },
    {
      label: "M1",
      value: 3,
    },
    {
      label: "M2",
      value: 4,
    },
    {
      label: "I1",
      value: 5,
    },
    {
      label: "I2",
      value: 6,
    },
    {
      label: "NA",
      value: 7,
    },
  ],
  projectStatus: [
    {
      label: "进行中",
      value: 1,
    },
    {
      label: "已结项",
      value: 2,
    },
  ],
  bomType: [
    {
      label: "License",
      value: 'license',
    },
    {
      label: "硬件",
      value: 'hardware',
    },
    {
      label: "硬件（含License）",
      value: 'other',
    },
  ],
    exchangeRateList: [
        {
          name: "固定汇率1.00",
          id: 1,
        },
        {
          name: "当年1日汇率",
          id: 2,
        },
        {
          name: "当季1日",
          id: 3,
        },
  ],
    collectionStatus: [
        {
          label: "已收",
          value: 1,
        },
        {
          label: "未收",
          value: 0,
        },
      ],
}
