import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, ExchangePartyDto, ExpenseDto, ExpenseServiceProxy, IncomeDto, IncomeServiceProxy, IncomeTransferDetailDto, IncomeTransferDetailServiceProxy, TreasuryActionDto, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search-treasury-action-dialog',
  templateUrl: './search-treasury-action-dialog.component.html',
  styleUrls: ['./search-treasury-action-dialog.component.scss']
})
export class SearchTreasuryActionDialogComponent extends AppComponentBase implements OnInit {

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
  public beneficiaries: object[] = [];
  //----
  fromDate: Date = new Date();
  toDate: Date = new Date();
  actionType: number;
  mainAccount: number;
  mainAccountClientId: number;
  mainAccountCompanyId: number;
  documentNumber: number;
  currencyId: number;
  incomeId: number;
  expenseId: number;
  incomeTransferDetailId: number;

  public fields: Object = { text: 'name', value: 'id' };
  
  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    private _incomeTransferDetailAppService: IncomeTransferDetailServiceProxy,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _expenseAppService: ExpenseServiceProxy,
    private _incomeAppService: IncomeServiceProxy,
    public dialogRef: NbDialogRef<SearchTreasuryActionDialogComponent>
    ) 
  { 
    super(injector);
    
  }

  ngOnInit(): void {
    this.initialMainAccounts();
    this.initialCurrencies();
    //this.initialExchangeParties();
    
    this.actionTypes = [
      {'name' : 'صرف' , 'id' : 0},
      {'name' : 'قبض' , 'id' : 1}
    ];
  }

  initialMainAccounts(){
    this.mainAccountsIncome = [
      {'name' : 'الكل' , 'id' : -1},
      {'name' : 'ذمم عملاء' , 'id' : 0},
      {'name' : 'ذمم شركات' , 'id' : 1},
      {'name' : 'إيرادات عامة' , 'id' : 2}
    ];

    this.mainAccountsExpense = [
      {'name' : 'الكل' , 'id' : -1},
      {'name' : 'ذمم عملاء' , 'id' : 0},
      {'name' : 'ذمم شركات' , 'id' : 1},
      {'name' : 'مصاريف عامة' , 'id' : 3},
      {'name' : 'حوالات مباشرة' , 'id' : 4},
    ];

    if(this.actionType == 0){
      this.mainAccounts = this.mainAccountsExpense;
    }else if(this.actionType == 1){
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
    .subscribe(result => this.currencies = result);
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

  search(){
    this.dialogRef.close({
      "documentNumber": this.documentNumber,
      "actionType" : this.actionType,
      "fromDate" : this.fromDate.toISOString(),
      "toDate" : this.toDate.toISOString(),
      "mainAccount" : this.mainAccount,
      "currencyId" : this.currencyId,
      "mainAccountCompanyId" : this.mainAccountCompanyId,
      "mainAccountClientId" : this.mainAccountClientId,
      "expenseId" : this.expenseId,
      "incomeId" : this.incomeId,
      "incomeTransferDetailId" : this.incomeTransferDetailId
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

  }

  onMainActionChange(args:any){
    if(args.itemData != undefined){
      this.mainAccountClientId = undefined;
      this.mainAccountCompanyId = undefined;
      this.incomeId = undefined;
      this.expenseId = undefined;
      this.incomeTransferDetailId = undefined;

      let id = args.itemData.id;
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
          this.initialBeneficaries(this.currencyId);
          break;
        default:
          break;
      }
    }
  }

}
