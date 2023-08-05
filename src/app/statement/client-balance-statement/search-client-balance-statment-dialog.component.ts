import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CurrencyDto, CurrencyServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { ClientBalanceFilterInput } from './client-balance-filter-input';

@Component({
  selector: 'app-search-client-balance-statment-dialog',
  templateUrl: './search-client-balance-statment-dialog.component.html',
  styleUrls: ['./search-client-balance-statment-dialog.component.scss']
})
export class SearchClientBalanceStatmentDialogComponent extends AppComponentBase implements OnInit,AfterViewInit {

  @ViewChild('clientEl') public clientDropDownList: DropDownListComponent;
  saving = false;
  public selectedClientId : number;
  input: ClientBalanceFilterInput = new ClientBalanceFilterInput();
  clients: ClientDto[] = [];
  currencies: CurrencyDto[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filtering: boolean = false;
  public fields: Object = { text: 'name', value: 'id' };
  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    private _clientAppService: ClientServiceProxy,
    public dialogRef: NbDialogRef<SearchClientBalanceStatmentDialogComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {

    this.initialClients();
    this.initialCurrencies();
    
  }

  ngAfterViewInit():void{
    //this.clientDropDownList.value = this.selectedClientId;
    
  }

  initialCurrencies(){
    this._currencyAppService.getAll()
    .subscribe(result => {
      this.currencies = result;
    });
  }

  initialClients(){
    this._clientAppService.getAll()
    .subscribe(result => {
      this.clients = result;
      this.initialData();
    });
  }

  initialData(){
    this.input.fromDate = new Date().toISOString();
    this.input.toDate = new Date().toISOString();
    this.input.clientId = this.selectedClientId;
  }
  save(): void {
    this.saving = true;
    this.dialogRef.close({'input': this.input});
  }

}
