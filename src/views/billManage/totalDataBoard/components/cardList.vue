<template>
    <div>
        <div class="content mt20 w-100">
            <div v-for="item in cardList" :key="item.id" class="row">
                <el-card :class="item.bgName">
                    <div slot="header" class="clearfix header-inner">
                        <span>{{ item.name }}</span>
                    </div>
                    <div v-for="subItem in item.collectionList" :key="subItem.name" class="text item"
                        @click="handClick(item, subItem, 'collectionList')">
                        <div>
                            <p>{{ subItem.name }}</p>
                            <div class="flex-wrap subitem-row">
                               <div class="flex">
                                应收
                                <div @click.stop="">
                                    <span v-if="!subItem.isEdit">{{ subItem.receivableAmount }}</span>
                                    <el-input class="mx3 w100" v-else v-model="subItem.receivableAmount"></el-input>
                                </div>
                                元；
                               </div>
                               <div class="flex">
                                未开票
                                <div @click.stop="">
                                    <span v-if="!subItem.isEdit">{{ subItem.uncollectedAmount }}</span>
                                    <el-input class="mx3 w100" v-else v-model="subItem.uncollectedAmount"></el-input>
                                </div>
                                元；已开票
                                <div @click.stop="">
                                    <span v-if="!subItem.isEdit">{{ subItem.receivedAmount }}</span>
                                    <el-input class="mx3 w100" v-else v-model="subItem.receivedAmount"></el-input>
                                </div>元
                               </div>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
        <div class="ml10 font14">
            <div class="text-content " @click="addTextColClick">本周新增收款：
                <div class="w-70 " @click.stop="">
                    <span v-if="!isEditColAdd">{{ form.textAddCol }}</span>
                    <el-input type="textarea" :rows="2" class="mx3 w-100" v-else v-model="form.textAddCol"></el-input>
                </div>
            </div>
            <div class="text-content" @click="totalColClick">总计：应收
                <div class="flex-center pr10" @click.stop="">
                    <span v-if="!isEditColTotal">{{ form.totalReceivableAmount }}</span>
                    <el-input class="mx3 w100" v-else v-model="form.totalReceivableAmount"></el-input>
                </div> 已开票
                <div class="flex-center pr10" @click.stop="">
                    <span v-if="!isEditColTotal">{{ form.totalReceivedAmount }}</span>
                    <el-input class="mx3 w100" v-else v-model="form.totalReceivedAmount"></el-input>
                </div>
                未开票
                <div class="flex-center" @click.stop="">
                    <span v-if="!isEditColTotal">{{ form.totalUncollectedAmount }}</span>
                    <el-input class="mx3 w100" v-else v-model="form.totalUncollectedAmount"></el-input>
                </div>
            </div>
        </div>
        <div class="content mt30 ">
            <div v-for="item in cardList" :key="item.id" class="row">
                <el-card :class="item.bgName">
                    <div slot="header" class="clearfix header-inner">
                        <span>{{ item.name }}</span>

                    </div>
                    <div v-for="subItem in item.paymentList" v-if="item.name==='license领域'||item.name==='硬件领域'"  :key="subItem.name" class="text item"
                        @click="handClick(item, subItem, 'paymentList')">
                        <div>
                            <p>{{ subItem.name }}</p>
                            <div class="flex-col flex-wrap subitem-row">
                               <div class="flex">
                                应付
                                <div @click.stop="">
                                    <span v-if="!subItem.isEdit">{{ subItem.payableAmount }}</span>
                                    <el-input class="mx3 w100" v-else v-model="subItem.payableAmount"></el-input>
                                </div>
                                元；
                               </div>
                                <div class="flex">
                                    未开票
                                <div @click.stop="">
                                    <span v-if="!subItem.isEdit">{{ subItem.outstandingAmount }}</span>
                                    <el-input class="mx3 w100" v-else v-model="subItem.outstandingAmount"></el-input>
                                </div>
                                元；已开票
                                <div @click.stop="">
                                    <span v-if="!subItem.isEdit">{{ subItem.paidAmount }}</span>
                                    <el-input class="mx3 w100" v-else v-model="subItem.paidAmount"></el-input>
                                </div>
                                元
                                </div>
                              
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <span class="font14" v-if="!subItem.isEdit">{{ subItem.payableAmount }}</span>
                        <el-input @click.stop="" v-if="subItem.isEdit" v-model="subItem.payableAmount" type="textarea"></el-input>
                        <div   @click="handClick(item, subItem, 'paymentList')" style="height: 200px;"></div>
                    </div>
                </el-card>
            </div>
        </div>
        <div class="ml10 font14 mb100">
            <div class="text-content " @click="addTextPayClick">本周新增付款：
                <div class="w-70 " @click.stop="">
                    <span v-if="!isEditPayAdd">{{ form.textAddPay }}</span>
                    <el-input type="textarea" :rows="2" class="mx3 w-100" v-else v-model="form.textAddPay"></el-input>
                </div>
            </div>
            <div class="text-content" @click="totalPayClick">总计：应付
                <div class="flex-center pr10" @click.stop="">
                    <span v-if="!isEditPayTotal">{{ form.totalPayableAmount }}</span>
                    <el-input class="mx3 w100" v-else v-model="form.totalPayableAmount"></el-input>
                </div> 已开票
                <div class="flex-center pr10" @click.stop="">
                    <span v-if="!isEditPayTotal">{{ form.totalPaidAmount }}</span>
                    <el-input class="mx3 w100" v-else v-model="form.totalPaidAmount"></el-input>
                </div>
                未开票
                <div class="flex-center" @click.stop="">
                    <span v-if="!isEditPayTotal">{{ form.totalOutstandingAmount }}</span>
                    <el-input class="mx3 w100" v-else v-model="form.totalOutstandingAmount"></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dataList from '../config/index'
export default {
    data() {
        return {
            cardList: [],
            sessionKey: null,
            sessionFormKey: null,
            form: {
                textAddCol: '',
                textAddPay: "",
                totalReceivableAmount: null,
                totalReceivedAmount: null,
                totalUncollectedAmount: null,
                totalPayableAmount: null,
                totalOutstandingAmount: null,
                totalPaidAmount: null
            },
            isEditColAdd: false,
            isEditColTotal: false,
            isEditPayAdd: false,
            isEditPayTotal: false
        }
    },
    props: {
        year: {
            type: String,
        }
    },
    mounted() {
        this.sessionKey = `dataList-${this.year}`
        this.sessionFormKey = `dataListForm-${this.year}`
        let tempForm = localStorage.getItem(this.sessionFormKey)
        let sessionList = localStorage.getItem(this.sessionKey)

        if (sessionList) {
            let arr = JSON.parse(sessionList)
            arr.map(ele => {
                if (ele.name === '硬件领域') {
                    if (ele.paymentList.length === 3) {
                        ele.paymentList.push({
                            name: '显示屏',
                            outstandingAmount: 0,//未开票
                            paidAmount: 0,//已开票
                            payableAmount: 0,
                            isEdit: false//应付
                        },
                            {
                                name: '前屏驱动模块',
                                outstandingAmount: 0,//未开票
                                paidAmount: 0,//已开票
                                payableAmount: 0,
                                isEdit: false//应付
                            })
                    }
                }
            })
            this.cardList = arr
        } else {
            this.cardList = JSON.parse(JSON.stringify(dataList))
        }
        if (tempForm) {
            this.form = JSON.parse(tempForm)
        }

    },
    methods: {
        handClick(item, subItem, key) {
            this.dealData(item, subItem, key)
        },
        dealData(item, subItem, key) {
            console.log('handClick')
            //保留数据存入缓存
            this.cardList.map(ele => {
                if (ele.id === item.id) {
                    item[key].map(self => {
                        if (self.name === subItem.name) {
                            self.isEdit = !self.isEdit
                        }
                    })
                }
            })

            this.setLocalData()
        },
        addTextColClick() {
            this.isEditColAdd = !this.isEditColAdd
            this.setFormData()
        },
        totalColClick() {
            this.isEditColTotal = !this.isEditColTotal
            this.setFormData()
        },
        addTextPayClick() {
            this.isEditPayAdd = !this.isEditPayAdd,
                this.setFormData()
        },
        totalPayClick() {
            this.isEditPayTotal = !this.isEditPayTotal
            this.setFormData()
        },
        setFormData() {
            localStorage.setItem(this.sessionFormKey, JSON.stringify(this.form))
        },
        setLocalData() {
            localStorage.setItem(this.sessionKey, JSON.stringify(this.cardList))
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    display: flex;
}

.subitem-row {
    line-height: 30px;
}

.row {
    flex-grow: 1;
    margin-left: 10px;
}

.text-content {
    display: flex;
    align-items: center;
    background-color: #f4f4f5;
    padding: 10px 20px;
    margin-top: 5px;
}

.font14 {
    font-size: 14px;
}

.item {
    font-size: 14px;

    padding-bottom: 20px;
}

::v-deep ep.el-card {
    height: 100%;
}

.header-inner {
    color: #fff;
    text-align: center;
    margin-top: 5px;
}

.mx3 {
    margin: 0 3px;
}

.w-70 {
    width: 70%;
}

.blue {
    ::v-deep ep .el-card__header {
        background-color: rgb(0, 167, 208);
    }
}

.orange {
    ::v-deep ep .el-card__header {
        background-color: rgb(243, 156, 18);
    }
}

.green27 {
    ::v-deep ep .el-card__header {
        background-color: rgb(27, 201, 142);
    }
}

.green150 {
    ::v-deep ep .el-card__header {
        background-color: rgb(0, 158, 150);
    }
}
</style>