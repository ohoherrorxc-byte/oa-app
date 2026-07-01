
import purchaseApproval from '@/views/oa/purchaseApproval/components/add'
import budgetApproval from '@/views/oa/budgetApproval/components/add'
import firewall from '@/views/oa/operationApplication/firewall/create'
import deviceInternetAccess from '@/views/oa/operationApplication/deviceInternetAccess/create'
import maintenanceApply from '@/views/oa/assetsApply/maintenanceApply/create'
import receiveApplication from '@/views/oa/assetsApply/receiveApplication/create'
import returnApplication from '@/views/oa/assetsApply/returnApplication/create'
import scrappingApplication from '@/views/oa/assetsApply/scrappingApplication/create'
import storageApplication from '@/views/oa/assetsApply/storageApplication/create'
import maintenanceParts from '@/views/oa/partsApply/maintenanceApply/create'
import receiveParts from '@/views/oa/partsApply/receiveApplication/create'
import returnParts from '@/views/oa/partsApply/returnApplication/create'
import saleContractApplication from '@/views/oa/saleContractApplication/create'
import saleContractChangeApplication from '@/views/oa/saleContractChangeApplication/create'
import scrappingParts from '@/views/oa/partsApply/scrappingApplication/create'
import storageParts from '@/views/oa/partsApply/storageApplication/create'
import saleParts from '@/views/oa/partsApply/saleApply/create'
import purchaseParts from '@/views/oa/partsApply/purchaseApply/create'
import committeeProcurement from '@/views/oa/purchaseManage/generalPurchase/create'
import generalPurchase from '@/views/oa/purchaseManage/generalPurchase/create'
import contractReview from '@/views/oa/purchaseManage/contractReview/create'
import releaseBudget from '@/views/oa/purchaseManage/releaseBudget/create'
import onBusinessTrip from '@/views/oa/financialManagement/onBusinessTrip/create'
import  travelReimbursement from '@/views/oa/financialManagement/travelReimbursement/create'
import cityTraffic from '@/views/oa/financialManagement/cityTraffic/create'
import entryWorkshop from '@/views/oa/personnelManage/entry/create'
import dimission from '@/views/oa/personnelManage/dimission/create'
import workOvertime from '@/views/oa/personnelManage/workOvertime/create'
import cardReplacement from '@/views/oa/personnelManage/cardReplacement/create'
import askForLeave from '@/views/oa/personnelManage/askForLeave/create'
import invoiceApplication from '@/views/oa/invoiceApplication/create'
import saleOrderApplication from '@/views/oa/saleOrderApplication/create'
import invoiceChangeApplication from '@/views/oa/invoiceChangeApplication/create'
import purchaseApplication from '@/views/oa/purchaseApplication/create'
import purchaseCommissionDecisionApplication from '@/views/oa/purchaseCommissionDecisionApplication/create'
import miscellaneousCost from '@/views/oa/financialManagement/miscellaneousCost/create'
import subscriptionApplication from '@/views/oa/subscriptionApplication/create'
import purchaseContractApplication from '@/views/oa/purchaseContractApplication/create'
import trainingApplication from '@/views/oa/personnelManage/trainingApplication/create'
import regularizationApply from '@/views/oa/personnelManage/regularizationApply/create'
import transferSalaryAndPost from '@/views/oa/personnelManage/transferSalaryAndPost/create'
import appOnline from '@/views/oa/operationApplication/appOnline/create'
import tspInterface from '@/views/oa/operationApplication/tspInterface/create'
import tspOnline from '@/views/oa/operationApplication/tspOnline/create'
import businessHospitality from '@/views/oa/financialManagement/businessHospitality/create'
import licensePurchaseContractApplication from '@/views/oa/licensePurchaseContractApplication/create'
import bomPurchaseContractApplication from '@/views/oa/bomPurchaseContractApplication/create'
import bomPurchaseOrderApplication from '@/views/oa/bomPurchaseOrderApplication/create'
import unionFunds from '@/views/oa/financialManagement/unionFunds/create'
import acceptApply from '@/views/oa/acceptApply/create'
import generalContract from '@/views/oa/generalContract/create'
import purchaseContractPayApplication from '@/views/oa/purchaseContractPayApplication/create'
import bomPurchaseContractPayApplication from '@/views/oa/bomPurchaseContractPayApplication/create'
import budgetAdditions from '@/views/oa/budgetAdditions/create'
import invoiceApply from '@/views/oa/invoiceApply/create'
import employeeRenewal from '@/views/oa/personnelManage/employeeRenewal/create'
import internalTransfer from '@/views/oa/financialManagement/internalTransfer/create'
import invoiceUpdate from '@/views/oa/invoiceUpdate/create'
import scrapParts from '@/views/oa/warehouseApply/scrapParts/create'
import storageIn from '@/views/oa/warehouseApply/storageIn/create'
import bomPurchaseApplication from '@/views/oa/bomPurchaseApplication/create'
import appOnline25 from '@/views/oa/operationApplication/appLaunchApply25/create'
import doorAccessControl from '@/views/oa/doorAccessControl/create'
//出入库相关页面
// import scrapParts from '@/views/oa/warehouseApply/scrapParts/create'
// import storageIn from '@/views/oa/warehouseApply/storageIn/create'
import storageOut from '@/views/oa/warehouseApply/storageOut/create'
import subStorageIn from '@/views/oa/warehouseApply/subStorageIn/create'
import subStorageOut from '@/views/oa/warehouseApply/subStorageOut/create'
import transferParts from '@/views/oa/partsApply/transferApplication/create'
import fieldApplication from '@/views/oa/warehouseApply/fieldApplication/create'
import partsPriceMaintenance from "@/views/oa/partsPriceMaintenance/create"
import partsUpdateApply from "@/views/oa/partsUpdateApply/create"
import supplierOrderChange from "@/views/oa/supplierOrderChange/create"
import banknoteApply from "@/views/oa/banknoteApply/create"
import supplierOrderStatus from '@/views/oa/supplierOrderStatus/create'
import supplierOrderSend from "@/views/oa/supplierOrderSend/create"
import bomChangeApply from "@/views/oa/bomChangeApply/create"

export const mixins = {
    components: {
        partsPriceMaintenance,partsUpdateApply,supplierOrderChange,supplierOrderStatus,supplierOrderSend,
        purchaseApproval, budgetApproval,committeeProcurement,generalPurchase,contractReview,releaseBudget,storageOut,subStorageIn,subStorageOut,
        firewall, deviceInternetAccess, maintenanceApply, receiveApplication,generalContract,scrapParts,storageIn,
        returnApplication,saleContractApplication,saleContractChangeApplication, scrappingApplication, storageApplication,
        maintenanceParts,receiveParts,returnParts,scrappingParts,storageParts,miscellaneousCost,invoiceApply,internalTransfer,
        saleParts,purchaseParts,onBusinessTrip,travelReimbursement,cityTraffic,entryWorkshop,dimission,workOvertime,cardReplacement,askForLeave,invoiceApplication,saleOrderApplication,
        invoiceChangeApplication,purchaseApplication,purchaseCommissionDecisionApplication,subscriptionApplication,purchaseContractApplication,
        trainingApplication,regularizationApply,transferSalaryAndPost,unionFunds,acceptApply,budgetAdditions,transferParts,
        appOnline,tspInterface,tspOnline,licensePurchaseContractApplication,bomPurchaseContractApplication,businessHospitality,bomPurchaseOrderApplication,
        purchaseContractPayApplication,bomPurchaseContractPayApplication,employeeRenewal,invoiceUpdate,bomPurchaseApplication,fieldApplication,appOnline25,doorAccessControl,banknoteApply,bomChangeApply
    },
};
