import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckEditPasswordComponent } from '@app/setting/general-setting/check-edit-password/check-edit-password.component';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, CustomerDto, CustomerServiceProxy, ExchangePartyDto, ExpenseDto, ExpenseServiceProxy, IncomeDto, IncomeServiceProxy, IncomeTransferDetailDto, IncomeTransferDetailServiceProxy, TreasuryActionDto, TreasuryActionServiceProxy, TreasuryDto } from '@shared/service-proxies/service-proxies';
import { highlightSearch } from '@syncfusion/ej2-angular-dropdowns';
import { L10n, setCulture, loadCldr  } from '@syncfusion/ej2-base';
import { result } from 'lodash-es';
import { finalize } from 'rxjs/operators';
import { PrintTreasuryActionComponent } from '../print-treasury-action/print-treasury-action.component';
import { SearchTreasuryActionDialogComponent } from '../search-treasury-action/search-treasury-action-dialog.component';


@Component({
  selector: 'app-treasury-action',
  templateUrl: './treasury-action.component.html',
  styleUrls: ['./treasury-action.component.scss']
})
export class TreasuryActionComponent  extends AppComponentBase implements OnInit {

  treasuryAction: TreasuryActionDto = new TreasuryActionDto();
  exchangeParty: ExchangePartyDto = new ExchangePartyDto();
  saving = false;
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];
  expenses: ExpenseDto[] = [];
  incomes: IncomeDto[] = [];
  incomeTransferDetails: IncomeTransferDetailDto[] = [];
  paymentTypes: object[] = [];
  actionTypes: object[] = [];
  mainAccounts: object[] = [];
  mainAccountsIncome: object[] = [];
  mainAccountsExpense: object[] = [];
  exchangeParties: ExchangePartyDto[] = [];
  previousBalance: number = 0.0;
  currentBalance: number = 0.0;
  date: Date = new Date();
  listNumber: number = 0;
  public beneficiaries: object[] = [];
  tre
  public fields: Object = { text: 'name', value: 'id' };
  public exchangePartyFields: Object = { text: 'name', value: 'exchangePartyId' };

  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _router: Router,
    private _currencyAppService: CurrencyServiceProxy,
    private _incomeTransferDetailAppService: IncomeTransferDetailServiceProxy,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _expenseAppService: ExpenseServiceProxy,
    private _incomeAppService: IncomeServiceProxy
    ) 
  { 
    super(injector);
    
  }

  ngOnInit(): void {
    this.treasuryAction.date = new Date().toISOString();
    this.initialNumber();
    this.initialMainAccounts();
    this.initialCurrencies();
    this.initialExchangeParties();
    
    this.actionTypes = [
      {'name' : 'صرف' , 'id' : 0},
      {'name' : 'قبض' , 'id' : 1}
    ];
        
  }

  initialNumber(){
    this._treasuryActionAppService.getLastNumber()
    .subscribe(result => {
      this.listNumber = result + 1;
      this.treasuryAction.number = this.listNumber;
    });
  }

  initialMainAccounts(){
    this.mainAccountsIncome = [
      {'name' : 'ذمم عملاء' , 'id' : 0},
      {'name' : 'ذمم شركات' , 'id' : 1},
      {'name' : 'إيرادات عامة' , 'id' : 2}
    ];

    this.mainAccountsExpense = [
      {'name' : 'ذمم عملاء' , 'id' : 0},
      {'name' : 'ذمم شركات' , 'id' : 1},
      {'name' : 'مصاريف عامة' , 'id' : 3},
      {'name' : 'حوالات مباشرة' , 'id' : 4},
    ];

    if(this.treasuryAction.actionType == 0){
      this.mainAccounts = this.mainAccountsExpense;
    }else if(this.treasuryAction.actionType == 1){
      this.mainAccounts = this.mainAccountsIncome;
    }else{
      this.mainAccounts = [];
    }
  }

  initialExpenses(){
    this._expenseAppService.getAll()
    .subscribe(result => {
      this.expenses = result;
    });
  }

  initialIncomes(){
    this._incomeAppService.getAll()
    .subscribe(result => this.incomes = result);
  }

  initialCurrencies(){
    this._currencyAppService.getAll()
    .subscribe(result => {
      this.currencies = result;
      this.initialMainCurrency();
    });
  }

  initialMainCurrency(){
    this.currencies.forEach(currncy => {
      if(currncy.isMainCurrency){
        this.treasuryAction.currencyId = currncy.id;
      }
    });
  }
  
  initialCompanies(){
    this._companyAppService.getAll()
    .subscribe(result => this.companies = result);
  }

  initialCountries(){
    this._countryAppService.getAll()
    .subscribe(result => this.countries = result);
  }

  initialClients(){
    this._clientAppService.getAll()
    .subscribe(result => this.clients = result);
  }

  initialExchangeParties(){
    this._treasuryActionAppService.getExchangeParties()
    .subscribe(result => {
      this.exchangeParties = result;
      this.exchangeParty.exchangePartyId = this.exchangeParties[0].exchangePartyId;
    });
  }

  initialBeneficaries(currencyId){
    this.incomeTransferDetails = [];
    this.beneficiaries = [];
    if(currencyId != undefined){
      this._incomeTransferDetailAppService.getNotReceived(currencyId)
      .subscribe(result => {
        this.incomeTransferDetails = result;
        result.forEach(detail => {
          this.beneficiaries.push({id : detail.id, name : detail.beneficiary?.name});
        });
      });
    }
  }

  save(){
    this.saving = true;
    this._treasuryActionAppService
      .create(this.treasuryAction)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        let url = this._router.url;
        this._router.navigateByUrl('/',{skipLocationChange: true})
        .then(()=>{
          this._router.navigateByUrl(url);
        });
        //this.treasuryAction = this.treasuryAction
      });
  }

  onActionTypeChange(args: any){
    
    let id = args.itemData.id;
    this.mainAccounts = [];
    if(id == 0){
      this.mainAccounts = this.mainAccountsExpense;
    }else{
      this.mainAccounts = this.mainAccountsIncome;
    }

    //change balance
    if(this.treasuryAction.currencyId != undefined){
      if(this.treasuryAction.mainAccountClientId != undefined && this.treasuryAction.mainAccount == 0){
        this.getBalanceByClient(this.treasuryAction.mainAccountClientId, this.treasuryAction.currencyId);

      }else if(this.treasuryAction.mainAccountCompanyId != undefined && this.treasuryAction.mainAccount == 1){
        this.getBalanceByCompany(this.treasuryAction.mainAccountCompanyId, this.treasuryAction.currencyId);
      }
    }
  }

  onMainActionChange(args:any){
    if(args.itemData != undefined){
      this.treasuryAction.mainAccountClientId = undefined;
      this.treasuryAction.mainAccountCompanyId = undefined;
      this.treasuryAction.incomeId = undefined;
      this.treasuryAction.expenseId = undefined;
      this.treasuryAction.incomeTransferDetailId = undefined;

      let id = args.itemData.id;
      this.mainAccountName = args.itemData?.name;
      switch (id) {
        case 0:
          this.initialClients();
          break;
        case 1:
          this.initialCompanies();
          break;
        case 2:
          this.initialIncomes();
          break;
        case 3:
          this.initialExpenses();
          break;
        case 4:
          this.initialBeneficaries(this.treasuryAction.currencyId);
          break;
        default:
          break;
      }
    }
  }

  exchangePartyBalance: number;
  showExchangePartyBalance: boolean;

  onExchangePartyChange(args: any){
    if(args.itemData != undefined){
      this.exchangePartyName = args.itemData?.name;
      this.treasuryAction.exchangePartyClientId = undefined;
      this.treasuryAction.exchangePartyCompanyId = undefined;
      this.treasuryAction.treasuryId = undefined;
      if(args.itemData.group == "Client"){
        this.treasuryAction.exchangePartyClientId = args.itemData.id;
        this.getExchangePartyBalanceByClient(args.itemData.id, this.treasuryAction.currencyId);
        this.showExchangePartyBalance = true;
      }else if(args.itemData.group == "Company"){
        this.treasuryAction.exchangePartyCompanyId = args.itemData.id;
        this.getExchangePartyBalanceByCompany(args.itemData.id, this.treasuryAction.currencyId);
        this.showExchangePartyBalance = true;
      }else{
        this.treasuryAction.treasuryId = args.itemData.id;
        this.showExchangePartyBalance = false;
      }
    }
  }

  onClientChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined && 
      this.treasuryAction.currencyId != undefined){
        this.accountName = args.itemData?.name;
        this.getBalanceByClient(args.itemData.id, this.treasuryAction.currencyId);
    }
  }

  onCompanyChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined && 
      this.treasuryAction.currencyId != undefined){
        this.accountName = args.itemData?.name;
        this.getBalanceByCompany(args.itemData.id, this.treasuryAction.currencyId);
    }
  }

  onAmountChange(args: any){
    if(args != undefined && this.treasuryAction.currencyId != undefined){
      if(this.treasuryAction.mainAccount == 0 && this.treasuryAction.mainAccountClientId != undefined)
          this.getBalanceByClient(this.treasuryAction.mainAccountClientId, this.treasuryAction.currencyId);

        if(this.treasuryAction.mainAccount == 1 && this.treasuryAction.mainAccountCompanyId != undefined)
          this.getBalanceByCompany(this.treasuryAction.mainAccountCompanyId, this.treasuryAction.currencyId);
    }
  }

  onCurrencyChange(args: any){
    if(args.itemData != undefined && 
      args.itemData.id != undefined){
        this.currencyName = args.itemData?.name;
        if(this.treasuryAction.mainAccount == 0 && this.treasuryAction.mainAccountClientId != undefined)
          this.getBalanceByClient(this.treasuryAction.mainAccountClientId, args.itemData.id);

        if(this.treasuryAction.mainAccount == 1 && this.treasuryAction.mainAccountCompanyId != undefined)
          this.getBalanceByCompany(this.treasuryAction.mainAccountCompanyId, args.itemData.id);

        if(this.treasuryAction.mainAccount == 4){
          this.initialBeneficaries(args.itemData.id);
        }
      } 
  }

  onBeneficiaryChange(args: any){
    if(args.itemData.id != undefined){
      let incomeTransferDetail = this.incomeTransferDetails.find(x=>x.id == args.itemData.id);
      if(incomeTransferDetail != undefined){
        this.treasuryAction.amount = incomeTransferDetail.amount;
      }
    }
  }

  getBalanceByClient(clientId, currencyId){
    this._clientAppService.getCurrentBalance(clientId, currencyId)
    .subscribe(result => {
      this.previousBalance = result.balance;
      if(this.treasuryAction.actionType == 0){  //صرف
        this.currentBalance = this.treasuryAction.amount != undefined ? (result.balance + this.treasuryAction.amount) : result.balance;
      }else{  //قبض
        this.currentBalance = this.treasuryAction.amount != undefined ? (result.balance - this.treasuryAction.amount) : result.balance;
      }
    });
  }

  getExchangePartyBalanceByClient(clientId, currencyId){
    this._clientAppService.getCurrentBalance(clientId, currencyId)
    .subscribe(result => {
      this.exchangePartyBalance = result.balance;
    });
  }

  getExchangePartyBalanceByCompany(companyId, currencyId){
    this._companyAppService.getCurrentBalance(companyId, currencyId)
    .subscribe(result => {
      this.exchangePartyBalance = result.balance;
    });
  }

  getBalanceByCompany(companyId, currencyId){
    this._companyAppService.getCurrentBalance(companyId, currencyId)
    .subscribe(result => {
      this.previousBalance = result.balance;
      if(this.treasuryAction.actionType == 0){  //صرف
        this.currentBalance = this.treasuryAction.amount != undefined ? (result.balance + this.treasuryAction.amount) : result.balance;
      }else{  //قبض
        this.currentBalance = this.treasuryAction.amount != undefined ? (result.balance - this.treasuryAction.amount) : result.balance;
      }
      
    });
  }

  getBalanceWithCurrency(number){
    if(this.treasuryAction.currencyId != undefined){
      let currency = this.currencies.find(x => x.id == this.treasuryAction.currencyId);
      if(currency != undefined){
        let selectedCurrency = this.currencies.find( c => c.id == currency.id);
        return this.getBalance(number) + '  ' + selectedCurrency.name;
      }
  
        return this.getBalance(number);
    }
  }

  showSearchDialog() {
    this.searchSearchTreasuryDialog();
  }

  print(){
    this._modalService.open(
      PrintTreasuryActionComponent,
      {
        context: {
          treasuryAction: this.treasuryAction,
          currencyName: this.currencyName,
          actionTypeName: this.actionTypeName,
          mainAccountName: this.mainAccountName,
          accountName: this.accountName,
          exchangePartyName: this.exchangePartyName
        },
      }
    ).onClose.subscribe((e:any) => {
      if(e.success == true){
        
      }
    });
  }

  searchSearchTreasuryDialog(){
    this._modalService.open(
      SearchTreasuryActionDialogComponent
    ).onClose.subscribe((e:any) => {
      if(e){
        this.navigateToTreasuryActionListPage(e);
      }
    });
    
  }

  navigateToTreasuryActionListPage(data){
    this._router.navigate(
      ['/app/treasury/list-treasury-action',
        {
          "documentNumber": data.documentNumber,
          "actionType" : data.actionType,
          "fromDate" : data.fromDate,
          "toDate" : data.toDate,
          "mainAccount" : data.mainAccount,
          "currencyId" : data.currencyId,
          "mainAccountCompanyId" : data.mainAccountCompanyId,
          "mainAccountClientId" : data.mainAccountClientId,
          "expenseId" : data.expenseId,
          "incomeId" : data.incomeId,
          "incomeTransferDetailId" : data.incomeTransferDetailId
        }
      ]);
  }

  currencyName: string = '';
  actionTypeName: string = '';
  mainAccountName: string = '';
  accountName: string = '';
  exchangePartyName:string = '';
}
