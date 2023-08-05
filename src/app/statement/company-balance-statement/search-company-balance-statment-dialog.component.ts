import { AfterViewInit, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { CompanyDto, CompanyServiceProxy, CurrencyDto, CurrencyServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CompanyBalanceFilterInput } from './company-balance-filter-input';

@Component({
  selector: 'app-search-company-balance-statment-dialog',
  templateUrl: './search-company-balance-statment-dialog.component.html',
  styleUrls: ['./search-company-balance-statment-dialog.component.scss']
})
export class SearchCompanyBalanceStatmentDialogComponent extends AppComponentBase implements OnInit,AfterViewInit {

  @ViewChild('companyEl') public companyDropDownList: DropDownListComponent;
  saving = false;
  public selectedCompanyId : number;
  input: CompanyBalanceFilterInput = new CompanyBalanceFilterInput();
  companys: CompanyDto[] = [];
  currencies: CurrencyDto[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filtering: boolean = false;
  public fields: Object = { text: 'name', value: 'id' };
  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    public dialogRef: NbDialogRef<SearchCompanyBalanceStatmentDialogComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {

    this.initialCompanys();
    this.initialCurrencies();
    
  }

  ngAfterViewInit():void{
    //this.companyDropDownList.value = this.selectedCompanyId;
    
  }

  initialCurrencies(){
    this._currencyAppService.getAll()
    .subscribe(result => {
      this.currencies = result;
    });
  }

  initialCompanys(){
    this._companyAppService.getAll()
    .subscribe(result => {
      this.companys = result;
      this.initialData();
    });
  }

  initialData(){
    this.input.fromDate = new Date().toISOString();
    this.input.toDate = new Date().toISOString();
    this.input.companyId = this.selectedCompanyId;
  }
  save(): void {
    this.saving = true;
    this.dialogRef.close({'input': this.input});
  }

}
