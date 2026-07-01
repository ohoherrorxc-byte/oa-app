<template>
  <div class="calendar pbr25">
    <el-calendar v-model="calendarValue">
      <template slot="dateCell" slot-scope="{data}">
        <p
          class="custom"
          :class="data.isSelected ? 'is-selected' : ''"
        >{{ new Date(data.day).getDate() }}</p>
        <p>
          <span v-if="new Date(data.day).getDate().toString().includes(6)" class="round meeting"></span>
          <span v-if="new Date(data.day).getDate().toString().includes(5)" class="round plan"></span>
        </p>
      </template>
    </el-calendar>
    <el-row type="flex" justify="end">
      <el-col :md="8" :lg="6" :xl="4" class="prompt meeting">
        <span class="round"></span>
        <span class="title">我的会议</span>
      </el-col>
      <el-col :md="8" :lg="6" :xl="4" class="prompt plan">
        <span class="round"></span>
        <span class="title">我的计划</span>
      </el-col>
      <el-col :span="2">
        <p class="prompt-icon">
          <i class="el-icon-plus"></i>
        </p>
      </el-col>
    </el-row>
    <el-row type="flex" class="mrr40 prompt-list meeting mtr20">
      <el-col :offset="1" :md="4" :lg="3" :xl="2">08:00</el-col>
      <div class="prompt-border"></div>
      <el-col class="list">
        <div class="text-l">
          <p class="title-t">准备汇报资料</p>
          <p class="title-b">建议位置：家</p>
        </div>
        <div class="text-r">
          <p class="title-t">结束</p>
          <p class="title-b">9:00</p>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="mrr40 prompt-list plan mtr20">
      <el-col :offset="1" :md="4" :lg="3" :xl="2">08:00</el-col>
      <div class="prompt-border"></div>
      <el-col class="list">
        <div class="text-l">
          <p class="title-t">准备汇报资料</p>
          <p class="title-b">建议位置：家</p>
        </div>
        <div class="text-r">
          <p class="title-t">结束</p>
          <p class="title-b">9:00</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      calendarValue: "",
    };
  },
  watch: {
    calendarValue(oldVal, newVal) {
      console.log(oldVal, newVal);
    },
  },
};
</script>
<style lang="scss" scoped>
.calendar {
  background-color: #fff;
  ::v-deep ep .el-calendar__header {
    padding: 0.12rem 0.2rem;
  }
  ::v-deep ep .el-calendar__body {
    padding: 0.12rem 0.2rem 0.35rem;

    .el-calendar-table {
      thead th {
        padding: 0.12rem 0;
      }
      .el-calendar-table__row {
        > td {
          border: none;
          &.is-selected {
            background-color: #fff;
          }
        }
        .is-today {
          .custom {
            background: linear-gradient(180deg, #165fce 0%, #96b4e9 100%);
            color: #fff;
          }
        }

        .el-calendar-day {
          text-align: center;
          height: 0.5rem;
          padding: 0.08rem;
          // display: flex;
          // justify-content: center;
          // align-items: center;
          // &:hover {
          //   background-color: #fff;
          // }
          .custom {
            width: 0.26rem;
            height: 0.26rem;
            line-height: 0.26rem;
            border-radius: 0.04rem;
            text-align: center;
            display: inline-block;
            font-size: 0.16rem;
            &.is-selected {
              border: 0.02rem solid #165fce;
            }
          }

          .round {
            margin: 0.02rem;
            display: inline-block;
            width: 0.05rem;
            height: 0.05rem;
            border-radius: 50%;

            &.meeting {
              border: 0.02rem solid #ffa438;
            }
            &.plan {
              border: 0.02rem solid #2bc557;
            }
          }
        }
      }
    }
  }
  .prompt {
    .round {
      display: inline-block;
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 0.05rem;
    }

    .title {
      padding: 0.05rem 0.15rem;
      border-radius: 0.02rem;
      font-size: 0.12rem;
    }
    &.meeting {
      .title {
        background: #fff5e8;
        color: #ffa438;
      }
      .round {
        border: 0.02rem solid #ffa438;
      }
    }
    &.plan {
      .title {
        background: #e6f8eb;
        color: #00ba34;
      }
      .round {
        border: 0.02rem solid #00ba34;
      }
    }
  }
  .prompt-list {
    .prompt-border {
      width: 0.03rem;
      border-radius: 0.02rem 0rem 0rem 0.02rem;
    }
    .list {
      padding: 0.09rem 0.22rem;
      display: flex;
      justify-content: space-between;
      border-radius: 0.02rem;
      .title-t {
        font-size: 0.14rem;
        color: #1e1d1d;
      }
      .title-b {
        font-size: 0.12rem;
        color: #9d9d9d;
        margin-top: 0.05rem;
      }
    }
    &.meeting {
      .prompt-border {
        background: #ffa438;
      }
      .list {
        background: #fff5e8;
      }
    }
    &.plan {
      .prompt-border {
        background: #2bc557;
      }
      .list {
        background: #e6f8eb;
      }
    }
  }
  .prompt-icon {
    width: 0.2rem;
    height: 0.2rem;
    text-align: center;
    line-height: 0.2rem;
    border-radius: 0.06rem;
    border: 0.01rem solid #ced3de;
    cursor: pointer;
    .el-icon-plus {
      font-size: 0.12rem;
    }
  }
}
</style>