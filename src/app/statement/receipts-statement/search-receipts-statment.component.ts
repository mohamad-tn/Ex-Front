import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, CustomerDto, CustomerServiceProxy, ExchangePartyDto, ExpenseDto, ExpenseServiceProxy, IncomeDto, IncomeServiceProxy, IncomeTransferDetailDto, IncomeTransferDetailServiceProxy, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'app-search-receipts-statment',
  templateUrl: './search-receipts-statment.component.html',
  styleUrls: ['./search-receipts-statment.component.scss']
})
export class SearchReceiptsStatmentComponent extends AppComponentBase implements OnInit {

  saving = false;
  public fields: Object = { text: 'name', value: 'id' };
  mainAccounts: object[] = [];
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];
  expenses: ExpenseDto[] = [];
  exchangeParties: ExchangePartyDto[] = [];
  beneficiaries: CustomerDto[] = [];
  
  mainAccountIds: number[] = [];
  mainAccountClientIds: number[] = [];
  mainAccountCompaniesIds: number[] = [];
  mainAccountExpenseIds: number[] = [];
  beneficiaryIds: number[] = [];
  fromDate: Date;
  toDate: Date;

  public selectionSettings: SelectionSettingsModel = { mode: 'Single' };
  
  constructor(
    injector: Injector,
    private _companyAppService: CompanyServiceProxy,
    private _incomeTransferDetailAppService: IncomeTransferDetailServiceProxy,
    private _clientAppService: ClientServiceProxy,
    private _expenseAppService: ExpenseServiceProxy,
    public dialogRef: NbDialogRef<SearchReceiptsStatmentComponent>) {
      super(injector);
    }

  ngOnInit(): void {
    this.mainAccounts = [
      {'name' : 'ذمم عملاء' , 'id' : 0},
      {'name' : 'ذمم شركات' , 'id' : 1},
      {'name' : 'مصاريف عامة' , 'id' : 3},
      //{'name' : 'حوالات مباشرة' , 'id' : 4}
    ];

    this.initialClients();
    this.initialCompanies();
    this.initialExpenses();
    this.initialBeneficaries();

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
      let allExpense = new ExpenseDto();
      allExpense.id = -1;
      allExpense.name = 'الكل';
      this.expenses.push(allExpense);
      result.forEach(item =>{
        this.expenses.push(item);
      });
    });
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

  initialBeneficaries(){
    this.beneficiaries = [];
    this._incomeTransferDetailAppService.getAllDirectTransfers()
      .subscribe(result => {
        let all = new CustomerDto();
        all.id = -1;
        all.name = 'الكل';
        this.beneficiaries.push(all);
        result.forEach(item =>{
          let index = this.beneficiaries.findIndex(x=>x.id == item.beneficiary?.id);
          if(index == -1){
            let customer = new CustomerDto();
            customer.id = item.beneficiary?.id;
            customer.name = item.beneficiary?.name;
            this.beneficiaries.push(customer);
          }
        });
      });
  }

  save(){
    this.dialogRef.close({
      'fromDate':this.fromDate.toISOString(),
      'toDate':this.toDate.toISOString(),
      'mainAccount': this.mainAccountIds[0],
      'mainAccountClientId': this.mainAccountClientIds.length > 0 ? this.mainAccountClientIds[0] : undefined,
      'mainAccountCompanyId': this.mainAccountCompaniesIds.length > 0 ? this.mainAccountCompaniesIds[0] : undefined,
      'expenceId': this.mainAccountExpenseIds.length > 0 ? this.mainAccountExpenseIds[0] : undefined,
      'beneficiaryId': this.beneficiaryIds.length > 0 ? this.beneficiaryIds[0] : undefined,
    });
  }
}
