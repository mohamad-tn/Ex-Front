import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ClientCashFlowServiceProxy, MatchingItemDto } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { ClientMatchingDialogComponent } from './client-matching/client-matching-dialog.component';

@Component({
  selector: 'app-client-balance-statement',
  templateUrl: './client-balance-statement.component.html',
  styleUrls: ['./client-balance-statement.component.scss'],
})
export class ClientBalanceStatementComponent extends AppComponentBase  implements OnInit {

  // Grid
  @ViewChild('cashFlowGrid') public grid: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [100, 150, 200];
  //filterParams: Predicate;
  clientId: number;
  clientName: string;
  currencyId: number;
  currencyName: string
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filtering: boolean = false;
  currenctBalance: string;
  public param: Query;
  public fields: Object = { text: 'name', value: 'id' };

  constructor(
    injector: Injector,
    private _route: ActivatedRoute,
    private _datePipe: DatePipe,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) { 
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    
    this.pageSettings = {pageSize: 100, pageCount: 10, pageSizes: this.pageSizes};
    this.dataSource = new DataManager({
      url: this.baseUrl + '/api/services/app/ClientCashFlow/GetForGrid',
      adaptor: new UrlAdaptor()
    });
    
    let routeData = this._route.snapshot.params;
    if(routeData?.clientId != undefined){

      this.fromDate = new Date(routeData?.fromDate);
      this.toDate = new Date(routeData?.toDate);
      this.clientId = routeData?.clientId;
      this.currencyId = routeData?.currencyId;

      this.param = new Query()
        .addParams("id", routeData?.clientId)
        .addParams("currencyId",routeData?.currencyId)
        .addParams("fromDate", this.fromDate.toISOString())
        .addParams("toDate", this.toDate.toISOString());

      this.initialCurrentBalance(routeData?.clientId, routeData?.currencyId, this.fromDate.toISOString(), this.toDate.toISOString());

      
    }

    
  }

  initialCurrentBalance(clientId, currencyId, fromDate, toDate){
    this._clientCashFlowService.getCurrentBalance(clientId, currencyId, fromDate, toDate)
    .subscribe(result=>{
      this.clientName = result.client?.name;
      if(result.balance){
        let value = Math.abs(result.balance);
        this.currenctBalance = this.numberWithCommas(value) + ' ' + result.currency?.name + ' / ' + (result.balance < 0 ? 'بذمتنا' : 'بذمته');
      }else{
        this.currenctBalance = '0';
      }
    })
  }

  getDate(date: Date, format: string){
    if(date == null)
      return '';

    return this._datePipe.transform(date, format);
  }

  matchItems: MatchingItemDto[] = [];
  
  checkedMatched(matched: boolean, id: number){
    console.log(matched);
    let index = this.matchItems.findIndex(x=>x.id == id);
    if(index > -1){
      this.matchItems.splice(index,1);
    } 
    
    this.matchItems.push(new MatchingItemDto({id: id, matched: matched}));
  }

  showMatchingDialog(args){
    
    this._modalService.open(
      ClientMatchingDialogComponent,
      {
        context: {
          matchItems: this.matchItems
        },
      }
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e?.success){
        this.grid.refresh();
      }
      
    });
  }


}
