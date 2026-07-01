import { numberToTraditionalChinese } from '@/util/util'

export const mixinsAmount = {
    data() {
        return {
            form: {
                purchaseApplyTotalAmountOriginal: null,
                purchaseApplyTotalAmountRmb: null,
            }
        }
    },
    methods: {
        //人民币金额
        getRMBAmount(money, scope) {
            if (!money) return
            if (scope) {
                scope.row.totalPriceRmb = Number(money) * (this.form.exchangeRate || 1)
            }
            return (Number(money) * (this.form.exchangeRate || 1)).toFixed(2)
        },
        getOriginalAmount(row) {
            if (!row || !row.quantity || !row.totalPrice) return
            row.totalPriceOriginal = Number(row.quantity) * Number(row.totalPrice)
            this.changeMoney()
            return (Number(row.quantity) * Number(row.totalPrice)).toFixed(2)
        },
        changeMoney(){
            this.getRMBAmountToTal('bomPurchaseOrderDetailList')
            this.getOriginalAmountToTal('bomPurchaseOrderDetailList')
            this.getRMBAmountToTalChinese('bomPurchaseOrderDetailList')
            this.getOriginalAmountToTalChinese('bomPurchaseOrderDetailList')
        },
        //人民币金额合计
        getRMBAmountToTal(listKey = 'purchaseDetailList', amountKey = 'totalPriceOriginal',formKey='totalAmountRmb') {
            if (!this.form[listKey] || this.form[listKey].length === 0) return
            let arr = this.form[listKey].map(ele => ele[amountKey])
            var sum = arr.reduce(function (prev, curr, idx, arr) {
                return Number(prev || 0) + Number(curr || 0);
            });
            this.form[formKey] = sum * (this.form.exchangeRate || 1)
            if (!isNaN(sum)) {
                return  this.form[formKey].toFixed(2)
            }
        },
      //人民币金额合计----明细版本
        getRMBAmountToTalWithRow(listKey = 'bomPurchaseOrderDetailList', amountKey = 'totalPriceOriginal',formKey='totalPriceRmb') {
          if (!this.form[listKey] || this.form[listKey].length === 0) return
          let arr = this.form[listKey].map(ele => ele[formKey])
          var sum = arr.reduce(function (prev, curr, idx, arr) {
            return Number(prev || 0) + Number(curr || 0);
          });
          if (!isNaN(sum)) {
            return  Number(sum).toFixed(2)
          }
        },
      //人民币金额合计大写----明细版本
      getRMBAmountToTalChineseWithRow(key,key2,formKey = 'totalPriceRmb') {
        this.form.totalAmountRmbUpper = numberToTraditionalChinese(this.getRMBAmountToTalWithRow(key,key2,formKey) || 0)
        return numberToTraditionalChinese(this.getRMBAmountToTalWithRow(key,key2,formKey) || 0)
      },
        //人民币金额合计大写
        getRMBAmountToTalChinese(key,key2,formKey = 'totalAmountRmb') {
            this.form.totalAmountRmbUpper = numberToTraditionalChinese(this.getRMBAmountToTal(key,key2,formKey) || 0)
            return numberToTraditionalChinese(this.getRMBAmountToTal(key,key2,formKey) || 0)
        },
        //原币金额合计
        getOriginalAmountToTal(listKey = 'purchaseDetailList', amountKey = 'totalPriceOriginal',formKey = 'totalAmountOriginal') {
            if (!this.form[listKey] || this.form[listKey].length === 0) return
            let arr = this.form[listKey].map(ele => ele[amountKey])
            var sum = arr.reduce(function (prev, curr, idx, arr) {
                return Number(prev || 0) + Number(curr || 0);
            });
            this.form[formKey] = sum
            if (!isNaN(sum)) {
                return Number(sum).toFixed(2)
            }
        },
        //原币金额合计大写
        getOriginalAmountToTalChinese(key,key2,formKey = 'totalAmountOriginal') {
            console.log(key+'key')
            this.form.totalAmountOriginalUpper = numberToTraditionalChinese(this.getOriginalAmountToTal(key,key2,formKey) || 0)
            return numberToTraditionalChinese(this.getOriginalAmountToTal(key,key2,formKey) || 0)
        },
    }
}
