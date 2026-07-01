<template>
  <div>
    <div class="fr">
      <el-button v-if="!disabled" type="success" @click="addRow">{{ $t('commonContent.add') }}</el-button>
    </div>
    <el-table class="mt10" :data="tableData" style="width: 100%">
      <el-table-column prop="companyName" :label="$t('purchaseCommissionDecision.priceAnalysis1.companyName')" align="center">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-if="!disabled" v-model="scope.row.companyName"></el-input>
            <div v-else>{{ scope.row.companyName }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseContent" :label="$t('purchaseCommissionDecision.priceAnalysis1.content')" align="center">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-if="!disabled" v-model="scope.row.purchaseContent"></el-input>
            <div v-else>{{ scope.row.purchaseContent }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseDesc" :label="$t('purchaseCommissionDecision.priceAnalysis1.description')" align="center">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-if="!disabled" v-model="scope.row.purchaseDesc"></el-input>
            <div v-else>{{ scope.row.purchaseDesc }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseNumber" :label="$t('purchaseCommissionDecision.priceAnalysis1.quantity')" align="center">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-if="!disabled" v-model="scope.row.purchaseNumber"
              @change="getTotal(scope.row, scope.$index)"></el-input>
            <div v-else>{{ scope.row.purchaseNumber }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" :label="$t('purchaseCommissionDecision.priceAnalysis1.unitPrice')"  align="center">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-if="!disabled" v-model="scope.row.unitPrice"
              @change="getTotal(scope.row, scope.$index)"></el-input>
            <div v-else>{{ scope.row.unitPrice }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="totalCost" :label="$t('purchaseCommissionDecision.priceAnalysis1.totalCost')" align="center">
        <template slot-scope="scope">
          <el-form-item>
            {{ scope.row.totalCost }}
            <!-- <el-input v-if="!disabled" v-model="scope.row.totalCost"></el-input>
            <div v-else>{{ scope.row.totalCost }}</div> -->
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commonContent.remarks')" prop="remark" align="center">
        <template slot-scope="scope">
          <el-form-item>
            <el-input v-if="!disabled" autosize type="textarea" v-model="scope.row.remark"></el-input>
            <div v-else>{{ scope.row.remark }}</div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" :label="$t('commonContent.operation')" v-if="!disabled">
        <template slot-scope="scope">
          <el-button @click="delRow(scope.row, scope.$index)" type="text" class="red">{{ $t('commonContent.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      tableData: [{
        companyName: null,
        purchaseContent: null,
        purchaseDesc: null,
        purchaseNumber: null,
        unitPrice: null,
        totalCost: null,
        remark: null
      }]
    }
  },
  props: {
    formData: {
      type: Object,
      default: {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isPdfDown: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formData() {
      if (this.formData.id) {
        this.tableData = this.formData.priceAnalysisList
      }

    }
  },
  methods: {
    addRow() {
      this.tableData.push({})
    },
    delRow(row, index) {
      this.tableData.splice(index, 1)
    },
    getTotal(row, index) {
      if ((row.purchaseNumber!==undefined&&row.purchaseNumber!==null&&row.purchaseNumber!=='') && (row.unitPrice!==undefined&&row.unitPrice!==null&&row.unitPrice!=='')) {
        row.totalCost = (Number(row.purchaseNumber) * Number(row.unitPrice)).toFixed(2)
        this.$set(this.tableData, index, row)
      }

    }
  }
}
</script>