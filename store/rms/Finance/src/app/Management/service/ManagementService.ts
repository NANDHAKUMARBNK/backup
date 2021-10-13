import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ManagementService {

    constructor(private http: HttpClient) { };
    /*=============Affidavit Management Service Start===========*/
    getemailTemplateManagement() {
        return this.http.get('api/lists/finance/affidavit/emailTemplate');
    }
    getParentCustomerManagement() {
        return this.http.get('api/lists/finance/parentCustomer');
    };

    getChildCustomerBasedOnParentId(parentCustomerId) {
        return this.http.get(`api/lists/finance/customer?parentCustomerId=${parentCustomerId}`);
    };

    getDeliveryTypeManagement() {
        return this.http.get('api/lists/finance/deliveryType');
    };
    getContractTypeManagement() {
        return this.http.get('api/lists/finance/contractType');
    };

    getGridManagementList(parentCustomerId, customerId, deliveryTypeId, beginDate, endDate, contractTypeId) {
        return this.http.get(`api/finance/affidavit?parentCustomerId=${parentCustomerId}&customerId=${customerId}&deliveryTypeId=${deliveryTypeId}&beginDate=${beginDate}&endDate=${endDate}&typeId=${contractTypeId}`);
    }
    saveAffidavit(request) {
        return this.http.post('api/finance/affidavit', request);
    }
    /*=============Sales Management Service Start===========*/
    getParentCustomerSalesManagement() {
        return this.http.get('api/lists/finance/parentCustomer');
    };
    getCustomerSalesManagement(parentCustomerId) {
        return this.http.get(`api/lists/finance/customer?parentCustomerId=${parentCustomerId}`);
    };
    getShipSalesManagement() {
        return this.http.get('api/lists/finance/sales/ships');
    };
    getPortSalesManagement(shipId) {
        return this.http.get(`api/lists/finance/sales/ports?shipId=${shipId}`);
    };
    getStatusSalesManagement() {
        return this.http.get('api/lists/finance/sales/status');
    };
    getContractTypeSalesManagement() {
        return this.http.get('api/lists/finance/contractType');
    };
    getGridSalesManagementList(parentCustomerId, customerId, shipId, portId, statusId, startDate, endDate, contractTypeId) {
        return this.http.get(`api/finance/sales?parentCustomerId=${parentCustomerId}&customerId=${customerId}&shipId=${shipId}&portId=${portId}&statusId=${statusId}&startDate=${startDate}&endDate=${endDate}&contractTypeId=${contractTypeId}`);
    };
    getGridSalesManagementListV2(parentCustomerId, customerId, shipId, portId, statusId, startDate, endDate, contractTypeId) {
        return this.http.get(`api/finance/salesV2?parentCustomerId=${parentCustomerId}&customerId=${customerId}&shipId=${shipId}&portId=${portId}&statusId=${statusId}&startDate=${startDate}&endDate=${endDate}&contractTypeId=${contractTypeId}`);
    };
    getTypeSalesGrid() {
        return this.http.get(' api/lists/finance/sales/type');
    };

    salesLockPost(contractSalesId) {
        return this.http.post(`api/finance/lockUserSalesrecord?contractSalesId=${contractSalesId}`, {})
    };

    salesUnlock() {
        return this.http.post(`api/finance/unlockUserSalesrecords`, {})
    }


    updateSales(details) {
        return this.http.post('api/finance/sales', details)
    };

    getSlaesHistory(contractSalesId) {
        return this.http.get(`api/finance/sales/history/summary/${contractSalesId}`);
    };
    getSalesHistoryGrid(contractSalesId) {
        return this.http.get(`api/finance/sales/history/${contractSalesId}`);
    }
    /*=============History Management Service Start===========*/
    getParentCustomerHistoryManagement() {
        return this.http.get('api/lists/finance/ParentCustomer');
    };
    getChildCustomerHistoryManagement(parentCustomerId) {
        return this.http.get(`api/lists/finance/customer?parentCustomerId=${parentCustomerId}`);
    }
    getInvoiceNumberHistoryManagement() {
        return this.http.get('api/lists/InvoiceNumberHistoryManagement');
    };
    // getViewIconInvoiceReport(invoiceId) {
    //     return this.http.get(`api/finance/history/invoice_report?invoiceId=${invoiceId}`);
    // }
    getHistoryResendInvoice(invoiceId) {
        return this.http.get(`api/finance/history/resend/${invoiceId}`);
    }
    updateHistoryResend(body, invoiceId) {
        return this.http.put(`api/finance/history/resend/${invoiceId}`, body);
    }
    getGridHistoryManagementList(parentCustomerid, customerid,invoiceTypeId, rmsInvoiceNum, startDate, endDate) {
        return this.http.get(`api/finance/history?parentCustomerid=${parentCustomerid}&customerid=${customerid}&invoiceTypeId=${invoiceTypeId}&rmsInvoiceNum=${rmsInvoiceNum}&startDate=${startDate}&endDate=${endDate}`);
    }
    /*=============Sales Invoice Management Service Start===========*/
    getParentCustomerSalesInvoiceManagement() {
        return this.http.get('api/lists/finance/ParentCustomer');
    };
    getChildCustomerSalesInvoiceManagement(parentCustomerId) {
        return this.http.get(`api/lists/finance/customer?parentCustomerId=${parentCustomerId}`);
    }
    // previewIconSalesInvoice(customerId) {
    //     return this.http.get(`api/finance/invoice/${customerId}`);
    // }
    getEmailTemplateSalesInvoiceManagement() {
        return this.http.get('api/lists/finance/invoice/emailTemplate');
    }
    getGridSalesInvoiceManagementList(parentCustomerId, customerId,invoiceTypeId, isFlatFeeOnly) {
        return this.http.get(`api/finance/invoice?parentCustomerId=${parentCustomerId}&customerId=${customerId}&invoiceTypeId=${invoiceTypeId}&isFlatFeeOnly=${isFlatFeeOnly}`);
    }
    submitSalesInvoice(request) {
        return this.http.post(' api/finance/invoice', request);
    }
    /************* * AffidavitDetail icons service start********************/
    // getAffidavitDetailsBasedOnlastAffidavitId(lastAffidavitId) {
    //     return this.http.get(`api/finance/affidavit/details/${lastAffidavitId}`);
    // }
    // HistoryIcon NewOne Grid
    getAffidavitDetailsBasedOncontractID(contractId) {
        return this.http.get(`api/finance/affidavit/history?contractId=${contractId}`);
    }
    // ViewSearchIcon NewOne Grid
    getAffidavitDetailsSearchIcon(parentCustomerId, customerId, contractId) {
        return this.http.get(`api/finance/affidavit/view?parentCustomerId=${parentCustomerId}&customerId=${customerId}&contractId=${contractId}`);
    }
    // ViewSearchIcon NewOne CustomerInfo
    getAffidavitDetailsCustomerInfo(parentCustomerId, customerId, contractId) {
        return this.http.get(`api/finance/affidavit/view/cunstomerInfo?parentCustomerId=${parentCustomerId}&customerId=${customerId}&contractId=${contractId}`);
    }

    getAffidavitDetailsBasedOnGpCustomerId(customerId) {
        return this.http.get(`api/finance/affidavit/contract/${customerId}`);
    }
    // getAffidavitDetails(contractId) {
    //     return this.http.get(`api/finance/affidavit/contract/${contractId}`);
    // }
    // HistoryIcon NewOne CustomerInfo
    getAffidavitDetails(contractId) {
        return this.http.get(`api/finance/affidavit/history/cunstomerInfo?contractId=${contractId}`);
    }

    /***********SalesHistory and SalesComment icon service starts*********/
    retrieveSalesHistoryBasedOnContractSalesId(contractSalesId) {
        return this.http.get(`api/lists/${contractSalesId}`);
    }
    retrieveSalesCommentBasedOnContractSalesId(contractSalesId) {
        return this.http.get(`api/lists/${contractSalesId}`);
    }
    /***********History Resend icon service starts*********/
    retrieveHistoryBasedOnId(Id) {
        return this.http.get(`api/lists/${Id}`);
    };
  //getType History Tab
  getType(){
    return this.http.get(`api/lists/finance/history/invoiceType`);
  };
//   getTypeInvoice(){
//     return this.http.get(`api/lists/finance/history/invoiceType`);
//   }
}