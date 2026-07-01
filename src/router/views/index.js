import Layout from '@/page/index/'

export default [{
  path: '/wel',
  component: Layout,
  redirect: '/portal/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "wel-index" */ '@/views/wel/index')
  }, {
    path: 'dashboard',
    name: '控制台',
    meta: {
      i18n: 'dashboard',
      menu: false,
    },
    component: () =>
      import( /* webpackChunkName: "wel-dashboard" */ '@/views/wel/dashboard')
  }]
}, {
  path: '/portal',
  component: Layout,
  redirect: '/portal/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "portal-index" */ '@/views/portal/index')
  }, {
    path: 'vehiclePrepaidCardEdit',
    name: 'Bind a card',
    meta: {
      i18n: 'vehiclePrepaidCardEdit'
    },
    component: () =>
      import( /* webpackChunkName: "portal-vehiclePrepaidCardEdit" */ '@/views/portal/vehiclePrepaidCardEdit')
  }, {
    path: '/saic/license-order-detail',
    name: 'TBOX订单详情',
    meta: {
      i18n: 'license-order-detail'
    },
    component: () =>
      import( /* webpackChunkName: "saic-license-order-detail" */ '@/views/saic/license-order-detail')
  }, {
    path: '/saic/license-bill-detail',
    name: '付款订单详情',
    meta: {
      i18n: 'license-bill-detail'
    },
    component: () =>
      import( /* webpackChunkName: "saic-license-bill-detail" */ '@/views/saic/license-bill-detail')
  }]
},  {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'info'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/system/userinfo')
  }]
}, {
  path: '/work/process/leave',
  component: Layout,
  redirect: '/work/process/leave/form',
  children: [{
    path: 'form/:processDefinitionId',
    name: '请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/form')
  }, {
    path: 'handle/:taskId/:processInstanceId/:businessId',
    name: '处理请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/handle')
  }, {
    path: 'detail/:processInstanceId/:businessId',
    name: '请假流程详情',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/detail')
  }]
},{
    path: '/oa',
    component: Layout,
    redirect: '/oa/homePage/index',
    children: [{
      path: 'homePage/index',
      name: '首页',
      meta: {
        i18n: 'dashboard',
        menu: false,
        keepAlive:false
      },
      component: () =>
        // 首屏页单独拆分，避免与其它 views 路由合并成大 chunk
        import( /* webpackChunkName: "oa-home" */ '@/views/oa/homePage/index')
    }]
  },
  {
    path: '/salesContractDetail',
    component: Layout,
    redirect: '/contract/salesContractDetail',
    children: [{
      path: '/salesContractDetail',
      name: '销售合同详情',
      meta: {
        i18n: 'work',

      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/salesContractDetail')
    }]
  },
 
  {
    path: '/partsMaintSubAdd',
    component: Layout,
    redirect: '/contract/partsMaintSubAdd',
    children: [{
      path: '/partsMaintSubAdd',
      name: '子零件维护申请',
      meta: {
        i18n: 'work'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/partSubMaint/addOrUpdateOrDetail/index')
    }]
  },
   {
    path: '/contractGeneralAdd',
    component: Layout,
    redirect: '/contract/contractGeneralAdd',
    children: [{
      path: '/contractGeneralAdd',
      name: '一般通用采购合同',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/contractGeneralAdd')
    }]
  }, {
    path: '/contractBOMAdd',
    component: Layout,
    redirect: '/contract/contractBOMAdd',
    children: [{
      path: '/contractBOMAdd',
      name: 'BOM及框架采购合同',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/contractBOMAdd')
    }]
  }, {
    path: '/contractPOAdd',
    component: Layout,
    redirect: '/contract/contractPOAdd',
    children: [{
      path: '/contractPOAdd',
      name: '销售PO订单申请',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/contractPOAdd')
    }]
  }, {
    path: '/contractApplicationAdd',
    component: Layout,
    redirect: '/contract/contractApplicationAdd',
    children: [{
      path: '/contractApplicationAdd',
      name: '开票订单申请',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/contractApplicationAdd')
    }]
  }, {
    path: '/contractGeneralBuyAdd',
    component: Layout,
    redirect: '/contract/contractGeneralBuyAdd',
    children: [{
      path: '/contractGeneralBuyAdd',
      name: '一般通用采购合同付款申请',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/contractGeneralBuyAdd')
    }]
  }, {
    path: '/contractBOMBuyAdd',
    component: Layout,
    redirect: '/contract/contractBOMBuyAdd',
    children: [{
      path: '/contractBOMBuyAdd',
      name: 'BOM及框架采购合同付款申请',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/contract/contractBOMBuyAdd')
    }]
  }, 


  
  // {
  //   path: '/myMeetingAdd',
  //   component: Layout,
  //   redirect: '/oa/myMeeting',
  //   children: [{
  //     path: '/myMeetingAdd',
  //     name: '预约会议',
  //     meta: {
  //       i18n: 'work'
  //     },
  //     component: () =>
  //       import( /* webpackChunkName: "views" */ '@/views/oa/myMeeting/addOrUpdateMeeting')
  //   }]
  // }
  {
    path: '/purchaseApproval',
    component: Layout,
    redirect: '/oa/purchaseApproval',
    children: [{
      path: '/purchaseApproval',
      name: '采购合同审批',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flows-purchaseApproval" */ '@/views/oa/purchaseApproval/purchaseApproval')
    }]
  },
  {
    path: '/budgetApproval',
    component: Layout,
    redirect: '/oa/budgetApproval',
    children: [{
      path: '/budgetApproval',
      name: '项目预算审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Project Budget Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-budgetApproval" */ '@/views/oa/budgetApproval/budgetApproval')
    }]
  },
  {
    path: '/budgetAdditions',
    component: Layout,
    redirect: '/oa/budgetAdditions',
    children: [{
      path: '/budgetAdditions',
      name: '预算追加与调整',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Budget Append and Adjustment"
      },
      component: () =>
        import( /* webpackChunkName: "flows-budgetAdditions" */ '@/views/oa/budgetAdditions/index')
    }]
  },
  {
    path: '/firewall',
    component: Layout,
    redirect: '/oa/firewall',
    children: [{
      path: '/firewall',
      name: '防火墙审批单',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flows-firewall" */ '@/views/oa/operationApplication/firewall/index')
    }]
  },
  {
    path: '/tspInterface',
    component: Layout,
    redirect: '/oa/tspInterface',
    children: [{
      path: '/tspInterface',
      name: 'TSP/FOTA接口申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"TSP FOTA Interface Add/Change Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-tspInterface" */ '@/views/oa/operationApplication/tspInterface/index')
    }]
  },
  {
    path: '/tspOnline',
    component: Layout,
    redirect: '/oa/tspOnline',
    children: [{
      path: '/tspOnline',
      name: 'TSP/FOTA上线申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"TSP FOTA Launch Application"
      },
      component: () =>
        import( /* webpackChunkName: "flows-tspOnline" */ '@/views/oa/operationApplication/tspOnline/index')
    }]
  },
  {
    path: '/appOnline',
    component: Layout,
    redirect: '/oa/appOnline',
    children: [{
      path: '/appOnline',
      name: 'app上线申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"App Launch Application"
      },
      component: () =>
        import( /* webpackChunkName: "flows-appOnline" */ '@/views/oa/operationApplication/appOnline/index')
    }]
  },
  {
    path: '/appLaunchApply25',
    component: Layout,
    redirect: '/oa/appLaunchApply25',
    children: [{
      path: '/oa/appLaunchApply25',
      name: 'app上线申请单(25版)',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"App Launch Application(25)"
      },
      component: () =>
        import( /* webpackChunkName: "flows-appLaunchApply25" */ '@/views/oa/operationApplication/appLaunchApply25/index')
    }]
  },
  {
    path: '/deviceInternetAccess',
    component: Layout,
    redirect: '/oa/deviceInternetAccess',
    children: [{
      path: '/deviceInternetAccess',
      name: '设备上网审批单',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flows-deviceInternetAccess" */ '@/views/oa/operationApplication/deviceInternetAccess/index')
    }]
  },
  {
    path: '/maintenanceApply',
    component: Layout,
    redirect: '/oa/maintenanceApply',
    children: [{
      path: '/maintenanceApply',
      name: '资产维护审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Maintenance assets Request'
      },
      component: () =>
        import( /* webpackChunkName: "flows-maintenanceApply" */ '@/views/oa/assetsApply/maintenanceApply/index')
    }]
  },
  {
    path: '/storageApplication',
    component: Layout,
    redirect: '/oa/storageApplication',
    children: [{
      path: '/storageApplication',
      name: '资产入库审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"To Receive Asset Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-storageApplication" */ '@/views/oa/assetsApply/storageApplication/index')
    }]
  },
  {
    path: '/receiveApplication',
    component: Layout,
    redirect: '/oa/receiveApplication',
    children: [{
      path: '/receiveApplication',
      name: '资产领用审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Asset Request Count"
      },
      component: () =>
        import( /* webpackChunkName: "flows-receiveApplication" */ '@/views/oa/assetsApply/receiveApplication/index')
    }]
  },
  {
    path: '/returnApplication',
    component: Layout,
    redirect: '/oa/returnApplication',
    children: [{
      path: '/returnApplication',
      name: '资产归还审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Asset Submit Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-returnApplication" */ '@/views/oa/assetsApply/returnApplication/index')
    }]
  },
  {
    path: '/saleContractApplication',
    component: Layout,
    redirect: '/oa/saleContractApplication',
    children: [{
      path: '/saleContractApplication',
      name: '销售合同审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Sales Contracts"
      },
      component: () =>
        import( /* webpackChunkName: "flows-saleContractApplication" */ '@/views/oa/saleContractApplication/index')
    }]
  },
  {
    path: '/saleContractChangeApplication',
    component: Layout,
    redirect: '/oa/saleContractChangeApplication',
    children: [{
      path: '/saleContractChangeApplication',
      name: '销售合同变更审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Sales Contract Change Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-saleContractChangeApplication" */ '@/views/oa/saleContractChangeApplication/index')
    }]
  },
  {
    path: '/purchaseApplication',
    component: Layout,
    redirect: '/oa/purchaseApplication',
    children: [{
      path: '/purchaseApplication',
      name: '一般通用采购申请',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flows-purchaseApplication" */ '@/views/oa/purchaseApplication/index')
    }]
  },
  {
    path: '/purchaseContractApplication',
    component: Layout,
    redirect: '/oa/purchaseContractApplication',
    children: [{
      path: '/purchaseContractApplication',
      name: '一般通用采购合同评审',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flows-purchaseContractApplication" */ '@/views/oa/purchaseContractApplication/index')
    }]
  },
  {
    path: '/bomPurchaseOrderApplication',
    component: Layout,
    redirect: '/oa/bomPurchaseOrderApplication',
    children: [{
      path: '/bomPurchaseOrderApplication',
      name: 'Bom及框架采购合同订单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"BOM & Framework Procurement Contract Order"
      },
      component: () =>
        import( /* webpackChunkName: "flows-bomPurchaseOrderApplication" */ '@/views/oa/bomPurchaseOrderApplication/index')
    }]
  },
  {
    path: '/purchaseContractPayApplication',
    component: Layout,
    redirect: '/oa/purchaseContractPayApplication',
    children: [{
      path: '/purchaseContractPayApplication',
      name: '一般通用采购合同付款申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'General Purpose Purchase Contract Payment Request'
      },
      component: () =>
        import( /* webpackChunkName: "flows-purchaseContractPayApplication" */'@/views/oa/purchaseContractPayApplication/index')
    }]
  },
  {
    path: '/bomPurchaseContractPayApplication',
    component: Layout,
    redirect: '/oa/bomPurchaseContractPayApplication',
    children: [{
      path: '/bomPurchaseContractPayApplication',
      name: 'BOM及框架采购合同付款',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"BOM & Framework Procurement Contract Order Payment"
      },
      component: () =>
        import(  /* webpackChunkName: "flows-bomPurchaseContractPayApplication" */ '@/views/oa/bomPurchaseContractPayApplication/index')
    }]
  },
  {
    path: '/subscriptionApplication',
    component: Layout,
    redirect: '/oa/subscriptionApplication',
    children: [{
      path: '/subscriptionApplication',
      name: '认款申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Payment Reconciliation Application"
      },
      component: () =>
        import( /* webpackChunkName: "flows-subscriptionApplication" */ '@/views/oa/subscriptionApplication/index')
    }]
  },
  {
    path: '/purchaseCommissionDecisionApplication',
    component: Layout,
    redirect: '/oa/purchaseCommissionDecisionApplication',
    children: [{
      path: '/purchaseCommissionDecisionApplication',
      name: '采购委员会决议申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Purchase Committee Resolution Request'
      },
      component: () =>
        import( /* webpackChunkName: "flows-purchaseCommissionDecisionApplication" */ '@/views/oa/purchaseCommissionDecisionApplication/index')
    }]
  },
  {
    path: '/scrappingApplication',
    component: Layout,
    redirect: '/oa/scrappingApplication',
    children: [{
      path: '/scrappingApplication',
      name: '资产报废审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Scrap Asset Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-scrappingApplication" */ '@/views/oa/assetsApply/scrappingApplication/index')
    }]
  },
  {
    path: '/customFlow',
    component: Layout,
    redirect: '/oa/customFlow',
    children: [{
      path: '/customFlow',
      name: '自定义审批单',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flows-customFlow" */ '@/views/oa/customFlow/customFlow')
    }]
  },
  {
    path: '/maintenanceParts',
    component: Layout,
    redirect: '/oa/maintenanceParts',
    children: [{
      path: '/maintenanceParts',
      name: '零件盘点审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Inventory Reconciliation Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-maintenanceParts" */ '@/views/oa/partsApply/maintenanceApply/index')
    }]
  },
  {
    path: '/storageParts',
    component: Layout,
    redirect: '/oa/storageParts',
    children: [{
      path: '/storageParts',
      name: '零件入库审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Purchase Receipt Request'
      },
      component: () =>
        import( /* webpackChunkName: "flows-storageParts" */ '@/views/oa/partsApply/storageApplication/index')
    }]
  },
  {
    path: '/partsPriceMaintenance',
    component: Layout,
    redirect: '/oa/partsPriceMaintenance',
    children: [{
      path: '/partsPriceMaintenance',
      name: '零件价格维护',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Parts Price Maintenance'
      },
      component: () =>
        import( /* webpackChunkName: "flows-partsPriceMaintenance" */ '@/views/oa/partsPriceMaintenance/index')
    }]
  },
  {
    path: '/supplierOrderChange',
    component: Layout,
    redirect: '/oa/supplierOrderChange',
    children: [{
      path: '/supplierOrderChange',
      name: '供应商订单变更',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Supplier Order Change'
      },
      component: () =>
        import( /* webpackChunkName: "flows-supplierOrderChange" */ '@/views/oa/supplierOrderChange/index')
    }]
  },
  {
    path: '/supplierOrderSend',
    component: Layout,
    redirect: '/oa/supplierOrderSend',
    children: [{
      path: '/supplierOrderSend',
      name: '供应商订单发送',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Supplier Order Send'
      },
      component: () =>
        import( /* webpackChunkName: "flows-supplierOrderSend" */ '@/views/oa/supplierOrderSend/index')
    }]
  },
  {
    path: '/supplierOrderStatus',
    component: Layout,
    redirect: '/oa/supplierOrderStatus',
    children: [{
      path: '/supplierOrderStatus',
      name: '供应商订单状态',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Supplier Order Status'
      },
      component: () =>
        import( /* webpackChunkName: "flows-supplierOrderStatus" */ '@/views/oa/supplierOrderStatus/index')
    }]
  },

  {
    path: '/partsUpdateApply',
    component: Layout,
    redirect: '/oa/partsUpdateApply',
    children: [{
      path: '/partsUpdateApply',
      name: '零件工程变更',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Parts Update Apply'
      },
      component: () =>
        import( /* webpackChunkName: "flows-partsUpdateApply" */ '@/views/oa/partsUpdateApply/index')
    }]
  },
  {
    path: '/partsTransfer',
    component: Layout,
    redirect: '/oa/partsTransfer',
    children: [{
      path: '/partsTransfer',
      name: '零件转让审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Purchase Transfer Request'
      },
      component: () =>
        import( /* webpackChunkName: "flows-partsTransfer" */ '@/views/oa/partsApply/transferApplication/index')
    }]
  },
  {
    path: '/receiveParts',
    component: Layout,
    redirect: '/oa/receiveParts',
    children: [{
      path: '/receiveParts',
      name: '零件领用审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Receive Part Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-receiveParts" */ '@/views/oa/partsApply/receiveApplication/index')
    }]
  },
  {
    path: '/returnParts',
    component: Layout,
    redirect: '/oa/returnParts',
    children: [{
      path: '/returnParts',
      name: '零件归还审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Return Part Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-returnParts" */ '@/views/oa/partsApply/returnApplication/index')
    }]
  },
  {
    path: '/scrappingParts',
    component: Layout,
    redirect: '/oa/scrappingParts',
    children: [{
      path: '/scrappingParts',
      name: '零件报废审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Scrap Part Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-scrappingParts" */ '@/views/oa/partsApply/scrappingApplication/index')
    }]
  },
  {
    path: '/saleParts',
    component: Layout,
    redirect: '/oa/saleParts',
    children: [{
      path: '/saleParts',
      name: '零件销售订单审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:''
      },
      component: () =>
        import( /* webpackChunkName: "flows-saleParts" */ '@/views/oa/partsApply/saleApply/index')
    }]
  },
  {
    path: '/purchaseParts',
    component: Layout,
    redirect: '/oa/purchaseParts',
    children: [{
      path: '/purchaseParts',
      name: '零件采购订单审批单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:''
      },
      component: () =>
        import( /* webpackChunkName: "flows-purchaseParts" */ '@/views/oa/partsApply/purchaseApply/index')
    }]
  },
  {
    path: '/generalPurchase',
    component: Layout,
    redirect: '/oa/generalPurchase',
    children: [{
      path: '/generalPurchase',
      name: '一般通用采购申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'General Purpose Purchase Contract Request'
      },
      component: () =>
        import( /* webpackChunkName: "flows-generalPurchase" */ '@/views/oa/purchaseManage/generalPurchase/index')
    }]
  },
  {
    path: '/committeeProcurement',
    component: Layout,
    redirect: '/oa/committeeProcurement',
    children: [{
      path: '/committeeProcurement',
      name: '采购委员会决议申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Purchase Committee Resolution Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-committeeProcurement" */ '@/views/oa/purchaseManage/committeeProcurement/index')
    }]
  },{
    path: '/contractReview',
    component: Layout,
    redirect: '/oa/contractReview',
    children: [{
      path: '/contractReview',
      name: '一般通用采购合同付款申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"General Purpose Purchase Contract Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flows-contractReview" */ '@/views/oa/purchaseManage/contractReview/index')
    }]
  },
  {
    path: '/releaseBudget',
    component: Layout,
    redirect: '/oa/releaseBudget',
    children: [{
      path: '/releaseBudget',
      name: '预算释放申请',
      meta: {
        i18n: 'work',
        keepAlive:true,

      },
      component: () =>
        import( /* webpackChunkName: "flows-releaseBudget" */ '@/views/oa/purchaseManage/releaseBudget/index')
    }]
  },
  {
    path: '/onBusinessTrip',
    component: Layout,
    redirect: '/oa/onBusinessTrip',
    children: [{
      path: '/onBusinessTrip',
      name: '因公出差申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Business Trip Application'
      },
      component: () =>
        import( /* webpackChunkName: "flows-onBusinessTrip" */ '@/views/oa/financialManagement/onBusinessTrip/index')
    }]
  },
  {
    path: '/travelReimbursement',
    component: Layout,
    redirect: '/oa/travelReimbursement',
    children: [{
      path: '/travelReimbursement',
      name: '差旅报销申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Travel and Expense Claim"
      },
      component: () =>
        import( /* webpackChunkName: "flows-travelReimbursement" */ '@/views/oa/financialManagement/travelReimbursement/index')
    }]
  },
  {
    path: '/cityTraffic',
    component: Layout,
    redirect: '/oa/cityTraffic',
    children: [{
      path: '/cityTraffic',
      name: '市内交通费用报销',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Downtown Transportation Expenses Claim'
      },
      component: () =>
        import( /* webpackChunkName: "flows-cityTraffic" */ '@/views/oa/financialManagement/cityTraffic/index')
    }]
  },
  {
    path: '/internalTransfer',
    component: Layout,
    redirect: '/oa/internalTransfer',
    children: [{
      path: '/internalTransfer',
      name: '公司内部划款',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Request Form For Internal Transfer'
      },
      component: () =>
        import( /* webpackChunkName: "flows-internalTransfer" */ '@/views/oa/financialManagement/internalTransfer/index')
    }]
  },
  {
    path: '/businessHospitality',
    component: Layout,
    redirect: '/oa/businessHospitality',
    children: [{
      path: '/businessHospitality',
      name: '业务招待费用报销',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Business Banquet and Expense Claim"
      },
      component: () =>
        import( /* webpackChunkName: "flow-businessHospitality" */ '@/views/oa/financialManagement/businessHospitality/index')
    }]
  },
  {
    path: '/cityTraffic',
    component: Layout,
    redirect: '/oa/cityTraffic',
    children: [{
      path: '/cityTraffic',
      name: '市内交通费用报销',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Downtown Transportation Expenses Claim"
      },
      component: () =>
        import( /* webpackChunkName: "flow-cityTraffic" */ '@/views/oa/financialManagement/cityTraffic/index')
    }]
  },
  {
    path: '/unionFunds',
    component: Layout,
    redirect: '/oa/unionFunds',
    children: [{
      path: '/unionFunds',
      name: '工会经费使用申请表',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Labor Union Grant Application Form"
      },
      component: () =>
        import( /* webpackChunkName: "flow-unionFunds" */ '@/views/oa/financialManagement/unionFunds/index')
    }]
  },
  {
    path: '/entryWorkshop',
    component: Layout,
    redirect: '/oa/entryWorkshop',
    children: [{
      path: '/entryWorkshop',
      name: '人员入职申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Employee Boarding Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-entry" */ '@/views/oa/personnelManage/entry/index')
    }]
  },
  {
    path: '/dimission',
    component: Layout,
    redirect: '/oa/dimission',
    children: [{
      path: '/dimission',
      name: '人员离职申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Employee Exit Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-dimission" */ '@/views/oa/personnelManage/dimission/index')
    }]
  },
  {
    path: '/workOvertime',
    component: Layout,
    redirect: '/oa/workOvertime',
    children: [{
      path: '/workOvertime',
      name: '加班申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Allow Overtime'
      },
      component: () =>
        import( /* webpackChunkName: "flow-workOvertime" */ '@/views/oa/personnelManage/workOvertime/index')
    }]
  },
  {
    path: '/cardReplacement',
    component: Layout,
    redirect: '/oa/cardReplacement',
    children: [{
      path: '/cardReplacement',
      name: '补卡申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Attendance make-up'
      },
      component: () =>
        import( /* webpackChunkName: "flow-cardReplacement" */ '@/views/oa/personnelManage/cardReplacement/index')
    }]
  },
  {
    path: '/askForLeave',
    component: Layout,
    redirect: '/oa/askForLeave',
    children: [{
      path: '/askForLeave',
      name: '请假申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Apply / Approve Leaves"
      },
      component: () =>
        import( /* webpackChunkName: "flow-askForLeave" */ '@/views/oa/personnelManage/askForLeave/index')
    }]
  },
  {
    path: '/employeeRenewal',
    component: Layout,
    redirect: '/oa/employeeRenewal',
    children: [{
      path: '/employeeRenewal',
      name: '员工续签申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Employee Renewal Application"
      },
      component: () =>
        import( /* webpackChunkName: "flow-employeeRenewal" */ '@/views/oa/personnelManage/employeeRenewal/index')
    }]
  },
  {
    path: '/trainingApplication',
    component: Layout,
    redirect: '/oa/trainingApplication',
    children: [{
      path: '/trainingApplication',
      name: '培训申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Training Application"
      },
      component: () =>
        import( /* webpackChunkName: "flow-trainingApplication" */ '@/views/oa/personnelManage/trainingApplication/index')
    }]
  },
  {
    path: '/regularizationApply',
    component: Layout,
    redirect: '/oa/regularizationApply',
    children: [{
      path: '/regularizationApply',
      name: '转正申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Employee Transfer Application"
      },
      component: () =>
        import( /* webpackChunkName: "flow-regularizationApply" */ '@/views/oa/personnelManage/regularizationApply/index')
    }]
  },
  {
    path: '/transferSalaryAndPost',
    component: Layout,
    redirect: '/oa/transferSalaryAndPost',
    children: [{
      path: '/transferSalaryAndPost',
      name: '调薪调岗申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Employee Transfer and Salary Adjustment Application"
      },
      component: () =>
        import( /* webpackChunkName: "flow-transferSalaryAndPost" */ '@/views/oa/personnelManage/transferSalaryAndPost/index')
    }]
  },
  {
    path: '/invoiceApplication',
    component: Layout,
    redirect: '/oa/invoiceApplication',
    children: [{
      path: '/invoiceApplication',
      name: '开票申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Invoice Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-invoice" */ '@/views/billManage/poOrder/invoice')
    }]
  },
  {
    path: '/invoiceApply',
    component: Layout,
    redirect: '/oa/invoiceApply',
    children: [{
      path: '/invoiceApply',
      name: '发票申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Invoice Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-invoiceApply" */ '@/views/oa/invoiceApply/index')
    }]
  },
  {
    path: '/saleOrderApplication',
    component: Layout,
    redirect: '/oa/saleOrderApplication',
    children: [{
      path: '/saleOrderApplication',
      name: '销售PO订单申请',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flow-saleOrderApplication" */ '@/views/oa/saleOrderApplication/index')
    }]
  },
  {
    path: '/invoiceChangeApplication',
    component: Layout,
    redirect: '/oa/invoiceChangeApplication',
    children: [{
      path: '/invoiceChangeApplication',
      name: '开票变更申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Billing Change Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-invoiceChangeApplication" */ '@/views/oa/invoiceChangeApplication/index')
    }]
  },
  {
    path: '/invoiceUpdate',
    component: Layout,
    redirect: '/oa/invoiceUpdate',
    children: [{
      path: '/invoiceUpdate',
      name: '开票变更申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Billing Change Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-invoiceUpdate" */ '@/views/oa/invoiceUpdate/index')
    }]
  },
  {
    path: '/miscellaneousCost',
    component: Layout,
    redirect: '/oa/miscellaneousCost',
    children: [{
      path: '/miscellaneousCost',
      name: '零星费用申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-miscellaneousCost" */ '@/views/oa/financialManagement/miscellaneousCost/index')
    }]
  },
  {
    path: '/salaryPayment',
    component: Layout,
    redirect: '/oa/salaryPayment',
    children: [{
      path: '/salaryPayment',
      name: '支付申请-薪资支付',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-salaryPayment" */ '@/views/oa/financialManagement/miscellaneousCost/salaryPayment')
    }]
  },
  {
    path: '/monthlyFinancialPayment',
    component: Layout,
    redirect: '/oa/monthlyFinancialPayment',
    children: [{
      path: '/monthlyFinancialPayment',
      name: '支付申请-财务月度支付',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-monthlyFinancialPayment" */ '@/views/oa/financialManagement/miscellaneousCost/monthlyFinancialPayment')
    }]
  },
  {
    path: '/nonContractualPayment',
    component: Layout,
    redirect: '/oa/nonContractualPayment',
    children: [{
      path: '/nonContractualPayment',
      name: '支付申请-无合同支付',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-nonContractualPayment" */ '@/views/oa/financialManagement/miscellaneousCost/nonContractualPayment')
    }]
  },
  {
    path: '/otherPayment',
    component: Layout,
    redirect: '/oa/otherPayment',
    children: [{
      path: '/otherPayment',
      name: '报销-其他',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-otherPayment" */ '@/views/oa/financialManagement/miscellaneousCost/otherPayment')
    }]
  },
  {
    path: '/trainPayment',
    component: Layout,
    redirect: '/oa/trainPayment',
    children: [{
      path: '/trainPayment',
      name: '报销-培训费',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-trainPayment" */ '@/views/oa/financialManagement/miscellaneousCost/trainPayment')
    }]
  },
  {
    path: '/welfarePayment',
    component: Layout,
    redirect: '/oa/welfarePayment',
    children: [{
      path: '/welfarePayment',
      name: '报销-车贴/探亲费/通讯费',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-welfarePayment" */ '@/views/oa/financialManagement/miscellaneousCost/welfarePayment')
    }]
  },
  {
    path: '/banknoteApply',
    component: Layout,
    redirect: '/oa/banknoteApply',
    children: [{
      path: '/banknoteApply',
      name: '银票贴现业务审批申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Attendance make-up'
      },
      component: () =>
        import( /* webpackChunkName: "flow-banknoteApply" */ '@/views/oa/banknoteApply')
    }]
  },
  {
    path: '/conferencePayment',
    component: Layout,
    redirect: '/oa/conferencePayment',
    children: [{
      path: '/conferencePayment',
      name: '报销-会议费',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Piecemeal Fee Payment Request"
      },
      component: () =>
        import( /* webpackChunkName: "flow-conferencePayment" */ '@/views/oa/financialManagement/miscellaneousCost/conferencePayment')
    }]
  },
  {
    path: '/wageList/detail',
    component: Layout,
    redirect: '/oa/wageList/detail',
    children: [{
      path: '/wageList/detail',
      name: '工资数据管理卡片',
      meta: {
        i18n: 'work',
        keepAlive:false,
        alias:''
      },
      component: () =>
        import( /* webpackChunkName: "flow-wageListDetail" */ '@/views/oa/payrollManagement/wageList/detail/index')
    }]
  },
  {
    path: '/yearEndBonus/detail',
    component: Layout,
    redirect: '/oa/yearEndBonus/detail',
    children: [{
      path: '/yearEndBonus/detail',
      name: '年终奖数据管理',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "flow-yearEndBonusDetail" */ '@/views/oa/payrollManagement/yearEndBonus/detail/index')
    }]
  },
  {
    path: '/annualEmployeeSalary/detail',
    component: Layout,
    redirect: '/oa/annualEmployeeSalary/detail',
    children: [{
      path: '/annualEmployeeSalary/detail',
      name: '年终奖数据管理',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "flow-annualEmployeeSalaryDetail" */ '@/views/oa/payrollManagement/annualEmployeeSalary/detail/index')
    }]
  },
  {
    path: '/budgetRelease',
    component: Layout,
    redirect: '/oa/budgetRelease',
    children: [{
      path: '/budgetRelease',
      name: '预算释放申请',
      meta: {
        i18n: 'work',
        keepAlive:true
      },
      component: () =>
        import( /* webpackChunkName: "flow-budgetRelease" */ '@/views/oa/budgetManagement/budgetRelease/index')
    }]
  },
  {
    path: '/acceptApply',
    component: Layout,
    redirect: '/oa/acceptApply',
    children: [{
      path: '/acceptApply',
      name: '验收申请单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Acceptance Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-acceptApply" */ '@/views/oa/acceptApply/index')
    }]
  },
  {
    path: '/budgetAdditional',
    component: Layout,
    redirect: '/oa/budgetAdditional',
    children: [{
      path: '/budgetAdditional',
      name: '预算追加与调整',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Budget Append and Adjustment'
      },
      component: () =>
        import( /* webpackChunkName: "flow-budgetAdditional" */ '@/views/oa/budgetManagement/budgetAdditional/index')
    }]
  },
  {
    path: '/licensePurchaseContractApplication',
    component: Layout,
    redirect: '/oa/licensePurchaseContractApplication',
    children: [{
      path: '/licensePurchaseContractApplication',
      name: 'License数据核对验收单',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"Activated Licence Quantity Reconciliation and Acceptance"
      },
      component: () =>
        import( /* webpackChunkName: "flow-licensePurchaseContractApplication" */ '@/views/oa/licensePurchaseContractApplication/index')
    }]
  },
  {
    path: '/bomPurchaseContractApplication',
    component: Layout,
    redirect: '/oa/bomPurchaseContractApplication',
    children: [{
      path: '/bomPurchaseContractApplication',
      name: 'BOM及框架采购合同评审',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"BOM & Framework Procurement Contract Order Review"
      },
      component: () =>
        import( /* webpackChunkName: "flow-bomPurchaseContractApplication" */ '@/views/oa/bomPurchaseContractApplication/index')
    }]
  },
  {
    path: '/generalContract',
    component: Layout,
    redirect: '/oa/generalContract',
    children: [{
      path: '/generalContract',
      name: '一般通用采购合同付款申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'General Purpose Purchase Contract Payment Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-generalContract" */ '@/views/oa/generalContract/index')
    }]
  },
  {
    path: '/newsBulletin/list',
    component: Layout,
    redirect: '/oa/newsBulletin/list',
    children: [{
      path: '/newsBulletin/list',
      name: '公司新闻列表',
      meta:{
        alias:"Corporate News"
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/oa/newsBulletin/list')
    }]
  },
  {
    path: '/newsBulletin/addorupdate',
    component: Layout,
    redirect: '/oa/newsBulletin/addorupdate',
    children: [{
      path: '/newsBulletin/addorupdate',
      name: '添加公司新闻',
      meta:{
        alias:"Add Corporate News"
      },
      component: () =>
        import('@/views/oa/newsBulletin/addorupdate')
    }]
  },
  {
    path: '/newsBulletin/details',
    component: Layout,
    redirect: '/oa/newsBulletin/details',
    children: [{
      path: '/newsBulletin/details',
      name: '公司新闻详情',
      meta:{
        alias:"Corporate News Details"
      },
      component: () =>
        import('@/views/oa/newsBulletin/details')
    }]
  },
  {
    path: '/orderManageAdd',
    component: Layout,
    redirect: '/substitute/orderManageAdd',
    children: [{
      path: '/orderManageAdd',
      name: '订单管理',
      meta: {
        i18n: 'work',
        keepAlive:false,
        alias:'Orders'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/substitute/orderManage/addOrUpdate')
    }]
  },
  {
    path: '/assetsDetail',
    component: Layout,
    redirect: '/assetManagement/assetsDetail',
    children: [{
      path: '/assetsDetail',
      name: '资产详情',
      meta: {
        i18n: 'work',
        keepAlive:false,
        alias:""
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/oa/assetManagement/assetsDetail')
    }]
  },
  {
    path: '/partsDetails',
    component: Layout,
    redirect: '/partsManagement/partsDetails',
    children: [{
      path: '/partsDetails',
      name: '零件详情',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/oa/partsManagement/partsDetails')
    }]
  },
  {
    path: '/warehouseScrapParts',
    component: Layout,
    redirect: '/oa/warehouseScrapParts',
    children: [{
      path: '/warehouseScrapParts',
      name: '子零件报废',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Maintenance assets Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-scrapParts" */ '@/views/oa/warehouseApply/scrapParts/index')
    }]
  },
  {
    path: '/warehouseScrapParts',
    component: Layout,
    redirect: '/oa/warehouseScrapParts',
    children: [{
      path: '/warehouseScrapParts',
      name: '',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Maintenance assets Request'
      },
      component: () =>
        import( /* webpackChunkName: "flow-scrapParts" */ '@/views/oa/warehouseApply/scrapParts/index')
    }]
  },
  {
    path: '/fieldApplication',
    component: Layout,
    redirect: '/oa/fieldApplication',
    children: [{
      path: '/fieldApplication',
      name: '计划外领料',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "flow-fieldApplication" */ '@/views/oa/warehouseApply/fieldApplication/index')
    }]
  },
  {
    path: '/warehouseStorageOut',
    component: Layout,
    redirect: '/oa/warehouseStorageOut',
    children: [{
      path: '/warehouseStorageOut',
      name: '供应链总成零件出库通知',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "flow-storageOut" */ '@/views/oa/warehouseApply/storageOut/index')
    }]
  },
  {
    path: '/warehouseSubStorageIn',
    component: Layout,
    redirect: '/oa/warehouseSubStorageIn',
    children: [{
      path: '/warehouseSubStorageIn',
      name: '供应链子零件入库通知',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "flow-subStorageIn" */ '@/views/oa/warehouseApply/subStorageIn')
    }]
  },
  {
    path: '/warehouseSubStorageOut',
    component: Layout,
    redirect: '/oa/warehouseSubStorageOut',
    children: [{
      path: '/warehouseSubStorageOut',
      name: '供应链子零件出库通知',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "flow-subStorageOut" */ '@/views/oa/warehouseApply/subStorageOut')
    }]
  },
  {
    path: '/lightCtrlOperationRecords',
    component: Layout,
    redirect: '/oa/lightCtrlOperationRecords',
    children: [{
      path: '/lightCtrlOperationRecords',
      name: '远程灯控',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "lightCtrl" */ '@/views/oa/lightctrl/lightCtrlOperationRecords')
    }]
  },
  {
    path: '/lightCtrlSchedules',
    component: Layout,
    redirect: '/oa/lightCtrlSchedules',
    children: [{
      path: '/lightCtrlSchedules',
      name: '灯控定时',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "lightCtrl" */ '@/views/oa/lightctrl/lightCtrlSchedules')
    }]
  },
  {
    path: '/lightCtrlAreaDeviceMap',
    component: Layout,
    redirect: '/oa/lightCtrlAreaDeviceMap',
    children: [{
      path: '/lightCtrlAreaDeviceMap',
      name: '远程灯控',
      meta: {
        i18n: 'work',
        keepAlive:false
      },
      component: () =>
        import( /* webpackChunkName: "lightCtrl" */ '@/views/oa/lightctrl/lightCtrlAreaDeviceMap')
    }]
  },
  {
    path: '/app_privacy',
    name: 'PrivacyPolicy',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/oa/mobileApp/appPrivacyPolicy'),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/app_download',
    name: 'appDownload',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/oa/mobileApp/appDownload'),
    meta: {
      keepAlive: false,
      isTab: false,
      isAuth: true
    }
  },
  {
    path: '/bomPurchaseApplication',
    component: Layout,
    redirect: '/oa/bomPurchaseApplication',
    children: [{
      path: '/bomPurchaseApplication',
      name: '框架采购申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"BOM & Framework Procurement Contract Order Review"
      },
      component: () =>
        import( /* webpackChunkName: "flow-bomPurchaseApplication" */ '@/views/oa/bomPurchaseApplication/index')
    }]
  },
  {
    path: '/doorAccessControlApply',
    component: Layout,
    redirect: '/oa/doorAccessControlApply',
    children: [
      {
        path: '',
        name: '门禁权限申请单',
        meta: {
          i18n: 'work', // 用于国际化，标识该路由相关翻译的key
          keepAlive: true, // 启用组件缓存，提升切换性能
          alias: 'DoorAccessControlApply' // 路由别名，可通过此别名访问
        },
        // 动态导入组件，按需加载，减小初始打包体积
        component: () => import(/* webpackChunkName: "views" */ '@/views/oa/doorAccessControl/index')
      }
    ]
  },
  {
    path: '/workReport/index',
    component: Layout,
    redirect: '/oa/workReport',
    children: [{
      path: '/workReport',
      name: '工作报表',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:"BOM & Framework Procurement Contract Order Review"
      },
      component: () =>
        import( /* webpackChunkName: "flow-bomPurchaseApplication" */ '@/views/oa/workReport/index')
    }]
  },
  {
    path: '/bomChangeApply',
    component: Layout,
    redirect: '/oa/bomChangeApply',
    children: [{
      path: '/bomChangeApply',
      name: 'BOM框架合同上限调整申请',
      meta: {
        i18n: 'work',
        keepAlive:true,
        alias:'Attendance make-up'
      },
      component: () =>
        import( /* webpackChunkName: "flow-banknoteApply" */ '@/views/oa/bomChangeApply')
    }]
  },
]
