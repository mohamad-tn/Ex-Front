import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { CompanyDto, CompanyServiceProxy } from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-search-income-transfer',
  templateUrl: './search-income-transfer.component.html',
  styleUrls: ['./search-income-transfer.component.scss']
})
export class SearchIncomeTransferComponent extends AppComponentBase implements OnInit,AfterViewInit {

  fromDate = new Date();
  toDate = new Date();
  companyId: number;
  number: number;
  companies: CompanyDto[] = [];

  public fields: Object = { text: 'name', value: 'id' };

  constructor(
    injector: Injector,
    private _router: Router,
    private _companyAppService: CompanyServiceProxy,
    public dialogRef: NbDialogRef<SearchIncomeTransferComponent>
    ) { 
      super(injector);
    }

  ngOnInit(): void {
    this.initialCompanies();
  }

  ngAfterViewInit(){
  }

  
  initialCompanies(){
    this._companyAppService.getAll()
    .subscribe(result => this.companies = result);
  }

  search():void{
    this.dialogRef.close(
      {
        'number': this.number, 
        'companyId': this.companyId, 
        'fromDate': this.fromDate.toISOString(), 
        'toDate': this.toDate.toISOString()
      }
      )
  }

  checkDisabled(){
    return !(this.number != undefined || this.companyId != undefined);
  }
  
}
