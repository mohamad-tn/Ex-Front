import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {SyncAutoCompleteModel, SyncButtonModel, SyncDropdownlistModel, SyncNumericTextBoxModel, SyncTextBoxModel} from '@shared/user-interface/dropdownlist/sync-models' 
import { AppComponentBase } from "@shared/app-component-base";
import {
  ClientServiceProxy,
  CompanyBalanceWithCurrencyDto,
  CompanyDto,
  CompanyServiceProxy,
  CurrencyServiceProxy,
  CustomerDto,
  CustomerServiceProxy,
  IncomeTransferDetailDto,
  IncomeTransferDto,
  IncomeTransferServiceProxy,
} from "@shared/service-proxies/service-proxies";
import {
  AutoComplete,
  ChangeEventArgs,
  DropDownList,
  DropDownListComponent,
} from "@syncfusion/ej2-angular-dropdowns";
import {
  NumericTextBox
} from "@syncfusion/ej2-angular-inputs";
import { EmitType, getInstance } from "@syncfusion/ej2-base";
import { Button } from "@syncfusion/ej2-angular-buttons";
import { finalize } from 'rxjs/operators';
import { ValidationResult } from "@shared/helpers/ValidationResult";
import { L10n, setCulture, loadCldr } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { NbDialogService } from "@nebular/theme";
import { SearchIncomeTransferComponent } from "../search-income-transfer/search-income-transfer.component";

setCulture('en-US');
L10n.load(LocalizationHelper.getArabicResources());

@Component({
  selector: "app-income-transfer",
  templateUrl: "./edit-income-transfer.component.html",
  styleUrls: ["./edit-income-transfer.component.scss"],
})
export class EditIncomeTransferComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit
{
  @ViewChild('companyIdEl') public companyDropDownList: DropDownListComponent;
  @ViewChild("tblBody", { read: ViewContainerRef }) tblBody;
  date: Date = new Date();
  paymentTypes: { [key: string]: any }[] = [];
  currencies: { [key: string]: any }[] = [];
  customers: { [key: string]: any }[] = [];
  clients: { [key: string]: any }[] = [];
  companies: CompanyDto[] = [];
  public fields: Object = { text: 'name', value: 'id' };
  public index = 0;
  companyBalances: CompanyBalanceWithCurrencyDto[] = [];
  public incomeTransfer: IncomeTransferDto = new IncomeTransferDto();
  searchResult: IncomeTransferDto[] = [];
  saving = false;

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _router: Router,
    private _modalService: NbDialogService,
    private _currenyService: CurrencyServiceProxy,
    private _customerService: CustomerServiceProxy,
    private _companyService: CompanyServiceProxy,
    private _clientService: ClientServiceProxy,
    private _incomeTransferService: IncomeTransferServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.incomeTransfer.incomeTransferDetails = [];
    this.paymentTypes = [
      { id: 0, name: this.l("Cash") },
      { id: 1, name: this.l("Client") },
      { id: 2, name: this.l("Company") },
    ];

    this.initialCurrencies();
    this.initialCustomers();
    this.initialClients();
    this.initialCompanies();
    
  }

  ngAfterViewInit() {
    //this.generateRow(0);
  }

  initialIncomeTransfers(){
    let routeData = this._route.snapshot.params;
    let faxNumber = routeData?.number == 'undefined' ? undefined : routeData?.number;
    let companyId = routeData?.companyId == 'undefined' ? undefined : routeData?.companyId;
    if(companyId == undefined && faxNumber == undefined){
      this._router.navigateByUrl('/app/transfer/create-income-transfer');
    }
    
    this._incomeTransferService.getForEdit(routeData?.fromDate, routeData?.toDate, companyId, faxNumber)
    .subscribe(result =>{
      this.searchResult = result;
      this.initialIncomeData(0);
    });
  }

  initialIncomeData(index){
    
    this.incomeTransfer = this.searchResult[index];
    this.incomeTransfer.companyId = this.searchResult[index].companyId;
    //this.date = new Date(this.searchResult[index].date);
    console.log(this.searchResult[index].date);
    var dateMomentObject = moment(this.searchResult[index].date, "dd/MM/yyyy hh:mm:ss").toISOString(); 
    console.log(dateMomentObject);
    //this.date = dateMomentObject.toDate(); 
    //let c = dateMomentObject.year;
    this.date = this.getDateFromString(this.searchResult[index].date);
    console.log(this.date);
    let count = this.searchResult[index].incomeTransferDetails.length;
    this.removeAllRows();
    for(let i = 0; i < count; i++){
      this.generateRow(i, this.searchResult[index].incomeTransferDetails[i]);
    }
    
  }
  getIncomeTransferByIndex(position, args){
    if(args){
      this.index = position;
      this.initialIncomeData(position);
    }
  }
  
  //-----------------------------------------
  // initail datasources
  initialCurrencies() {
    this._currenyService.getAll().subscribe((result) => {
      result.forEach((currency) => {
        this.currencies.push({ id: currency.id, name: currency.name });
      });
    });
  }

  initialCustomers() {
    this._customerService.getAll().subscribe((result) => {
      result.forEach((customer) => {
        this.customers.push({ id: customer.id, name: customer.name, phoneNumber: customer.phoneNumber });
      });
    });
  }

  initialClients() {
    this._clientService.getAll().subscribe((result) => {
      result.forEach((client) => {
        this.clients.push({ id: client.id, name: client.name });
      });
    });
  }

  initialCompanies() {
    this._companyService.getAll().subscribe((result) => {
      //this.fromCompanies = result;
      this.companies = result;
      // result.forEach((company) => {
      //   this.companies.push({ id: company.id, name: company.name });
      // });
      this.initialIncomeTransfers();
    });
  }

  // Generate Row
  generateRow(index, data) {
    let tblBody = document.getElementById("tblBody");

    tblBody.append;
    let detailId = 0;
    if(data != undefined){
      detailId = data['id'];
    }
    let tr = this.generateTr(index, detailId);

    //Currency
    let tdCurrency = this.generateTd("currency-" + index);
    let currencyModel = new SyncDropdownlistModel({
      parentEle: tdCurrency,
      index: index,
      propName: "currency",
      datasource: this.currencies,
      onChangeHandler: this.onchangeCurrency,
      placeholder: this.l("Currency"),
    });
    if(data != undefined){
      currencyModel.value = data.currencyId;
    }
      
    this.generateDropdownlist(currencyModel);
    tr.append(tdCurrency);

    //Amount
    let tdAmount = this.generateTd("amount-" + index);
    let amountModel = new SyncNumericTextBoxModel({
      index: index,
      propName: "amount",
      parentEle: tdAmount,
      placeholder: this.l("Amount"),
      onChangeHandler: this.onchangeAmount
    });
    if(data != undefined){
      amountModel.value = data.amount;
    }
    
    this.generateNumeric(amountModel);
    tr.append(tdAmount);

    //Commission
    let tdCommission = this.generateTd("commission-" + index);
    let commissionModel = new SyncNumericTextBoxModel({
      index: index,
      propName: "commission",
      parentEle: tdCommission,
      placeholder: this.l("Commission"),
      onChangeHandler: this.onchangeCommission
    });
    if(data != undefined){
      commissionModel.value = data.commission;
    }
    this.generateNumeric(commissionModel);
    tr.append(tdCommission);

    //Percentage
    let tdPercentage = this.generateTd("percentage-" + index);
    let percentageModel = new SyncNumericTextBoxModel({
      index: index,
      propName: "percentage",
      parentEle: tdPercentage,
      placeholder: this.l("Percentage"),
      onChangeHandler: this.onchangePersentege
    });
    if(data != undefined){
      percentageModel.value = data.amount ? ((100 * data.commission) / data.amount) : 0;
    }
    this.generateNumeric(percentageModel);
    tr.append(tdPercentage);

    //Sender
    let tdSender = this.generateTd("sender-" + index, '500');
    let senderParentDiv = this.generateِDiv(tdSender, "row");
    let senderDiv = this.generateِDiv(senderParentDiv, "col-md-6");
    var sender = this.customers.find(x=>x.id == data?.senderId);
    let senderModel = {
      parentEle: senderDiv,
      index: index,
      propName: "sender",
      datasource: this.customers,
      onchangeHandler: this.onchangeSender,
      placeholder: this.l("Sender"),
      value: sender?.name
    };
    
    this.generateِAutoComplete(senderModel);

    let senderPhoneDiv = this.generateِDiv(senderParentDiv, "col-md-6");
    let senderPhoneModel = {
      parentEle: senderPhoneDiv,
      index: index,
      propName: "senderPhone",
      placeholder: this.l("SenderPhone"),
      value: sender?.phoneNumber
    };
    this.generateِTextBox(senderPhoneModel);
    tr.append(tdSender);

    //Payment Type
    let tdPaymentType = this.generateTd("paymentType-" + index);
    let paymentTypeModel = new SyncDropdownlistModel({
      parentEle: tdPaymentType,
      index: index,
      propName: 'paymentType',
      placeholder: this.l('PaymentType'),
      datasource: this.paymentTypes,
      onChangeHandler: this.onchangePaymentType
    });
    paymentTypeModel.value = data?.paymentType;
    this.generateDropdownlist(paymentTypeModel);
    tr.append(tdPaymentType);
    //debugger;
    //=------
    
    let tdBeneficiary = this.generateTd("beneficiary-" + index, '500');
    //let parentDiv = this.generateِDiv(tdBeneficiary, "row");
    switch (data?.paymentType) {
      case 1: {

        let parentDiv = this.generateِDiv(tdBeneficiary, "row");

        let toClientDiv = this.generateِDiv(parentDiv, "col-md-12");
        let clientModel = new SyncDropdownlistModel({
          parentEle: toClientDiv,
          index: Number(index),
          propName: "toClient",
          datasource: this.clients,
          onChangeHandler: this.onchangeToClient,
          placeholder: this.l("Client"),
        });
        clientModel.value = data?.toClientId;
        this.generateDropdownlist(clientModel);

        let clientCommissionDiv = this.generateِDiv(parentDiv, "col-md-12");
        this.generateNumeric({
          parentEle: clientCommissionDiv,
          index: index,
          propName: "clientCommission",
          placeholder: this.l("ClientCommission"),
          value: data?.clientCommission
        });

        break;
      }
      case 2: {
        
        let parentDiv = this.generateِDiv(tdBeneficiary, "row");

        let toCompanyDiv = this.generateِDiv(parentDiv, "col-md-12");
        let companyModel = new SyncDropdownlistModel({
          parentEle: toCompanyDiv,
          index: Number(index),
          propName: "toCompany",
          datasource: this.companies,
          onChangeHandler: this.onchangeToCompany,
          placeholder: this.l("Company")
        });
        companyModel.value = data?.toCompanyId;
        this.generateDropdownlist(companyModel);

        let companyCommissionDiv = this.generateِDiv(parentDiv, "col-md-12");
        this.generateNumeric({
          parentEle: companyCommissionDiv,
          index: index,
          propName: "companyCommission",
          placeholder: this.l("CompanyCommission"),
          value: data?.companyCommission
        });

        // let beneficiaryDiv = this.generateِDiv(parentDiv, "col-md-6");
        // let beneficiary = this.customers.find(x=>x.id == data?.beneficiaryId);
        // this.generateِAutoComplete({
        //   parentEle: beneficiaryDiv,
        //   index: index,
        //   propName: "beneficiary",
        //   datasource: this.customers,
        //   onchangeHandler: this.onchangeBeneficiary,
        //   placeholder: this.l("Beneficiary"),
        //   value: beneficiary?.name
        // });

        // let phoneDiv = this.generateِDiv(parentDiv, "col-md-6");
        // this.generateِTextBox({
        //   parentEle: phoneDiv,
        //   index: index,
        //   propName: "beneficiaryPhone",
        //   placeholder: this.l("BeneficiaryPhone"),
        //   value: beneficiary?.phoneNumber
        // });
        break;
      }
      default: {
        let parentDiv = this.generateِDiv(tdBeneficiary, "row");

        let beneficiary = this.customers.find(x=>x.id == data?.beneficiaryId);
        let beneficiaryDiv = this.generateِDiv(parentDiv, "col-md-6");
        var beneficiaryModel = new SyncAutoCompleteModel({
          parentEle: beneficiaryDiv,
          index: Number(index),
          propName: "beneficiary",
          datasource: this.customers,
          placeholder: this.l("Beneficiary"),
          onChangeHandler: this.onchangeBeneficiary
        });
        beneficiaryModel.value = beneficiary?.name;
        this.generateِAutoComplete(beneficiaryModel);

        let phoneDiv = this.generateِDiv(parentDiv, "col-md-6");
        let phoneModel = new SyncTextBoxModel({
          parentEle: phoneDiv,
          index: Number(index),
          propName: "beneficiaryPhone",
          placeholder: this.l("BeneficiaryPhone")
        });
        phoneModel.value = beneficiary?.phoneNumber;
        this.generateِTextBox(phoneModel);

        break;
      }
    }

    tr.append(tdBeneficiary);
    //Beneficiary
    // let tdBeneficiary = this.generateTd("beneficiary-" + index, '500');
    // let parentDiv = this.generateِDiv(tdBeneficiary, "row");
    // var beneficiary = this.customers.find(x=>x.id == data?.beneficiaryId);
    // let beneficiaryDiv = this.generateِDiv(parentDiv, "col-md-6");
    // let beneficiaryModel = {
    //   parentEle: beneficiaryDiv,
    //   index: index,
    //   propName: "beneficiary",
    //   datasource: this.customers,
    //   onchangeHandler: this.onchangeBeneficiary,
    //   placeholder: this.l("Beneficiary"),
    //   value: beneficiary?.name
    // };
    // this.generateِAutoComplete(beneficiaryModel);

    // let phoneDiv = this.generateِDiv(parentDiv, "col-md-6");
    // this.generateِTextBox({
    //   parentEle: phoneDiv,
    //   index: index,
    //   propName: "beneficiaryPhone",
    //   placeholder: this.l("BeneficiaryPhone"),
    //   value: beneficiary?.phoneNumber
    // });
    // tr.append(tdBeneficiary);

    //bottons
    let tdTools = this.generateTd("tools-" + index);
    let btnParentDiv = this.generateِDiv(tdTools, "row");

    let btnAddDiv = this.generateِDiv(btnParentDiv, "col-md-4");
    this.generateButton(new SyncButtonModel({
      parentEle: btnAddDiv,
      index: index,
      propName: 'addBtn',
      cssClass: 'as-btn-primary e-small e-round',
      iconCss: 'e-icons e-plus',
      isPrimary: true,
      click: this.addNewRow.bind(this, index)
    }));

    let btnRemoveDiv = this.generateِDiv(btnParentDiv, "col-md-4");
    this.generateButton(new SyncButtonModel({
      parentEle: btnRemoveDiv,
      index: index,
      propName: 'removeBtn',
      cssClass: 'as-btn-primary-outline e-small e-round',
      iconCss: 'e-icons e-trash',
      isPrimary: false,
      click: this.removeRow.bind(this, index)
    }));

    tr.append(tdTools);

    tblBody.append(tr);
  }

  generateNumeric(model) {
    let id = model.propName + model.index;
    let input = document.createElement("input");
    model.parentEle.append(input);

    let numeric = new NumericTextBox({
      htmlAttributes: { id: id },
      change: model.onChangeHandler,
      format: 'N'
    });

    if(model.value != undefined)
    {
      numeric.value = model.value;
    }

    if (model.placeholder != undefined) 
      numeric.placeholder = model.placeholder;

    numeric.appendTo(input);
  }

  generateDropdownlist(model) {
    //id
    let id = model.propName + model.index;
    //generate input
    let input = document.createElement("input");
    model.parentEle.append(input);
    let dropdownlist = new DropDownList({
      dataSource: model.datasource,
      fields: { text: "name", value: "id" },
      enableRtl: true,
      htmlAttributes: { id: id },
      change: model.onChangeHandler
    });

    if (model.placeholder != undefined)
      dropdownlist.placeholder = model.placeholder;

    if(model.value != undefined)
    {
      dropdownlist.value = model.value;
    }
    // if (data.width != undefined)
    //   dropdownlist.width = 200;

    dropdownlist.appendTo(input);
  }

  generateِAutoComplete(model) {
    let id = model.propName + model.index;
    let input = document.createElement("input");
    model.parentEle.append(input);

    let autoComplete = new AutoComplete({
      dataSource: model.datasource,
      fields: { value: "name" },
      enableRtl: true,
      htmlAttributes: { id: id },
      change: model.onchangeHandler
    });
    
    //props
    if (model.placeholder != undefined)
      autoComplete.placeholder = model.placeholder;

    if(model.value != undefined)
    {
      autoComplete.value = model.value;
    }

    //events
    if (model.onChangeHandler != undefined)
      autoComplete.change = model.onChangeHandler;

    autoComplete.appendTo(input);
  }

  generateِTextBox(model) {
    let input = document.createElement("input");
    input.className = "e-input as-sy-input";
    input.setAttribute("id", model.propName + model.index);
    if (model.placeholder != undefined)
      input.placeholder = model.placeholder;

    if(model.value != undefined)
    {
      input.value = model.value;
    }
    model.parentEle.append(input);
  }

  generateTr(index, detailId) {
    let tr = document.createElement("tr");
    tr.setAttribute("id", "tr-" + index);
    tr.setAttribute("detail-id",detailId);
    return tr;
  }

  generateTd(idValue, width = '250') {
    var td = document.createElement("td");
    td.setAttribute("id", "td-" + idValue);
    td.setAttribute("width", width);
    return td;
  }

  generateِDiv(parentEle, className) {
    let div = document.createElement("div");
    div.className = className;

    parentEle.append(div);

    return div;
  }

  generateButton(model){
    let anchor = document.createElement("a");
    anchor.setAttribute('id','');
    anchor.addEventListener('click',model.click)
    model.parentEle.append(anchor);

    let button = new Button({
      cssClass: model.cssClass,
      iconCss: model.iconCss,
      isPrimary : model.isPrimary
    });

    if(model.content != undefined){
      button.content = model.content;
    }
    button.appendTo(anchor);
  }

  

  insertElement(
    currentEle: HTMLElement,
    referenceEle: HTMLElement,
    before: boolean = false
  ) {
    if (before == true) {
      referenceEle.parentNode.insertBefore(currentEle, referenceEle);
    } else {
      referenceEle.parentNode.insertBefore(
        currentEle,
        referenceEle.nextSibling
      );
    }
  }

  getTrElementByIndex(index) {
    return document.getElementById("tr-" + index);
  }

  // onchange handler
  public onchangePaymentType: EmitType<ChangeEventArgs> = (
    e: ChangeEventArgs
  ) => {
    
    //get index from widget
    let index = e.element
      .getAttribute("id")
      .replace("paymentType", "");

    //get parent td element
    let tdBeneficiary = document.getElementById("td-beneficiary-" + index);
    
    //remove all td beneficiary element
    this.removeChildElements(tdBeneficiary);
    let incomeTransferDetail = this.searchResult[this.index]?.incomeTransferDetails[index];
    switch (e.value) {
      case 0: {
        let parentDiv = this.generateِDiv(tdBeneficiary, "row");
        
        let beneficiary = this.customers.find(x=>x.id == incomeTransferDetail?.beneficiaryId);
        let beneficiaryDiv = this.generateِDiv(parentDiv, "col-md-6");
        var beneficiaryModel = new SyncAutoCompleteModel({
          parentEle: beneficiaryDiv,
          index: Number(index),
          propName: "beneficiary",
          datasource: this.customers,
          placeholder: this.l("Beneficiary"),
          onChangeHandler: this.onchangeBeneficiary
        });
        beneficiaryModel.value = beneficiary?.name;
        this.generateِAutoComplete(beneficiaryModel);

        let phoneDiv = this.generateِDiv(parentDiv, "col-md-6");
        let phoneModel = new SyncTextBoxModel({
          parentEle: phoneDiv,
          index: Number(index),
          propName: "beneficiaryPhone",
          placeholder: this.l("BeneficiaryPhone")
        });
        phoneModel.value = beneficiary?.phoneNumber;
        this.generateِTextBox(phoneModel);

        break;
      }
      case 1: {

        let parentDiv = this.generateِDiv(tdBeneficiary, "row");

        let toClientDiv = this.generateِDiv(parentDiv, "col-md-12");
        let clientModel = new SyncDropdownlistModel({
          parentEle: toClientDiv,
          index: Number(index),
          propName: "toClient",
          datasource: this.clients,
          onChangeHandler: this.onchangeToClient,
          placeholder: this.l("Client"),
        });
        if(incomeTransferDetail != undefined){
          clientModel.value = incomeTransferDetail.toClientId;
        }
        
        this.generateDropdownlist(clientModel);

        let clientCommissionDiv = this.generateِDiv(parentDiv, "col-md-12");
        this.generateNumeric({
          parentEle: clientCommissionDiv,
          index: index,
          propName: "clientCommission",
          placeholder: this.l("ClientCommission"),
          value: incomeTransferDetail?.clientCommission
        });

        break;
      }
      case 2: {
        
        let parentDiv = this.generateِDiv(tdBeneficiary, "row");

        let toCompanyDiv = this.generateِDiv(parentDiv, "col-md-12");
        let companyModel = new SyncDropdownlistModel({
          parentEle: toCompanyDiv,
          index: Number(index),
          propName: "toCompany",
          datasource: this.companies,
          onChangeHandler: this.onchangeToCompany,
          placeholder: this.l("Company")
        });
        if(incomeTransferDetail != undefined){
          companyModel.value = incomeTransferDetail.toCompanyId;
        }
        
        this.generateDropdownlist(companyModel);

        let companyCommissionDiv = this.generateِDiv(parentDiv, "col-md-12");
        this.generateNumeric({
          parentEle: companyCommissionDiv,
          index: index,
          propName: "companyCommission",
          placeholder: this.l("CompanyCommission"),
          value: incomeTransferDetail?.companyCommission
        });

        // let beneficiaryDiv = this.generateِDiv(parentDiv, "col-md-6");
        // let beneficiary = this.customers.find(x=>x.id == incomeTransferDetail.beneficiaryId);
        // this.generateِAutoComplete({
        //   parentEle: beneficiaryDiv,
        //   index: index,
        //   propName: "beneficiary",
        //   datasource: this.customers,
        //   onchangeHandler: this.onchangeBeneficiary,
        //   placeholder: this.l("Beneficiary"),
        //   value: beneficiary?.name
        // });

        // let phoneDiv = this.generateِDiv(parentDiv, "col-md-6");
        // this.generateِTextBox({
        //   parentEle: phoneDiv,
        //   index: index,
        //   propName: "beneficiaryPhone",
        //   placeholder: this.l("BeneficiaryPhone"),
        //   value: beneficiary?.phoneNumber
        // });
        break;
      }
    }
  };
  public onchangeCurrency: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    
  };

  public onchangeBeneficiary: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    let index = e.element.getAttribute("id").replace('beneficiary','');
    var phoneNumber = this.getPhoneNumber(e.value);

    let eleId = 'beneficiaryPhone' + index;
    let beneficiaryPhoneEle = (document.getElementById(eleId)) as HTMLInputElement;
    if(phoneNumber)
      beneficiaryPhoneEle.setAttribute('value', phoneNumber);
  };

  public onchangeSender: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    let index = e.element.getAttribute("id").replace('sender','');
    var phoneNumber = this.getPhoneNumber(e.value);

    let eleId = 'senderPhone' + index;
    let senderPhoneEle = (document.getElementById(eleId)) as HTMLInputElement;
    if(phoneNumber)
      senderPhoneEle.setAttribute('value', phoneNumber);
  };

  public onchangeCompany: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    this._companyService.getAllBalances(Number(e.value))
    .subscribe(result =>{
      this.companyBalances = result;
    })
  };
  
  public onchangeToClient: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    
  };
  public onchangeToCompany: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    
  };
  public onchangeCommission: EmitType<any> = (e: any) => {
    let commissionValue = e.value;
    //let input = e.event?.path[0];
    let input = e.event?.currentTarget;
    let index = -1;
    if(input != undefined){
      index = input.getAttribute('id').replace('commission','');

    let amountId = 'amount' + index; 
    let percentageId = 'percentage' + index; 
    
    let percentage = getInstance(document.getElementById(percentageId), NumericTextBox) as NumericTextBox;
    let amount = getInstance(document.getElementById(amountId), NumericTextBox) as NumericTextBox;

    if(amount.value == undefined || amount.value == 0){
      percentage.value = 0;
    }else{
      percentage.value = (100 * commissionValue) / amount.value;
    }
    
    }
  };
  public onchangePersentege: EmitType<any> = (e: any) => {
    let persentageValue = e.value;
    let input = e.event?.path[0];
    if(input != undefined){
      let index = input.getAttribute('id').replace('percentage','');

      let amountId = 'amount' + index; 
      let commissionId = 'commission' + index; 
      
      let commission = getInstance(document.getElementById(commissionId), NumericTextBox) as NumericTextBox;
      let amount = getInstance(document.getElementById(amountId), NumericTextBox) as NumericTextBox;

      if(amount.value == undefined || amount.value == 0){
        commission.value = 0;
      }else{
        commission.value = (amount.value * persentageValue) / 100;
      }
    }
  };
  public onchangeAmount: EmitType<ChangeEventArgs> = (e: ChangeEventArgs) => {
    //console.log(e);
  };

  //helper methods
  removeChildElements(element) {
    if (element != undefined) {
      for (let i = 0; i < element.children.length; i++) {
        element.children[i].remove();
      }
    }
  }

  save(){
    this.incomeTransfer.incomeTransferDetails = [];
    try{
      this.incomeTransfer.date = this.date.toISOString();
    }catch(ex){}
    let validate = true;
    let lastIndex = this.getlastIndex();
    let index = 0;
    while(index <= lastIndex){
      let tr = document.getElementById('tr-'+index);
      if(tr != undefined){
        let validateData = this.validateRow(index);
        if(validateData.success){

          if(!this.checkCurrencyBalanceIfExist(validateData.data)){
            this.showBalanceNotExistMessage(validateData.data.currencyId);
            return;
          }
          if(validateData.data.paymentType != 0){
            validateData.data.status = 2;
          }
          let detailId = tr.getAttribute('detail-id');
          validateData.data.id = detailId;
          this.incomeTransfer.incomeTransferDetails.push(validateData.data);
        }else{
          this.colorRow(validateData);
          validate = false;
        }
      }
      index++;
    }
    
    if(validate){
      this.saving = true;
    this._incomeTransferService
      .update(this.incomeTransfer)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this._router.navigateByUrl('/app/transfer/create-income-transfer');
        //this.cleanRow();
        //this.generateRow(0,undefined);
      });
    }else{
      this.showValidationMessage();
    }
  }

  colorRow(validateData){
    validateData.fields.forEach(field => {
      let id = 'td-' + field.name + '-' + validateData.index;
      let td = document.getElementById(id);
      if(td != undefined){
        td.style.backgroundColor = '#FF3D7114';
      }
    });
  }
  

  addNewRow(index){
    let validateData = this.validateRow(index);
    if(validateData.success){
      this.generateRow(this.getlastIndex(), undefined);
    }else{
      this.colorRow(validateData);
      this.showValidationMessage();
    }
  }

  addRowToList(index){
    let validateData = this.validateRow(index);
    if(validateData.success){
      this.incomeTransfer.incomeTransferDetails.push(validateData.data);
    }else{
      this.showValidationMessage();
    }
  }

  showValidationMessage(){
    abp.message.error("يجب تكامل البيانات");
  }

  showBalanceNotExistMessage(currencyId){
    let currency = this.currencies.find(x=>x.id == currencyId);
    let messageTitle = "لا يوجد رصيد للشركة بالعملة " + currency.name;
    let messageBody ="يجب إنشاء الرصيد اولا حتى تتمكن من إتمام العملية";
    abp.message.error(messageBody, messageTitle);
  }

  removeRow(index){
    let tr = document.getElementById('tr-' + index);
    if(tr != undefined)
      tr.remove(); 
  }

  removeAllRows(){
    let tblBody = document.querySelector('#tblBody');
    while (tblBody.firstChild) {
      tblBody.removeChild(tblBody.firstChild);
    }
    // var trs = tblBody.getElementsByTagName('tr');
    // let count = trs.length;
    // for(let i = 0; i < count; i++){
    //   trs[i].remove();
    // }
  }

  getlastIndex(){
    let tblBody = document.getElementById('tblBody');
    let lastTr = tblBody.children[tblBody.children.length - 1];
    let lastIndex = Number(lastTr.getAttribute('id').replace('tr-','')) + 1;
    return lastIndex;
  }

  validateRow(index){
    let validationResult = new ValidationResult();
    validationResult.fields = [];
    validationResult.index = index;

    var incomeTransferDetail = new IncomeTransferDetailDto();
    incomeTransferDetail.index = index;
    // currency
    let currencyId = 'currency' + index; 
    let currency = getInstance(document.getElementById(currencyId), DropDownList) as DropDownList;
    if(currency.value == undefined){
      
      validationResult.fields.push({name: 'currency', message:this.l('TheField{0}IsRequired', 'Currency') });
    }else{
      incomeTransferDetail.currencyId = Number(currency.value);
    }
    

    //amount
    let amountId = 'amount' + index; 
    let amount = getInstance(document.getElementById(amountId), NumericTextBox) as NumericTextBox;
    if(amount.value == undefined) 
    {
      validationResult.fields.push({name: 'amount', message:this.l('TheField{0}IsRequired', 'Amount') });
    }else{
      incomeTransferDetail.amount = amount.value;
    }
    
    //commission
    let commissionId = 'commission' + index; 
    let commission = getInstance(document.getElementById(commissionId), NumericTextBox) as NumericTextBox;
    if(commission.value == undefined) 
    {
      validationResult.fields.push({name: 'commission', message:this.l('TheField{0}IsRequired', 'Commission') });
    }else{
      incomeTransferDetail.commission = commission.value;
    }
    

    //sender
    let senderCustomer = new CustomerDto();

    let senderId = 'sender' + index; 
    let sender = getInstance(document.getElementById(senderId), AutoComplete) as AutoComplete;
    if(sender.value == undefined) 
    {
      validationResult.fields.push({name: 'sender', message:this.l('TheField{0}IsRequired', 'Sender') });
    }else{
      senderCustomer.name = sender.value.toString();
    }

    //sender phone
    let senderPhoneId = 'senderPhone' + index; 
    let senderPhoneEle = document.getElementById(senderPhoneId) as HTMLInputElement;
    if(senderPhoneEle.value != undefined) 
    {
      senderCustomer.phoneNumber = senderPhoneEle.value;
    }
    incomeTransferDetail.sender = senderCustomer;

    // payment type
    let paymentTypeId = 'paymentType' + index; 
    let paymentType = getInstance(document.getElementById(paymentTypeId), DropDownList) as DropDownList;
    if(paymentType.value == undefined) 
    {
      validationResult.fields.push({name: 'paymentType', message:this.l('TheField{0}IsRequired', 'PaymentType') });
    }else{
      incomeTransferDetail.paymentType = Number(paymentType.value);
    }

    if(incomeTransferDetail.paymentType == 0){
      //beneficiary
      let beneficiaryCustomer = new CustomerDto();
      let beneficiaryId = 'beneficiary' + index; 
      let beneficiaryEle = getInstance(document.getElementById(beneficiaryId), AutoComplete) as AutoComplete;
      if(beneficiaryEle.value == undefined) 
      {
        validationResult.fields.push({name: 'beneficiary', message:this.l('TheField{0}IsRequired', 'Beneficiary') });
      }else{
        beneficiaryCustomer.name = beneficiaryEle.value.toString();
      }

      //beneficiary phone
      let beneficiaryPhoneId = 'beneficiaryPhone' + index; 
      let beneficiaryPhoneEle = document.getElementById(beneficiaryPhoneId) as HTMLInputElement;
      if(beneficiaryPhoneEle.value != undefined) 
      {
        beneficiaryCustomer.phoneNumber = beneficiaryPhoneEle.value;
      }

      incomeTransferDetail.beneficiary = beneficiaryCustomer;
    }

    if(incomeTransferDetail.paymentType == 1){
      // to client
      let toClientId = 'toClient' + index; 
      let toClient = getInstance(document.getElementById(toClientId), DropDownList) as DropDownList;
      if(toClient.value == undefined) 
      {
        validationResult.fields.push({name: 'toClient', message:this.l('TheField{0}IsRequired', 'ToClient') });
      }else{
        incomeTransferDetail.toClientId = Number(toClient.value);
      }

      // client commission
      let clientCommissionId = 'clientCommission' + index; 
      let clientCommissionEle = getInstance(document.getElementById(clientCommissionId), NumericTextBox) as NumericTextBox;
      if(clientCommissionEle.value != undefined) 
      {
        incomeTransferDetail.clientCommission = Number(clientCommissionEle.value);
      }
    }

    if(incomeTransferDetail.paymentType == 2){
      // to company
      let toCompanyId = 'toCompany' + index; 
      let toCompany = getInstance(document.getElementById(toCompanyId), DropDownList) as DropDownList;
      if(toCompany.value == undefined) 
      {
        validationResult.fields.push({name: 'toCompany', message:this.l('TheField{0}IsRequired', 'ToCompany') });
      }else{
        incomeTransferDetail.toCompanyId = Number(toCompany.value);
      }
      
      // company commission
      let companyCommissionId = 'companyCommission' + index; 
      let companyCommissionEle = getInstance(document.getElementById(companyCommissionId), NumericTextBox) as NumericTextBox;
      if(companyCommissionEle.value != undefined) 
      {
        incomeTransferDetail.companyCommission = Number(companyCommissionEle.value);
      }
      
    }

    if(validationResult.fields.length){
      validationResult.success = false;
    }else{
      validationResult.success = true;
      validationResult.data = incomeTransferDetail;
    }

    return validationResult;
  }

  cleanRow(){
    let lastIndex = this.getlastIndex();
    let index = 0;
    while(index <= lastIndex){
      let tr = document.getElementById('tr-'+index);
      if(tr != undefined){
        this.removeRow(index);
      }
      index++;
    }
  }

  checkCurrencyBalanceIfExist(data){
    let index = this.companyBalances
    .findIndex(x=>x.companyId == this.incomeTransfer.companyId && x.currencyId == data.currencyId);

    return index > -1 ? true : false;
  }

  getPhoneNumber(name){
    let customer = this.customers.find(x=>x.name == name);
    return customer?.phoneNumber;
  }

  deleteIncomeTransfer(id): void {
    abp.message.confirm(
      this.l('هل انت متأكد الحذف'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._incomeTransferService
            .delete(id)
            .pipe(
              finalize(() => {
                this._router.navigateByUrl('/app/transfer/create-income-transfer');
                abp.notify.success(this.l('SuccessfullyDeleted'));
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  showSearchIncomeDialog(){
    this._modalService.open(
      SearchIncomeTransferComponent
    ).onClose.subscribe((e:any) => {
      if(e){
        this.navigateToEditIncomeTransferPage(e);
      }
      
    });
  }
  navigateToEditIncomeTransferPage(data) {
    this._router.navigate(
      ['/app/transfer/edit-income-transfer',
        {
          'number': data.number,
          'companyId': data.companyId,
          'fromDate': data.fromDate,
          'toDate': data.toDate
        }
      ]);
  }
}
