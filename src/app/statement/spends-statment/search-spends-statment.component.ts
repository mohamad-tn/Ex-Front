import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, CustomerDto, CustomerServiceProxy, ExchangePartyDto, ExpenseDto, ExpenseServiceProxy, IncomeDto, IncomeServiceProxy, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-search-spends-statment',
  templateUrl: './search-spends-statment.component.html',
  styleUrls: ['./search-spends-statment.component.scss']
})
export class SearchSpendsStatmentComponent extends AppComponentBase implements OnInit {

  saving = false;
  public fields: Object = { text: 'name', value: 'id' };
  mainAccounts: object[] = [];
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];
  expenses: ExpenseDto[] = [];
  incomes: IncomeDto[] = [];
  beneficiaries: CustomerDto[] = [];
  exchangeParties: ExchangePartyDto[] = [];

  mainAccountIds: number[] = [];
  mainAccountClientIds: number[] = [];
  mainAccountCompaniesIds: number[] = [];
  mainAccountIncomeIds: number[] = [];
  fromDate: Date;
  toDate: Date;

  public selectionSettings: SelectionSettingsModel = { mode: 'Single' };
  
  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    private _customerAppService: CustomerServiceProxy,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _expenseAppService: ExpenseServiceProxy,
    private _incomeAppService: IncomeServiceProxy,
    public dialogRef: NbDialogRef<SearchSpendsStatmentComponent>) {
      super(injector);
    }

  ngOnInit(): void {
    this.mainAccounts = [
      {'name' : 'ذمم عملاء' , 'id' : 0},
      {'name' : 'ذمم شركات' , 'id' : 1},
      {'name' : 'إيرادات عامة' , 'id' : 2}
    ];

    this.initialClients();
    this.initialCompanies();
    this.initialIncomes();
    this.fromDate = new Date();
    this.toDate = new Date();
  }

  onMainActionChange(args:any){
    this.mainAccountClientIds = [];
    this.mainAccountCompaniesIds = [];
    this.mainAccountIds = [];

    // if(args.value != undefined){
      
    // }
  }
  initialExpenses(){
    this._expenseAppService.getAll()
    .subscribe(result => {
      this.expenses = result;
    });
  }

  initialIncomes(){
    this._incomeAppService.getAll()
    .subscribe(result => {
      let allIncome = new IncomeDto();
      allIncome.id = -1;
      allIncome.name = 'الكل';
      this.incomes.push(allIncome);
      result.forEach(item =>{
        this.incomes.push(item);
      });
    });
  }

  initialCurrencies(){
    this._currencyAppService.getAll()
    .subscribe(result => this.currencies = result);
  }
  
  initialCompanies(){
    this._companyAppService.getAll()
    .subscribe(result => {
      let allCompany = new CompanyDto();
      allCompany.id = -1;
      allCompany.name = 'الكل';
      this.companies.push(allCompany);
      result.forEach(item =>{
        this.companies.push(item);
      });
    });
  }

  initialCountries(){
    this._countryAppService.getAll()
    .subscribe(result => this.countries = result);
  }

  initialClients(){
    this._clientAppService.getAll()
    .subscribe(result => {
      let allClient = new ClientDto();
      allClient.id = -1;
      allClient.name = 'الكل';
      this.clients.push(allClient);
      result.forEach(item =>{
        this.clients.push(item);
      });
    });
  }

  initialExchangeParties(){
    this._treasuryActionAppService.getExchangeParties()
    .subscribe(result => this.exchangeParties = result);
  }

  initialBeneficaries(){
    this._customerAppService.getTreasuryActionBeneficiaries()
    .subscribe(result => this.beneficiaries = result);
  }
  save(){
    this.dialogRef.close({
      'fromDate':this.fromDate.toISOString(),
      'toDate':this.toDate.toISOString(),
      'mainAccount': this.mainAccountIds[0],
      'mainAccountClientId': this.mainAccountClientIds.length > 0 ? this.mainAccountClientIds[0] : undefined,
      'mainAccountCompanyId': this.mainAccountCompaniesIds.length > 0 ? this.mainAccountCompaniesIds[0] : undefined,
      'incomeId': this.mainAccountIncomeIds.length > 0 ? this.mainAccountIncomeIds[0] : -1
    });
  }
}
