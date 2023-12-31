import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  ClientDto,
  ClientServiceProxy,
  CompanyDto,
  CompanyServiceProxy,
  CreateExchangeCurrencyDto,
  CurrencyDto,
  CurrencyServiceProxy,
  ExchangeCurrencyServiceProxy,
  ExchangePriceDto,
  ExchangePriceServiceProxy,
  TreasuryServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { threadId } from "worker_threads";
import { finalize } from "rxjs/operators";
import { NbDialogService } from "@nebular/theme";
import { Router } from "@angular/router";
import { SearchExchangeCurrencyComponent } from "../search-exchange-currency/search-exchange-currency.component";
import { CheckEditPasswordComponent } from "@app/setting/general-setting/check-edit-password/check-edit-password.component";

@Component({
  selector: "app-create-exchange-currency",
  templateUrl: "./create-exchange-currency.component.html",
  styleUrls: ["./create-exchange-currency.component.scss"],
})
export class CreateExchangeCurrencyComponent
  extends AppComponentBase
  implements OnInit
{
  exchangeCurrency: CreateExchangeCurrencyDto = new CreateExchangeCurrencyDto();
  paymentTypes: object[] = [];
  actionTypes: object[] = [];
  exchangePrices: ExchangePriceDto[] = [];
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  clients: ClientDto[] = [];
  date: Date = new Date();
  saving: boolean;
  public fields: Object = { text: "name", value: "id" };
  parentCol = "col-lg-4 col-md-4";
  childCol = "col-lg-12 col-md-12";
  exParentCol = "col-lg-8 col-md-8";
  exChildCol = "col-lg-6 col-md-6 balance-box";

  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _router: Router,
    private _currencyAppService: CurrencyServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _exchangePriceAppService: ExchangePriceServiceProxy,
    private _exchangeCurrencyAppService: ExchangeCurrencyServiceProxy,
    private _clientAppService: ClientServiceProxy //private _treasuryAppService: TreasuryServiceProxy,
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

    //this.exchangeCurrency.paymentType = 0;

    this.initialCurrencies();
    this.initialCompanies();
    this.initialClients();
    this.initialExchangePrices();
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
    if (args.value == 0) {
      this.exchangeCurrency.clientId = undefined;
      this.exchangeCurrency.companyId = undefined;
    }

    if (args.value == 1) {
      this.exchangeCurrency.companyId = undefined;
    }

    if (args.value == 2) {
      this.exchangeCurrency.clientId = undefined;
    }

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
    if (args.value == 0) {
      this.exchangeCurrency.receivedAmountOfFirstCurrency = 0;
      this.exchangeCurrency.paidAmountOfSecondCurrency = 0;
    } else if (args.value == 1) {
      this.exchangeCurrency.paidAmountOfFirstCurrency = 0;
      this.exchangeCurrency.receivedAmountOfSecondCurrency = 0;
    }
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
    this.firstCurrency = this.currencies.find((x) => x.id == args.value);

    this.updateCol();

    //exchange prices
    let firstCurrencyPrice = this.exchangePrices.find(
      (x) => x.currencyId == this.firstCurrency.id
    );
    this.firstExchangePrice = firstCurrencyPrice;

    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: this.exchangeCurrency.actionType,
      clientId: this.exchangeCurrency.clientId,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: args.value,
      secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
    });
  }

  onchangeSecondCurrency(args) {
    this.secondCurrency = this.currencies.find((x) => x.id == args.value);

    this.updateCol();
    //exchange prices
    let secondCurrencyPrice = this.exchangePrices.find(
      (x) => x.currencyId == this.secondCurrency.id
    );
    this.secondExchangePrice = secondCurrencyPrice;

    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: this.exchangeCurrency.actionType,
      clientId: this.exchangeCurrency.clientId,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: args.value,
    });
  }

  updateCol() {
    if (!this.firstCurrency || !this.secondCurrency) return;

    if (
      this.secondCurrency.id == this.mainCurrency.id ||
      this.firstCurrency.id == this.mainCurrency.id
    ) {
      this.parentCol = "col-lg-8 col-md-8";
      this.childCol = "col-lg-6 col-md-6";
      this.exParentCol = "col-lg-4 col-md-4";
      this.exChildCol = "col-lg-12 col-md-12 balance-box";
    }
    if (
      this.secondCurrency.id == this.mainCurrency.id &&
      this.firstCurrency.id == this.mainCurrency.id
    ) {
      this.parentCol = "col-lg-12 col-md-12";
      this.childCol = "col-lg-4 col-md-4";
      this.exParentCol = "hideCol";
    }
    if (
      this.secondCurrency.id != this.mainCurrency.id &&
      this.firstCurrency.id != this.mainCurrency.id
    ) {
      this.parentCol = "col-lg-4 col-md-4";
      this.childCol = "col-lg-12 col-md-12";
      this.exParentCol = "col-lg-8 col-md-8";
      this.exChildCol = "col-lg-6 col-md-6 balance-box";
    }
  }

  onchangeClient(args) {
    this.onchnage({
      paymentType: this.exchangeCurrency.paymentType,
      actionType: this.exchangeCurrency.actionType,
      clientId: args.value,
      companyId: this.exchangeCurrency.companyId,
      firstCurrencyId: this.exchangeCurrency.firstCurrencyId,
      secondCurrencyId: this.exchangeCurrency.secondCurrencyId,
    });
  }

  onchangeCompany(args) {
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
    if (data.actionType == undefined || data.paymentType == undefined) {
      return;
    }

    if (data.clientId != undefined && data.firstCurrencyId != undefined) {
      this.getClientBalanceFirstCurrency(data);
    }

    if (data.clientId != undefined && data.secondCurrencyId != undefined) {
      this.getClientBalanceSecondCurrency(data);
    }
    if (data.companyId != undefined && data.firstCurrencyId != undefined) {
      this.getCompanyBalanceFirstCurrency(data);
    }

    if (data.companyId != undefined && data.secondCurrencyId != undefined) {
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
  firstExchangePrice: ExchangePriceDto = new ExchangePriceDto();
  secondExchangePrice: ExchangePriceDto = new ExchangePriceDto();

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
    this.exchangeCurrency.amoutOfSecondCurrency = value;
    // this.exchangeCurrency.amoutOfSecondCurrency = Math.round(value * 10) / 10;
    this.updateCurrentBalance();
  }

  onchangeSeconedAmount(args) {
    this.updateCurrentBalance();

    // let amount = args.value;
    // if (
    //   this.exchangeCurrency.exchangePrice != undefined &&
    //   this.exchangeCurrency.exchangePrice > 0
    // ) {
    //   let value = amount / this.exchangeCurrency.exchangePrice;
    //   this.exchangeCurrency.amountOfFirstCurrency = value;
    //   // this.exchangeCurrency.amountOfFirstCurrency = Math.round(value * 10) / 10;
    //   this.updateCurrentBalance();
    // }
  }

  onchangeExchangePrice(args) {
    let exchangePrice = args.value;
    this.exchangeCurrency.amoutOfSecondCurrency =
      this.exchangeCurrency.amountOfFirstCurrency * exchangePrice;
    // this.exchangeCurrency.amoutOfSecondCurrency =
    //   Math.round(this.exchangeCurrency.amoutOfSecondCurrency * 10) / 10;
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
      let secondCurrencyPrice = this.exchangePrices.find(
        (x) => x.currencyId == this.secondCurrency.id
      );

      if (secondCurrencyPrice != undefined && data.actionType == 0) {
        price = secondCurrencyPrice.sellingPrice;
      } else if (secondCurrencyPrice != undefined && data.actionType == 1) {
        price = secondCurrencyPrice.purchasingPrice;
      }
    } else if (this.mainCurrency.id == this.secondCurrency.id) {
      let firstCurrencyPrice = this.exchangePrices.find(
        (x) => x.currencyId == this.firstCurrency.id
      );
      let secondCurrencyPrice = this.exchangePrices.find(
        (x) => x.currencyId == this.secondCurrency.id
      );

      if (secondCurrencyPrice != undefined && data.actionType == 0) {
        price = 1 / firstCurrencyPrice.sellingPrice;
      } else if (secondCurrencyPrice != undefined && data.actionType == 1) {
        price = 1 / firstCurrencyPrice.purchasingPrice;
      }
    } else {
      // mainCurrency != firstCurrency AND mainCurrency != secondCurrency

      let firstCurrencyPrice = this.exchangePrices.find(
        (x) => x.currencyId == this.firstCurrency.id
      );
      let secondCurrencyPrice = this.exchangePrices.find(
        (x) => x.currencyId == this.secondCurrency.id
      );

      this.firstExchangePrice = firstCurrencyPrice;
      this.secondExchangePrice = secondCurrencyPrice;

      if (
        firstCurrencyPrice != undefined &&
        secondCurrencyPrice != undefined &&
        data.actionType == 0
      ) {
        if (firstCurrencyPrice.sellingPrice > 0) {
          price =
            secondCurrencyPrice.sellingPrice / firstCurrencyPrice.sellingPrice;
        }
      } else if (
        firstCurrencyPrice != undefined &&
        secondCurrencyPrice != undefined &&
        data.actionType == 1
      ) {
        if (firstCurrencyPrice.purchasingPrice > 0) {
          price =
            secondCurrencyPrice.purchasingPrice /
            firstCurrencyPrice.purchasingPrice;
        }
      }
    }

    this.exchangeCurrency.exchangePrice = price;
    // this.exchangeCurrency.exchangePrice = Math.round(price * 100000) / 100000;
    // update amount
    if (this.exchangeCurrency.amountOfFirstCurrency) {
      this.exchangeCurrency.amoutOfSecondCurrency =
        this.exchangeCurrency.amountOfFirstCurrency *
        this.exchangeCurrency.exchangePrice;
      this.exchangeCurrency.amoutOfSecondCurrency =
        Math.round(this.exchangeCurrency.amoutOfSecondCurrency * 10) / 10;
    }

    this.updateCurrentBalance();
  }

  updateCurrentBalance() {
    let firstValue =
      this.exchangeCurrency.actionType == 0
        ? -1 *
          (Math.round(this.exchangeCurrency.amountOfFirstCurrency * 10) / 10)
        : Math.round(this.exchangeCurrency.amountOfFirstCurrency * 10) / 10;

    let secondValue =
      this.exchangeCurrency.actionType == 0
        ? Math.round(this.exchangeCurrency.amoutOfSecondCurrency * 10) / 10
        : -1 *
          (Math.round(this.exchangeCurrency.amoutOfSecondCurrency * 10) / 10);

    this.currentBalanceFirstCurrency =
      this.previousBalanceFirstCurrency != undefined
        ? this.previousBalanceFirstCurrency + firstValue
        : firstValue;
    this.currentBalanceSecondCurrency =
      this.previousBalanceSecondCurrency != undefined
        ? this.previousBalanceSecondCurrency + secondValue
        : secondValue;
  }

  save() {
    if (
      this.exchangeCurrency.paidAmountOfFirstCurrency == null ||
      this.exchangeCurrency.paidAmountOfFirstCurrency == undefined
    ) {
      this.exchangeCurrency.paidAmountOfFirstCurrency = 0;
    }
    if (
      this.exchangeCurrency.receivedAmountOfSecondCurrency == null ||
      this.exchangeCurrency.receivedAmountOfSecondCurrency == undefined
    ) {
      this.exchangeCurrency.receivedAmountOfSecondCurrency = 0;
    }
    if (
      this.exchangeCurrency.paidAmountOfSecondCurrency == null ||
      this.exchangeCurrency.paidAmountOfSecondCurrency == undefined
    ) {
      this.exchangeCurrency.paidAmountOfSecondCurrency = 0;
    }
    if (
      this.exchangeCurrency.receivedAmountOfFirstCurrency == null ||
      this.exchangeCurrency.receivedAmountOfFirstCurrency == undefined
    ) {
      this.exchangeCurrency.receivedAmountOfFirstCurrency = 0;
    }
    this.exchangeCurrency.date = this.date.toISOString();
    this.saving = true;
    this._exchangeCurrencyAppService
      .create(this.exchangeCurrency)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        let url = this._router.url;
        this._router
          .navigateByUrl("/", { skipLocationChange: true })
          .then(() => {
            this._router.navigateByUrl(url);
          });
      });
  }

  showSearchDialog() {
    this.showSearchxchangeCurrencyDialog();
  }

  showSearchxchangeCurrencyDialog() {
    this._modalService
      .open(SearchExchangeCurrencyComponent)
      .onClose.subscribe((e: any) => {
        if (e) {
          this.navigateToTreasuryActionListPage(e);
        }
      });
  }

  navigateToTreasuryActionListPage(data) {
    this._router.navigate([
      "/app/exchange-currency/list-exchange-currency",
      {
        paymentType: data.paymentType,
        actionType: data.actionType,
        fromDate: data.fromDate,
        toDate: data.toDate,
        currencyId: data.currencyId,
        companyId: data.companyId,
        clientId: data.clientId,
      },
    ]);
  }

  getFirstExchangeTitle(name) {
    if (name) {
      return `سعر صرف ال${name} مقابل ال${this.mainCurrency?.name}`;
    }
    return `سعر صرف العملة الاولى مقابل ال${this.mainCurrency?.name}`;
  }

  getSecondExchangeTitle(name) {
    if (name) {
      return `سعر صرف ال${name} مقابل ال${this.mainCurrency?.name}`;
    }
    return `سعر صرف العملة الثانية مقابل ال${this.mainCurrency?.name}`;
  }
}
