import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientDto, ClientServiceProxy, CompanyDto, CompanyServiceProxy, CountryDto, CountryServiceProxy } from '@shared/service-proxies/service-proxies';
import { SearchOutgoingTransferStatmentInput } from './SearchOutgoingTransferStatmentInput';

@Component({
  selector: 'app-search-outgoing-transfer-statement-dialog',
  templateUrl: './search-outgoing-transfer-statement-dialog.component.html',
  styleUrls: ['./search-outgoing-transfer-statement-dialog.component.scss']
})
export class SearchOutgoingTransferStatementDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  paymentTypes: object[] = [];
  companies: CompanyDto[] = [];
  countries: CountryDto[] = [];
  clients: ClientDto[] = [];

  fromDate: Date = new Date();
  toDate: Date = new Date();

  outgoingTransferInput: SearchOutgoingTransferStatmentInput = new SearchOutgoingTransferStatmentInput();
  public fields: Object = { text: 'name', value: 'id' };

  constructor(
    injector: Injector,
    private _companyAppService: CompanyServiceProxy,
    private _countryAppService: CountryServiceProxy,
    private _clientAppService: ClientServiceProxy,
    public dialogRef: NbDialogRef<SearchOutgoingTransferStatementDialogComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialCompanies();
    this.initialCountries();
    this.initialClients();

    this.paymentTypes = [
      {'name' : 'نقدي' , 'id' : 0},
      {'name' : 'ذمم عملاء' , 'id' : 1},
      {'name' : 'ذمم شركات' , 'id' : 2},
    ];
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
  
  save(): void {
    this.saving = true;
    this.outgoingTransferInput.fromDate = this.fromDate.toISOString();
    this.outgoingTransferInput.toDate = this.toDate.toISOString();
    this.dialogRef.close(
      {
        'input': this.outgoingTransferInput
      });
  }


}
