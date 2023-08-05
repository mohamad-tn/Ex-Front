import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckEditPasswordComponent } from '@app/setting/general-setting/check-edit-password/check-edit-password.component';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ExchangeCurrencyServiceProxy } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { finalize } from 'rxjs/operators';
import { SearchExchangeCurrencyStatementComponent } from './search-exchange-currency-statement.component';

@Component({
  selector: 'app-exchange-currency-statement',
  templateUrl: './exchange-currency-statement.component.html',
  styleUrls: ['./exchange-currency-statement.component.scss']
})
export class ExchangeCurrencyStatementComponent extends AppComponentBase implements OnInit {

  @ViewChild('searchExchangeGrid') gridInstance: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [100, 200, 1000];
  public param: Query;
  filterParams: Predicate;
  filtering: boolean = false;
  gridHeight: string = '50vh';

  fromDate: Date = new Date();
  toDate: Date = new Date();
  actionType: string;
  paymentType: string;
  companyId: string;
  clientId: string;
  currencyId: string;

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NbDialogService,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 100, pageCount: 100, pageSizes: this.pageSizes};
    this.dataSource = new DataManager({
      url: this.baseUrl + '/api/services/app/ExchangeCurrency/GetForGrid',
      adaptor: new UrlAdaptor()
    });
    
    setTimeout(()=>this.showSearchDialog(),500);
    // let routeData = this._route.snapshot.params;
    
    // if(routeData != undefined){
    //   this.fromDate = new Date(routeData?.fromDate);
    //   this.toDate = new Date(routeData?.toDate);
    //   this.actionType = routeData?.actionType == 'undefined' ? undefined : routeData?.actionType;
    //   this.paymentType = routeData?.paymentType == 'undefined' ? undefined : routeData?.paymentType;
    //   this.companyId = routeData?.companyId == 'undefined' ? undefined : routeData?.companyId;
    //   this.clientId = routeData?.clientId == 'undefined' ? undefined : routeData?.clientId;
    //   this.currencyId = routeData?.currencyId == 'undefined' ? undefined : routeData?.currencyId;
      
    //   this.param = new Query()
    //     .addParams("paymentType", this.paymentType)
    //     .addParams("actionType", this.actionType)
    //     .addParams("companyId",this.companyId)
    //     .addParams("clientId",this.clientId)
    //     .addParams("currencyId", this.currencyId)
    //     .addParams("fromDate", this.fromDate.toISOString())
    //     .addParams("toDate", this.toDate.toISOString());

    //     //this.gridInstance.refresh();
    // }
  }

  showEditPage(id){
    this._router.navigate(
      ['/app/exchange-currency/edit-exchange-currency',
        {
          "id" : id,
        }
      ]);
  }

  showSearchDialog() {
    this._modalService.open(
      CheckEditPasswordComponent
    ).onClose.subscribe((e:any) => {
      if(e.success == true){
        this.showSearchExchangeCurrencyStatementDialog();
      }
    });
    
  }

  showSearchExchangeCurrencyStatementDialog() {
    this._modalService.open(
      SearchExchangeCurrencyStatementComponent
    ).onClose.subscribe((e:any) => {
      if(e){
        this.paymentType = e.paymentTypeName;
        this.actionType = e.actionTypeName;
        this.param = new Query()
        .addParams("paymentType", e.paymentType)
        .addParams("actionType", e.actionType)
        .addParams("companyId",e.companyId)
        .addParams("clientId",e.clientId)
        .addParams("currencyId", e.currencyId)
        .addParams("fromDate", e.fromDate)
        .addParams("toDate", e.toDate);
        this.gridInstance.refresh();
      }
      
    });
  }

  data: object[] = [];
  onActionComplete(args){
    this.data = [];
    args.rows.forEach(row => {
      this.data.push(row.data);
    });
  }
  
  getRealDate(date): Date{
    return new Date(date);
  }
  
}
