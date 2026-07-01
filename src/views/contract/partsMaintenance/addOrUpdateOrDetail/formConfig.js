import constData from "@/config/constData";
export function categoryConfig() {
    return {
        optionCategory: {
            column: [
                {
                    type: "input",
                    label: "品类名称",
                    dicUrl: "/api/oa-portal/partsMaint/subList",
                    span: 12,
                    filterable:true,
                    prop: "categoryName",
                    rules: [
                        {
                            required: true,
                            message: "品类名称不能为空",
                            trigger: "blur",
                        },
                    ],
                    props: {
                        label: "partsName",
                        value: 'partsName'
                    },
                    disabledKeys:["isProcurement"],
                    change: this.getCategoryName.bind(null, ...arguments)
                },
                {
                    type: "input",
                    label: "品类零件号",
                    span: 12,
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "品类零件号不能为空",
                    //         trigger: "blur",
                    //     },
                    // ],
                    prop: "categoryNo",
                    dicUrl: "/api/oa-portal/partsMaint/subList",
                    props: {
                        label: "partsNo",
                        value: 'partsNo'
                    },
                    slot: true,
                    disabled: false,
                    placeholder: " ",
                    filterable:true,
                    disabledKeys:["isProcurement"],
                    change: this.getCategoryNo.bind(null, ...arguments)
                },
                {
                    type: "select",
                    label: "品类类型",
                    span: 12,
                    prop: "categoryType",
                    slot: true,
                    disabledKeys:["isProcurement"],
                    disabled: false,
                    placeholder: " ",
                    dicUrl: "/api/oa-system/dict-biz/dictionary?code=partCategoryType",
                    props: {
                        label: "dictValue",
                        value: 'dictValue'
                    }
                },
                {
                    type: "input",
                    label: "品类详情",
                    span: 12,
                    prop: "categoryDetail",
                    slot: true,
                    disabledKeys:["isProcurement"],
                    disabled: false,
                    placeholder: " ",
                },              
                {
                    type: "date",
                    label: "创建日期",
                    span: 12,
                    prop: "createTime",
                    slot: true,
                    disabled: true,
                    placeholder: " ",
                },
                {
                    type: "select",
                    label: "合同类型",
                    span: 12,
                    displayKeys:["isProcurement"],
                    prop: "purchaseType",
                    dicData: [
                        { label: "一般采购合同", value: '1' },
                        { label: "BOM采购合同", value: '2' }
                    ],
                    slot: true,
                    disabled: false,
                    placeholder: " ",
                    rules: [
                        {
                            required: true,
                            message: "合同不能为空",
                            trigger: "change",
                        },
                    ],
                    change: this.getContractType.bind(null, ...arguments)
                },
                {
                    type: "input",
                    label: "相关采购合同",
                    displayKeys:["isProcurement"],
                    span: 12,
                    prop: "purchaseContractNo",
                    slot: true,
                    disabled: false,
                    placeholder: " ",
                    rules: [
                        {
                            required: true,
                            message: "相关采购合同不能为空",
                            trigger: "change",
                        },
                    ],
                },
                {
                    type: "daterange",
                    label: "合同有效期",
                    span: 12,
                    displayKeys:["isProcurement"],
                    prop: "validDate",
                    slot: true,
                    disabled: true,
                    placeholder: " ",
                },
                {
                    type: "select",
                    label: "供应商",
                    disabled: false,
                    placeholder: "请选择",
                    displayKeys:["isProcurement"],
                    filterable: true,
                    span: 12,
                    dicUrl: '/api/oa-portal/contractSupplier/list',
                    prop: "supplierId",
                    props: {
                        label: 'supplierName',
                        value: 'id'
                    },
                    rules: [
                        {
                            required: true,
                            message: "供应商不能为空",
                            trigger: "change",
                        },
                    ],
                    change: this.getSupplierName.bind(null, ...arguments)
                },
                {
                    type: "select",
                    label: "原币种",
                    disabled: false,
                    displayKeys:["isProcurement"],
                    span: 12,
                    dicData: [],
                    prop: "originalCurrency",
                    props: {
                        label: 'originalCurrencyName',
                        value: 'originalCurrency'
                    },
                    rules: [
                        {
                            required: false,
                            message: "币种不能为空",
                            trigger: "change",
                        },
                    ],
                    change: this.getRate.bind(null, ...arguments)
                },
                {
                    type: "input",
                    label: "原币金额",
                    span: 12,
                    prop: "unitPrice",
                    displayKeys:["isProcurement"],
                    placeholder: " ",
                    rules: [
                        {
                            required: true,
                            pattern: /^\d+(\.\d{0,2})?$/s,
                            message: "原币金额只能输入数字或两位数小数",
                            trigger: "blur",
                        },
                    ],
                    change: this.getUnitPriceCny.bind(null, ...arguments)
                },
                {
                    type: "select",
                    label: "汇率计算方式",
                    disabled: true,
                    span: 12,
                    displayKeys:["isProcurement"],
                    prop: "exchangeRateMethod",
                    placeholder: " ",
                    props: {
                        label: 'name',
                        value: 'id'
                    },
                    dicData: constData.exchangeRateList,
                    rules: [
                        {
                            required: false,
                            message: "汇率计算方式不能为空",
                            trigger: "change",
                        },
                    ],
                    // change:this.getRate.bind(null,...arguments)
                },
                {
                    type: "input",
                    label: "本月汇率",
                    disabled: true,
                    span: 12,
                    displayKeys:["isProcurement"],
                    prop: "middleRate",
                    placeholder: " ",
                    rules: [
                        {
                            required: false,
                            message: "汇率不能为空",
                            trigger: "blur",
                        },
                    ],

                },
                {
                    type: "select",
                    label: "结算币种",
                    disabled: true,
                    displayKeys:["isProcurement"],
                    span: 12,
                    dicUrl: '/api/oa-system/dict/dictionary?code=CURRENCY',
                    prop: "settlementCurrency",
                    props: {
                        label: 'dictValue',
                        value: 'dictKey'
                    },
                },
                {
                    type: "input",
                    label: "结算金额",
                    disabled: true,
                    displayKeys:["isProcurement"],
                    span: 12,
                    prop: "settlementAmount",
                },
                {
                    type: "select",
                    label: "人民币汇率计算方式",
                    disabled: true,
                    displayKeys:["isProcurement"],
                    span: 12,
                    prop: "CNYExchangeRateMethod",
                    props: {
                        label: 'name',
                        value: 'id'
                    },
                    dicData: constData.exchangeRateList,
                },
                {
                    type: "input",
                    label: "人民币汇率",
                    displayKeys:["isProcurement"],
                    disabled: true,
                    span: 12,
                    prop: "rmbRate",
                },
                {
                    type: "input",
                    label: "人民币价格",
                    displayKeys:["isProcurement"],
                    disabled: true,
                    span: 12,
                    prop: "unitPriceCny",
                    placeholder: " ",
                    rules: [
                        {
                            required: false,
                            pattern: /^\d+(\.\d{0,2})?$/s,
                            message: "人民币价格只能输入数字或两位数小数",
                            trigger: "blur",
                        },
                    ],
                    change: this.getTaxAmount.bind(null, ...arguments)
                },
                {
                    type: "select",
                    label: "成本类型",
                    displayKeys:["isProcurement"],
                    disabled: false,
                    span: 12,
                    prop: "costPriceType",
                    dicData: [
                        {
                            value: "正式成本",
                            label: "正式成本"
                        },
                        {
                            value: "临时成本",
                            label: "临时成本"
                        }
                    ],
                    placeholder: " ",
                },
                {
                    type: "input",
                    label: "总成需要使用数量",
                    disabled: true,
                    span: 12,
                    prop: "needUseNumber",
                    placeholder: " ",
                    disabledKeys:["isProcurement"],
                },
                {
                    type: "input",
                    label: "入库价格",
                    disabled: false,
                    displayKeys:["isProcurement"],
                    span: 12,
                    prop: "stockInPrice",
                    placeholder: " ",
                },
                {
                    type: "select",
                    label: "是否含税",
                    disabled: false,
                    displayKeys:["isProcurement"],
                    span: 12,
                    prop: "includeTax",
                    placeholder: "",
                    dicData: [
                        {
                            label: "不含税",
                            value: 0,
                        },
                        {
                            label: "含税",
                            value: 1,
                        },],
                    rules: [
                        {
                            required: true,
                            message: "是否含税不能为空",
                            trigger: "change",
                        },
                    ],
                    change: this.changeTax.bind(null, ...arguments)
                },
                {
                    type: "input",
                    label: "税率",
                    span: 12,
                    minRows: 9,
                    display: false,
                    displayKeys:["isProcurement"],
                    prop: "taxRate",
                    append: '%',
                    rules: [
                        {
                            required: true,
                            pattern: /^(([1-9]?\d(\.\d{1,2})?)|100|100.00)$/,
                            message: "税率不能为空且数字为0-100两位小数",
                            trigger: "blur",
                        },
                    ],
                    blur: this.getTaxAmount.bind(null, ...arguments)
                },
                {
                    type: "input",
                    label: "税费",
                    span: 12,
                    minRows: 9,
                    disabled: true,
                    displayKeys:["isProcurement"],
                    display: false,
                    prop: "taxAmount",
                    rules: [
                        {
                            required: true,
                            message: "税费不能为空",
                            trigger: "blur",
                        },
                    ],
                },
                {
                    type: "date",
                    label: "价格失效日期",
                    disabled: false,
                    span: 12,
                    displayKeys:["isProcurement"],
                    prop: "priceExpirationTime",
                    format:'yyyy-MM-dd HH:mm:ss',
                    valueFormat:'yyyy-MM-dd HH:mm:ss'
                },
                {
                    type: "textarea",
                    label: "备注",
                    disabled: false,
                    span: 24,
                    prop: "remark",
                    minRows: 2,
                    maxRows: 4
                },
                {
                    type: "radio",
                    label: "是否是生产属性",
                    disabled: false,
                    span: 12,
                    prop: "isProduct",
                    disabledKeys:["isProcurement"],
                    dicData: [                
                        { label: '是', value: 1 },
                        { label: '否', value: 0 },
                    ],
                    change:this.getAllAmount.bind(null, ...arguments)
                },
                
            ],
            labelPosition: "right",
            labelWidth: 160,
            gutter: 0,
            menuBtn: true,
            submitBtn: false,
            emptyBtn: false,
            menuPosition: "center",
            detail: false,
            tabs: false,
            labelSuffix: " ",
            key: Date.parse(new Date())
        }
    }
}

