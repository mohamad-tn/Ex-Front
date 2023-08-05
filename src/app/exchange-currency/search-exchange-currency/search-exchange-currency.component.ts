import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CurrencyDto, CurrencyServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-search-exchange-currency',
  templateUrl: './search-exchange-currency.component.html',
  styleUrls: ['./search-exchange-currency.component.scss']
})
export class SearchExchangeCurrencyComponent extends AppComponentBase implements OnInit {

  saving = false;
  currencies: CurrencyDto[] = [];
  companies: CompanyDto[] = [];
  clients: ClientDto[] = [];
  paymentTypes: object[] = [];
  actionTypes: object[] = [];

  fromDate: Date = new Date();
  toDate: Date = new Date();
  actionType: number;
  paymentType: number;
  clientId: number;
  companyId: number;
  currencyId: number;

  public fields: Object = { text: 'name', value: 'id' };
  
  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _clientAppService: ClientServiceProxy,
    public dialogRef: NbDialogRef<SearchExchangeCurrencyComponent>
    ) 
  { 
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

    this.initialCurrencies();
  }

  initialCurrencies(){
    this._currencyAppService.getAll()
    .subscribe(result => this.currencies = result);
  }
  
  initialCompanies(){
    this._companyAppService.getAll()
    .subscribe(result => this.companies = result);
  }

  initialClients(){
    this._clientAppService.getAll()
    .subscribe(result => this.clients = result);
  }

  search(){
    this.dialogRef.close({
      "actionType" : this.actionType,
      "paymentType" : this.paymentType,
      "fromDate" : this.fromDate.toISOString(),
      "toDate" : this.toDate.toISOString(),
      "currencyId" : this.currencyId,
      "companyId" : this.companyId,
      "clientId" : this.clientId
    });
  }

  
  onActionTypeChange(args: any){
    
    let id = args.itemData.id;
  }

  onPaymentTypeChange(args:any){
    if(args.itemData != undefined){
      this.clientId = undefined;
      this.companyId = undefined;

      let id = args.itemData.id;
      switch (id) {
        case 1:
          this.initialClients();
          break;
        case 2:
          this.initialCompanies();
          break;
        default:
          break;
      }
    }
  }

  

}
