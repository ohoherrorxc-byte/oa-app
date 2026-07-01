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
                prop: 'distributionDate',
                label: '发放日期',
                type:'date',
                valueFormat:'yyyy-MM-dd'
            },
            {
                prop: 'remark',
                label: '备注'
            },
        ]
    },
    {
        label: "税前工资",
        children: [
            {
                prop: 'monthlySalary',
                label: '月薪'
            },
            {
                prop: 'retroactiveSalary',
                label: '补发工资'
            },
            {
                prop: 'roomStickers',
                label: '房贴'
            },
            {
                prop: 'highTemperatureFee',
                label: '高温费'
            },
            {
                prop: 'oneChildPays',
                label: '独生子女费'
            },
            {
                prop: 'other',
                label: '其他'
            },
            {
                prop: 'variousDeductions',
                label: '各类扣款'
            },
            {
                prop: 'salariesPayable',
                label: '应发工资'
            },
        ]
    },
    {
        label: "五险一金个人部分",
        children: [
            {
                prop: 'endowmentInsurance',
                label: '养老保险'
            },
            {
                prop: 'medicalInsurance',
                label: '医疗保险'
            },
            {
                prop: 'unemploymentInsurance',
                label: '失业保险'
            },
            {
                prop: 'housingFund',
                label: '住房公积金'
            },
         
        ]
    },
    {
        label: "其他工资信息",
        children: [
            {
                prop: 'accumulatedSalary',
                label: '累计工资'
            },
            {
                prop: 'accumulatedBasicDeduction',
                label: '累计基本减除'
            },
            {
                prop: 'accumulatedFiveInsurancesAndOneFund',
                label: '累计五险一金'
            },
         
        ]
    },
    {
        label: "累计专项附加扣除",
        children: [
            {
                prop: 'childrenEducationExpenditure',
                label: '子女教育支出'
            },
            {
                prop: 'continuingEducationExpenditure',
                label: '继续教育支出'
            },
            {
                prop: 'housingLoanExpenses',
                label: '住房贷款支出'
            },
            {
                prop: 'housingRentalExpenses',
                label: '住房租金支出'
            },
            {
                prop: 'expenditureElderly',
                label: '赡养老人支出'
            },
            {
                prop: 'criticalIllnessMedicalTreatment',
                label: '大病医疗'
            },
            {
                prop: 'infantCare',
                label: '婴幼儿照顾'
            },
            {
                prop: 'privatePension',
                label: '个人养老金'
            },
        ]
    },
    {
        label: "个人税信息",
        children: [
            {
                prop: 'taxableIncome',
                label: '应纳税所得额'
            },
            {
                prop: 'accumulatedTaxableAmount',
                label: '累计应纳税额'
            },
            {
                prop: 'paidTaxAmount',
                label: '已纳税额'
            },
            {
                prop: 'monthPersonalIncome',
                label: '本月个税'
            },
         
        ]
    },
    {
        label: "其他税后扣除项",
        children: [
            {
                prop: 'partyExpenses',
                label: '党费'
            },
            {
                prop: 'unionMembershipFees',
                label: '工会会费'
            },
            {
                prop: 'otherPostTaxDeductions',
                label: '其他税后扣除税'
            },
           
         
        ]
    },
    {
        label: "实发工资",
        children: [
            {
                prop: 'actualNumber',
                label: '实发数'
            },     
        ]
    },
]