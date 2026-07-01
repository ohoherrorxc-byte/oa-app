// import * as echarts from "echarts";

export const showMonthActiveAmountByYear = (that,echarts) => {
  var chartDom = document.getElementById('monthActiveCountByYearChart');
  // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
  if (!chartDom) return;
  var myChart = echarts.init(chartDom);
  var option;
  option = {
    title: {
      text: that.$t('salesAmountWaterfullBoard.vinCheckData.tboxActivationData'),
    },
    xAxis: {
      type: 'category',
      data: that.licenseMonthByYearX,
      axisLabel: {
        interval: 0,//代表显示所有x轴标签显示
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '激活数',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
        formatter: function (params) {
          return `${that.$formatAmt(params.data, 0)}`
        },
      },
      data: that.licenseMonthByYearY,
    }]
  };
  myChart.setOption(option);
}

export const showCurrentYearActiveAmount = (that,echarts) => {
  var chartDom = document.getElementById('currentYearActiveCountChart');
  // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
  if (!chartDom) return;
  var myChart = echarts.init(chartDom);
  var option;
  option = {
    title: {
      text: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
      subtext: 'Total:' + that.$formatAmt(that.activeTotalCount),
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        var tar = params[1];
        return tar.name + '<br/>' + tar.seriesName + ' : ' + that.$formatAmt(tar.value, 0);
      }
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false
      },
      data: that.licenseCountAndYearX,
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      name: 'Placeholder',
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent'
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        }
      },
      data: that.licenseCountAndYearDis
    },
    {
      name: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
        formatter: function (params) {
          return `${that.$formatAmt(params.value, 0)}`
        }
      },
      data: that.licenseCountAndYearY,
    }
    ]
  };
  myChart.setOption(option);
}

export const showMonthActiveAmount = (that,echarts) => {
  var chartDom = document.getElementById('monthActiveCountChart');
  // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
  if (!chartDom) return;
  var myChart = echarts.init(chartDom);
  var option;
  option = {
    title: {
      text: that.$t('salesAmountWaterfullBoard.vinCheckData.tboxActivationData'),
    },
    xAxis: {
      type: 'category',
      data: that.licenseMonthX
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
      type: 'bar',
      barWidth: '100%',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
        formatter: function (params) {
          return `${that.$formatAmt(params.data, 0)}`
        },
      },
      data: that.licenseMonthY,
    }]
  };
  myChart.setOption(option);
}

export const showActiveDetail = (that,echarts) => {
  var chartDom = document.getElementById('activeDetailChart');
  // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
  if (!chartDom) return;
  var activeDetailChart = echarts.init(chartDom);

  activeDetailChart.setOption({
    title: {
      text: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
      left: 'center',
      subtext: 'Total:' + that.$formatAmt(that.activeTotalCount),
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: "bottom",
    },
    series: [{
      name: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
      type: 'pie',
      radius: '50%',
      data: that.activeAcountList,
      label: {
        show: true, // 显示标签
        formatter: function (params) {
          return `${params.name}:${that.$formatAmt(params.value, 0)}`
        } // 格式化标签内容，{b}表示名称，{c}表示数值，{d}表示百分比
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  });
}

export const showActiveDetailBar = (that,echarts) => {
  var chartDom = document.getElementById('activeDetailBar');
  // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
  if (!chartDom) return;
  var activeDetailChart = echarts.init(chartDom);
  let seriesList = ['未开票','已开票'].map((name, sid) => {
    return {
      name,
      type: 'bar',
      stack: 'total',
      // barWidth: '60%',
      label: {
        show: true,
        formatter: (params) => {
          return `${that.$formatAmt(params.value, 0)}`
        }
      },
      data:that.otherActiveAcountList[sid]
      
    };
  })
  seriesList.push({
      name:"总计",
      type: 'bar',
      stack: 'total',
      itemStyle: {
        color: 'black'  // 设置颜色
      },
      // barWidth: '60%',
      tooltip:{
        trigger:'item',
        formatter: (params) => {
          return `总计：${that.$formatAmt(that.otherActiveAcountList[3][params.dataIndex],0)}`
        }
      },
      label: {
        // rotate: 15,
        show: true,
        formatter: (params) => {
          return [
            '{a|' + `${that.$formatAmt(that.otherActiveAcountList[3][params.dataIndex],0)}` + '}',
            '{b|}'
          ].join('\n')
          // return that.otherActiveAcountList[2][params.dataIndex]
        },
       
        rich: {
          a: {
            color: 'black',
            lineHeight: 10,
            height: 40,
          },
          b: {
            height: 40
          },
        }
      },
      data:that.otherActiveAcountList[2]
  })
  activeDetailChart.setOption({
    title: {
      text: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
      left: 'center',
      subtext: 'Total:' + that.$formatAmt(that.activeTotalCount),
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal', // 设置图例排列为横向
        left: 'left',       // 可以设置图例在容器中的水平位置
        top: 'top', 
    },
    xAxis: {
      axisLabel: {
        interval: 0,//代表显示所有x轴标签显示
        rotate: 45
      },
      type: 'category',
      data: that.activeAcountList.map(ele => ele.name)
    },
    yAxis: {
      type: 'value'
    },
    series:seriesList
    //  [{
    //   name: that.$t('salesAmountWaterfullBoard.vinCheckData.cumulativeActivationCount'),
    //   type: 'bar',
    //   radius: '50%',
    //   data: that.otherActiveAcountList,
    //   label: {
    //     show: true, // 显示标签
    //     // position: 'inner',
    //     // formatter: function (params) {

    //     //   return `${that.$formatAmt(params.value, 0)}`
    //     // }  
    //     // 格式化标签内容，{b}表示名称，{c}表示数值，{d}表示百分比
    //   },
    //   emphasis: {
    //     itemStyle: {
    //       shadowBlur: 10,
    //       shadowOffsetX: 0,
    //       shadowColor: 'rgba(0, 0, 0, 0.5)'
    //     }
    //   }
    // }]
  });
}
