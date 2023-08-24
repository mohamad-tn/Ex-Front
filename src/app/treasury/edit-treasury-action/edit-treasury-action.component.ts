import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy, CurrencyDto, CurrencyServiceProxy, CustomerDto, CustomerServiceProxy, ExchangePartyDto, ExpenseDto, ExpenseServiceProxy, IncomeDto, IncomeServiceProxy, IncomeTransferDetailDto, IncomeTransferDetailServiceProxy, TreasuryActionDto, TreasuryActionServiceProxy, TreasuryDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { PrintTreasuryActionComponent } from '../print-treasury-action/print-treasury-action.component';

@Component({
  selector: 'app-treasury-action',
  templateUrl: './edit-treasury-action.component.html',
  styleUrls: ['./edit-treasury-action.component.scss']
})
export class EditTreasuryActionComponent  extends AppComponentBase implements OnInit {

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
  public beneficiaries: object[] = [];
  onInitial:boolean = true;
  public fields: Object = { text: 'name', value: 'id' };
  public exchangePartyFields: Object = { text: 'name', value: 'exchangePartyId' };

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NbDialogService,
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
    this.actionTypes = [
      {'name' : 'صرف' , 'id' : 0},
      {'name' : 'قبض' , 'id' : 1}
    ];
    
    this.initialCurrencies();
    this.initialClients();
    this.initialCompanies();
    this.initialExpenses();
    this.initialIncomes();
    this.initialExchangeParties();
    
    this.initialTreasuryAction();
    //setTimeout(()=>this.initialTreasuryAction(),1000);
    
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

  initialTreasuryAction(){
    let routeData = this._route.snapshot.params;
    if(routeData?.id != undefined){
      this._treasuryActionAppService.getForEdit(routeData?.id)
      .subscribe(result => {
        this.treasuryAction = result;
        this.initialMainAccounts();
        if(this.treasuryAction.mainAccount == 4){
          this.initialBeneficaries(this.treasuryAction.currencyId);
        }
        
        //Exchange Party
        let selectedExchangeParty = new ExchangePartyDto();
        if(this.treasuryAction.exchangePartyClientId != undefined){
          let value = 'Cl' + this.treasuryAction.exchangePartyClientId;
          selectedExchangeParty = this.exchangeParties.find(x=>x.exchangePartyId == value);

        }else if(this.treasuryAction.exchangePartyCompanyId != undefined){
          let value = 'Co' + this.treasuryAction.exchangePartyCompanyId;
          selectedExchangeParty = this.exchangeParties.find(x=>x.exchangePartyId == value);

        }else{
          let value = 'Tr' + this.treasuryAction.treasuryId;
          selectedExchangeParty = this.exchangeParties.find(x=>x.exchangePartyId == value);
        }

        if(selectedExchangeParty != undefined){
          this.exchangeParty = selectedExchangeParty;
        }
      });
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
    .subscribe(result => {
      this.companies = result;
      
    });
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
      console.log(result);
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
      .update(this.treasuryAction)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this._router.navigateByUrl('/app/treasury/treasury-action');
      });
  }

  onActionTypeChange(args: any){
    
    let id = args.itemData.id;
    this.actionTypeName = args.itemData?.name;
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
        this.getBalanceByClient(this.treasuryAction.mainAccountCompanyId, this.treasuryAction.currencyId);
      }
    }
  }

  onMainActionChange(args:any){
    if(args.itemData != undefined){
      if(this.onInitial){
        this.onInitial = false;
      }else{
        this.treasuryAction.mainAccountClientId = undefined;
        this.treasuryAction.mainAccountCompanyId = undefined;
        this.treasuryAction.incomeId = undefined;
        this.treasuryAction.expenseId = undefined;
        this.treasuryAction.incomeTransferDetailId = undefined;
      }

      this.mainAccountName = args.itemData?.name;
      // let id = args.itemData.id;
      // switch (id) {
      //   case 0:
      //     this.initialClients();
      //     break;
      //   case 1:
      //     this.initialCompanies();
      //     break;
      //   case 2:
      //     this.initialIncomes();
      //     break;
      //   case 3:
      //     this.initialExpenses();
      //     break;
      //   case 4:
      //     this.initialBeneficaries(this.treasuryAction.currencyId);
      //     break;
      //   default:
      //     break;
      // }
    }
  }

  exchangePartyBalance: number;
  showExchangePartyBalance: boolean;

  onExchangePartyChange(args: any){
    if(args.itemData != undefined){
      if(this.onInitial){
        this.onInitial = false;
      }else{
        this.treasuryAction.exchangePartyClientId = undefined;
        this.treasuryAction.exchangePartyCompanyId = undefined;
        this.treasuryAction.treasuryId = undefined;
      }
      this.exchangePartyName = args.itemData?.name;
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

  currencyName: string = '';
  actionTypeName: string = '';
  mainAccountName: string = '';
  accountName: string = '';
  exchangePartyName:string = '';

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
  
}
