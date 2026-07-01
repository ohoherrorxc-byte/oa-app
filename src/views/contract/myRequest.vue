<template>
  <div>
    <el-row>
      <el-col :span="24">
        <third-register></third-register>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <basic-container>
          <p>
            我的请求
          </p>
        </basic-container>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <basic-container>
          <p>
            全部类型
          </p>
          <div class="list-left">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>

            <el-tree
                class="filter-tree"
                :data="data"
                show-checkbox
                node-key="id"
                :check-strictly="true"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                @check="handleCheck"
                ref="tree">
            </el-tree>
          </div>
        </basic-container>
      </el-col>
      <el-col :span="18">
        <basic-container>
          <p>
            {{ isShowName }}
          </p>
          <div class="list-right">
            <MyPurchaseContractManage v-if='isShowTable == 1'></MyPurchaseContractManage>
            <MysaleContractManage v-if='isShowTable == 2'></MysaleContractManage>
            <MyContractPaymentOrder v-if='isShowTable == 3'></MyContractPaymentOrder>
            <MyContractCollectionOrder v-if='isShowTable == 4'></MyContractCollectionOrder>
            <MyContractInvoices v-if='isShowTable == 5'></MyContractInvoices>
          </div>
        </basic-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import MyPurchaseContractManage from "@/views/contract/MyPurchaseContractManage.vue";
  import MysaleContractManage from "@/views/contract/MysaleContractManage.vue";
  import MyContractPaymentOrder from "@/views/contract/MyContractPaymentOrder.vue";
  import MyContractCollectionOrder from "@/views/contract/MyContractCollectionOrder.vue";
  import MyContractInvoices from "@/views/contract/MyContractInvoices.vue";

  export default {
    name: "wel",
    data() {
      return {
        activeNames: ['1', '2', '3', '5'],
        logActiveNames: ['28'],
        filterText: '',
        data: [{
          id: 1,
          label: '采购合同',
          children: []
        }, {
          id: 2,
          label: '销售合同',
          children: []
        }, {
          id: 3,
          label: '收款订单',
          children: []
        }, {
          id: 4,
          label: '付款订单',
          children: []
        }, {
          id: 5,
          label: '我的发票',
          children: []
        }],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'id',
          checkStrictly: true
        },
        isShowTable: 1,
        isShowName: '采购合同'
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    components: {
        MyPurchaseContractManage, //注册外部组件
        MysaleContractManage,
        MyContractPaymentOrder,
        MyContractCollectionOrder,
        MyContractInvoices,

    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    methods: {
      handleChange(val) {
        window.console.log(val);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      handleNodeClick(data) {
        
        console.log(data)
      },
      // 下拉框选中事件
      handleCheck(data, e, l) {
        console.log("ss",data)
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCheckedKeys([data.id])
        this.isShowTable = data.id;
        this.isShowName = data.label;
      },
    },
  };
</script>

<style>
  .el-font-size {
    font-size: 14px;
  }
  p {
    margin: 0;
  }
  .list-left {
    margin-top: 10px;
  }
  .filter-tree {
    margin-top: 10px;
  }
</style>

