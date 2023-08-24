import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CurrencyDto, CurrencyServiceProxy, ExchangeCurrencyServiceProxy, ExchangePriceDto, ExchangePriceServiceProxy, UpdateExchangeCurrencyDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SearchExchangeCurrencyComponent } from '../search-exchange-currency/search-exchange-currency.component';

@Component({
  selector: 'app-edit-exchange-currency',
  templateUrl: './edit-exchange-currency.component.html',
  styleUrls: ['./edit-exchange-currency.component.scss']
})
export class EditExchangeCurrencyComponent extends AppComponentBase
implements OnInit
{
  exchangeCurrency: UpdateExchangeCurrencyDto = new UpdateExchangeCurrencyDto();
  paymentTypes: object[] = [];
  actionTypes: object[] = [];
  exchangePrices: ExchangePriceDto[] = [];
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  clients: ClientDto[] = [];
  date: Date = new Date();
  saving: boolean;
  onInitial:boolean = true;
  public fields: Object = { text: "name", value: "id" };

  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _currencyAppService: CurrencyServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _exchangePriceAppService: ExchangePriceServiceProxy,
    private _exchangeCurrencyAppService: ExchangeCurrencyServiceProxy,
    private _clientAppService: ClientServiceProxy,
    //private _treasuryAppService: TreasuryServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.paymentTypes = [
      { name: "نقدي", id: 0 },
      { name: "ذمم", id: 1 },
      { name: "شركة", id: 2 },
    ];

    this.actionTypes = [
      { name: "بيع", id: 0 },
      { name: "شراء", id: 1 },
    ];

    let routeData = this._route.snapshot.params;
    
    if(routeData != undefined){
      this.initialCurrencies();
      this.initialCompanies();
      this.initialClients();
      this.initialExchangePrices();
      this.initialExchangeCurrency(routeData?.id);
    }

    
  }

  initialExchangeCurrency(id){
    this._exchangeCurrencyAppService.getForEdit(id)
    .subscribe(result=>{
      this.exchangeCurrency = result;
      
    });
  }

  initialCurrencies() {
    this._currencyAppService.getAll().subscribe((result) => {
      this.currencies = result;
      this.getMainCurrency();
    });
  }

  initialCompanies() {
    this._companyAppService
      .getAll()
      .subscribe((result) => (this.companies = result));
  }

  initialClients() {
    this._clientAppService
      .getAll()
      .subscribe((result) => (this.clients = result));
  }

  initialExchangePrices() {
    this._exchangePriceAppService.getAll().subscribe((result) => {
      this.exchangePrices = result;
    });
  }

  // on change handler
  onchangePaymentType(args) {
    this.onchnage({
      paymentType: args.value,
      actionType: this.exchangeCurrency.actionType,
      clientId: this.exchangeCurrency.clientId,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
    });
  }

  onchangeActionType(args) {
    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: args.value,
      clientId: this.exchangeCurrency.clientId,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
    });
  }

  onchangeFirstCurrency(args) {
    if(args.itemData != undefined){
      if(this.onInitial){
        this.onInitial = false;
      }else{
        this.firstCurrency = this.currencies.find((x) => x.id == args.value);
        this.onchnage({
          paymentType: this.exchangeCurrency.paymentType,
          actionType: this.exchangeCurrency.actionType,
          clientId: this.exchangeCurrency.clientId,
          companyId: this.exchangeCurrency.companyId,
          firstCurrencyId: args.value,
          secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
        });
      }
    }
  }

  onchangeSecondCurrency(args) {
    
    this.secondCurrency = this.currencies.find((x) => x.id == args.value);
    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: this.exchangeCurrency.actionType,
      clientId: this.exchangeCurrency.clientId,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: args.value,
    });
    
  }

  onchangeClient(args){
    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: this.exchangeCurrency.actionType,
      clientId: args.value,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
    });
  }

  onchangeCompany(args){
    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: this.exchangeCurrency.actionType,
      clientId: this.exchangeCurrency.clientId,
      companyId: args.value,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
    });
  }


  onchnage(data) {
    debugger;
    if (data.actionType == undefined || data.paymentType == undefined) {
      return;
    }
    
    if (data.clientId != undefined && data.firstCurrencyId != undefined) {
      this.getClientBalanceFirstCurrency(data);
    } 
    
    if (
      data.clientId != undefined &&
      data.secondCurrencyId != undefined
    ) {
      this.getClientBalanceSecondCurrency(data);
    } else if (
      data.companyId != undefined &&
      data.firstCurrencyId != undefined
    ) {
      this.getCompanyBalanceFirstCurrency(data);
    } 
    
    if (
      data.companyId != undefined &&
      data.secondCurrencyId != undefined
    ) {
      this.getCompanyBalanceSecondCurrency(data);
    } 
    
    if (
      data.companyId == undefined &&
      data.clientId == undefined &&
      data.firstCurrencyId != undefined
    ) {
      this.getTreasuryBalanceFirstCurrency(data);
    } 
    
    if (
      data.companyId == undefined &&
      data.clientId == undefined &&
      data.secondCurrencyId != undefined
    ) {
      this.getTreasuryBalanceSecondCurrency(data);
    }

    this.getExchangePrice(data);
  }
  //helper functions
  firstCurrency: CurrencyDto;
  secondCurrency: CurrencyDto;
  mainCurrency: CurrencyDto;
  exchangePrice: number;
  previousBalanceFirstCurrency: number;
  currentBalanceFirstCurrency: number;
  previousBalanceSecondCurrency: number;
  currentBalanceSecondCurrency: number;

  getTreasuryBalanceFirstCurrency(data) {
    //this._treasuryAppService.
  }

  getTreasuryBalanceSecondCurrency(data) {}

  getClientBalanceFirstCurrency(data) {
    this._clientAppService
      .getCurrentBalance(data.clientId, data.firstCurrencyId)
      .subscribe((result) => {
        this.previousBalanceFirstCurrency = result.balance;
      });
  }

  getClientBalanceSecondCurrency(data) {
    this._clientAppService
      .getCurrentBalance(data.clientId, data.secondCurrencyId)
      .subscribe((result) => {
        this.previousBalanceSecondCurrency = result.balance;
      });
  }

  getCompanyBalanceFirstCurrency(data) {
    this._companyAppService
      .getCurrentBalance(data.companyId, data.firstCurrencyId)
      .subscribe((result) => {
        this.previousBalanceFirstCurrency = result.balance;
      });
  }

  getCompanyBalanceSecondCurrency(data) {
    this._companyAppService
      .getCurrentBalance(data.companyId, data.secondCurrencyId)
      .subscribe((result) => {
        this.previousBalanceSecondCurrency = result.balance;
      });
  }

  getCompanyBalance(companyId, currencyId, balance) {
    this._companyAppService
      .getCurrentBalance(companyId, currencyId)
      .subscribe((result) => {
        balance = result.balance;
      });
  }

  getClientBalance(clientId, currencyId, balance) {
    this._clientAppService
      .getCurrentBalance(clientId, currencyId)
      .subscribe((result) => {
        balance = result.balance;
      });
  }

  getBalanceWithCurrency(amount, currencyId) {
    if (currencyId != undefined && amount != 0 && amount != undefined) {
      let selectedCurrency = this.currencies.find((c) => c.id == currencyId);
      return this.getBalance(amount) + "  " + selectedCurrency.name;
    }
    return "0";
  }

  onchangeFirstAmount(args) {
    let amount = args.value;
    let value = amount * this.exchangeCurrency.exchangePrice;
    this.exchangeCurrency.amoutOfSecondCurrency = Math.round(value * 10) / 10;
    this.updateCurrentBalance();
  }

  onchangeSeconedAmount(args) {
    let amount = args.value;
    if (this.exchangeCurrency.exchangePrice != undefined && this.exchangeCurrency.exchangePrice > 0) {
      let value = amount / this.exchangeCurrency.exchangePrice;
      this.exchangeCurrency.amountOfFirstCurrency = Math.round(value * 10) / 10;
      this.updateCurrentBalance();
    }
  }

  onchangeExchangePrice(args){
    let exchangePrice = args.value;
    this.exchangeCurrency.amoutOfSecondCurrency = this.exchangeCurrency.amountOfFirstCurrency * exchangePrice;
    this.exchangeCurrency.amoutOfSecondCurrency = Math.round(this.exchangeCurrency.amoutOfSecondCurrency * 10)/10;
  }
  getMainCurrency() {
    this.mainCurrency = this.currencies.find((x) => x.isMainCurrency == true);
  }

  getExchangePrice(data) {
    if (
      this.firstCurrency == undefined ||
      this.secondCurrency == undefined ||
      this.mainCurrency == undefined
    ) {
      return;
    }
    
    let price = 0.0;
    if (this.mainCurrency.id == this.firstCurrency.id) {
      let secondCurrencyPrice = this.exchangePrices.find((x) => x.currencyId == this.secondCurrency.id);

      if (secondCurrencyPrice != undefined && data.actionType == 0) {
        price = secondCurrencyPrice.sellingPrice;
      } else if (secondCurrencyPrice != undefined && data.actionType == 1) {
        price = secondCurrencyPrice.purchasingPrice;
      }
      
    } else if(this.mainCurrency.id == this.secondCurrency.id){

      let firstCurrencyPrice = this.exchangePrices.find((x) => x.currencyId == this.firstCurrency.id);
      let secondCurrencyPrice = this.exchangePrices.find((x) => x.currencyId == this.secondCurrency.id);

      if (secondCurrencyPrice != undefined && data.actionType == 0) {
        price = 1 / firstCurrencyPrice.sellingPrice;
      } else if (secondCurrencyPrice != undefined && data.actionType == 1) {
        price = 1 / firstCurrencyPrice.purchasingPrice;
      }

      
    }else{ // mainCurrency != firstCurrency AND mainCurrency != secondCurrency

      let firstCurrencyPrice = this.exchangePrices.find((x) => x.currencyId == this.firstCurrency.id);
      let secondCurrencyPrice = this.exchangePrices.find((x) => x.currencyId == this.secondCurrency.id);

      if (firstCurrencyPrice != undefined && secondCurrencyPrice != undefined && data.actionType == 0) {
      
        if (firstCurrencyPrice.sellingPrice > 0) {
          price = secondCurrencyPrice.sellingPrice / firstCurrencyPrice.sellingPrice;
        }

      } else if (firstCurrencyPrice != undefined && secondCurrencyPrice != undefined && data.actionType == 1) {
      
        if (firstCurrencyPrice.purchasingPrice > 0) {
          price = secondCurrencyPrice.purchasingPrice / firstCurrencyPrice.purchasingPrice;
        }
      }
    }

    this.exchangeCurrency.exchangePrice = Math.round(price * 100000) / 100000;
    console.log(this.exchangeCurrency.exchangePrice);
    // update amount
    if(this.exchangeCurrency.amountOfFirstCurrency){
      this.exchangeCurrency.amoutOfSecondCurrency = this.exchangeCurrency.amountOfFirstCurrency * this.exchangeCurrency.exchangePrice;
      this.exchangeCurrency.amoutOfSecondCurrency = Math.round(this.exchangeCurrency.amoutOfSecondCurrency * 10)/10;
    }

    this.updateCurrentBalance();
  }

  updateCurrentBalance(){
    
    let firstValue = this.exchangeCurrency.actionType == 0 ? 
    (-1 * this.exchangeCurrency.amountOfFirstCurrency) : 
    this.exchangeCurrency.amountOfFirstCurrency;

    let secondValue = this.exchangeCurrency.actionType == 0 ? 
    this.exchangeCurrency.amoutOfSecondCurrency : 
    (-1 * this.exchangeCurrency.amoutOfSecondCurrency);

    this.currentBalanceFirstCurrency = this.previousBalanceFirstCurrency != undefined ? (this.previousBalanceFirstCurrency + firstValue) : firstValue;
    this.currentBalanceSecondCurrency = this.previousBalanceSecondCurrency != undefined ? (this.previousBalanceSecondCurrency + secondValue) : secondValue;
  }

  save(){
    if(this.exchangeCurrency.paidAmountOfFirstCurrency == null || this.exchangeCurrency.paidAmountOfFirstCurrency == undefined){
      this.exchangeCurrency.paidAmountOfFirstCurrency = 0;
    }
    if(this.exchangeCurrency.receivedAmountOfSecondCurrency == null || this.exchangeCurrency.receivedAmountOfSecondCurrency == undefined){
      this.exchangeCurrency.receivedAmountOfSecondCurrency = 0;
    }
    this.exchangeCurrency.date = this.date.toISOString();
    this.saving = true;
    this._exchangeCurrencyAppService
      .update(this.exchangeCurrency)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this._router.navigateByUrl('/app/exchange-currency/create');
      });
  }

  showSearchDialog() {
    this._modalService.open(
      SearchExchangeCurrencyComponent
    ).onClose.subscribe((e:any) => {
      if(e){
        this.navigateToExchangeCurrencyListPage(e);
      }
      
    });
  }

  navigateToExchangeCurrencyListPage(data){
    this._router.navigate(
      ['/app/exchange-currency/list-exchange-currency',
        {
          "paymentType": data.paymentType,
          "actionType" : data.actionType,
          "fromDate" : data.fromDate,
          "toDate" : data.toDate,
          "currencyId" : data.currencyId,
          "companyId" : data.mainAccountCompanyId,
          "clientId" : data.mainAccountClientId
        }
      ]);
  }

}
