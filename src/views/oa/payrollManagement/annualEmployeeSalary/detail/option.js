export default  [
    {
        label: "基本信息",
        children: [
            {
                prop: 'realName',
                label: '姓名'
            },
            {
                prop: 'deptName',
                label: '部门',
                slot:true
            },
            {
                prop: 'year',
                label: '年份',
                type:'year',
                valueFormat:'yyyy'
            },
            {
                prop: 'remark',
                label: '备注'
            },
          
        ]
    },
    {
        label: "统计月份",
        children: [
            {
                prop: 'january',
                label: '1月'
            },
            {
                prop: 'february',
                label: '2月'
            },
            {
                prop: 'march',
                label: '3月'
            },
            {
                prop: 'april',
                label: '4月'
            },
            {
                prop: 'may',
                label: '5月'
            },
            {
                prop: 'june',
                label: '6月'
            },
            {
                prop: 'july',
                label: '7月'
            },
            {
                prop: 'august',
                label: '8月'
            }, {
                prop: 'september',
                label: '9月'
            },
            {
                prop: 'october',
                label: '10月'
            },
            {
                prop: 'november',
                label: '11月'
            },
            {
                prop: 'december',
                label: '12月'
            },
            {
                prop: 'other',
                label: '其他'
            },
            {
                prop: 'total',
                label: '合计'
            },
            {
                prop: 'monthsSocialSecurityPayment',
                label: '社保缴纳月份数'
            },
            {
                prop: 'monthlyAverageWageIncome',
                label: '月平均工资性收入'
            },
        ]
    },
   
]