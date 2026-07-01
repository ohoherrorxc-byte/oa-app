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
            新建合同
          </p>
        </basic-container>
      </el-col>
    </el-row>
    <div class="box-all">
       <div class="box-title">
            <p>采购合同</p>
       </div>
       <div class="box-main">
            <div class="box-mainTop">
                <span class="box-mainTop-left">
                    <p class="box-mainTop-left-tit">收款订单</p>
                    <p class="box-mainTop-left-name">一般采购合同</p>
                </span>
                <span class="box-mainTop-right">
                    <img class="box-img-right" src="../../img/ic_agreement_b.png" />
                </span>
            </div>
            <div class="box-mainMid">
                <p></p>
            </div>
            <div class="box-mainBottom">
                <div class="box-mainBottom-btn" @click="gotoGeneraladd">新建</div>
            </div>
       </div>
       <div class="box-main">
            <div class="box-mainTop">
                <span class="box-mainTop-left">
                    <p class="box-mainTop-left-tit">付款订单</p>
                    <p class="box-mainTop-left-name">BOM及框架采购合同</p>
                </span>
                <span class="box-mainTop-right">
                    <img class="box-img-right" src="../../img/ic_agreement_g.png" />
                </span>
            </div>
            <div class="box-mainMid">
                <p></p>
            </div>
            <div class="box-mainBottom">
                <div class="box-mainBottom-btn" @click="gotoBOMadd">新建</div>
            </div>
       </div>
    </div>
    <div class="box-all">
       <div class="box-title">
            <p>销售合同</p>
       </div>
       <div class="box-main">
            <div class="box-mainTop">
                <span class="box-mainTop-left">
                    <p class="box-mainTop-left-tit">付款订单</p>
                    <p class="box-mainTop-left-name">一般通用销售合同</p>
                </span>
                <span class="box-mainTop-right">
                    <img class="box-img-right" src="../../img/ic_agreement_y.png" />
                </span>
            </div>
            <div class="box-mainMid">
                <p></p>
            </div>
            <div class="box-mainBottom">
                <div class="box-mainBottom-btn" @click="gotoSelladd">新建</div>
            </div>
       </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "wel",
    data() {
      return {
        activeNames: ['1', '2', '3', '5'],
        logActiveNames: ['28']
      };
    },
    computed: {
      ...mapGetters(["userInfo"]),
    },
    methods: {
      handleChange(val) {
        window.console.log(val);
      },
      gotoSelladd() {
        this.$router.push({path: '/contractSellAdd'});
      },
      gotoGeneraladd() {
        this.$router.push({path: '/contractGeneralAdd'});
      },
      gotoBOMadd() {
        this.$router.push({path: '/contractBOMAdd'});
      }
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
  .box-all {
    overflow: hidden;
  }
  .box-title {
    padding: 20px;
  }
  .box-main {
    width: 390px;
    height: 280px;
    background: #FFFFFF;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(181,218,255,0.15);
    border-radius: 20px;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .box-mainTop {
    overflow: hidden;
  }
  .box-mainTop-left {
    width: 200px;
    display: inline-block;
  }
  .box-mainTop-left-tit {
    font-size: 12px;
    font-weight: 500;
    color: #666666;
  }
  .box-mainTop-left-name {
    font-size: 20px;
    font-weight: 500;
    color: #404040;
  }
  .box-mainTop-right {
    width: 48px;
    height: 48px;
    float: right;
  }
  .box-img-right {
    width: 48px;
    height: 48px;
  }
  .box-mainMid {
    margin: 60px 0;
    height: 68px;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
  }
  .box-mainBottom-btn {
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #203B71;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    cursor: pointer;
  }
</style>

