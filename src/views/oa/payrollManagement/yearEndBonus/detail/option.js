export default  {
    label: "",
    list: [
        {
            span:24,
            prop: 'year',
            label: '年终奖明细',
            format:((data)=>{
                return `${data}年份`
            })
        },
        {
            prop: 'distributionDate',
            label: '发放日期',
            type:'date',
            valueFormat:'yyyy-MM-dd'
        },
        {
            prop: 'year',
            label: '年份',
            type:'year',
            valueFormat:'yyyy'
        },
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
            prop: 'floatingTargetSalary',
            label: '浮动目标工资'
        },
        {
            prop: 'projectAward',
            label: '项目奖'
        },
        {
            prop: 'generalManagerSpecialAward',
            label: '总经理特别奖'
        },
        {
            prop: 'other',
            label: '其他'
        },
        {
            prop: 'totalYearEndBonus',
            label: '年终奖合计'
        },
        {
            prop: 'personalIncome',
            label: '个税'
        },
        {
            prop: 'remark',
            label: '备注'
        },
        {
            prop: 'actualNumber',
            label: '实发数',
            span:24,
        },
       
    ]
}