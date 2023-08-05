import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, CompanyCashFlowServiceProxy, MatchingItemDto } from '@shared/service-proxies/service-proxies';
import { ToolBarPosition } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, PageSettingsModel, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { CompanyMatchingDialogComponent } from './company-matching/company-matching-dialog.component';

@Component({
  selector: 'app-company-balance-statement',
  templateUrl: './company-balance-statement.component.html',
  styleUrls: ['./company-balance-statement.component.scss'],
})
export class CompanyBalanceStatementComponent extends AppComponentBase  implements OnInit {

  // Grid
  @ViewChild('cashFlowGrid') public grid: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [100, 200, 300];
  //filterParams: Predicate;
  companyId: number;
  companyName: string;
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
    private _companyCashFlowService: CompanyCashFlowServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) { 
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    
    this.pageSettings = {pageSize: 100, pageCount: 10, pageSizes: this.pageSizes};
    this.dataSource = new DataManager({
      url: this.baseUrl + '/api/services/app/CompanyCashFlow/GetForGrid',
      adaptor: new UrlAdaptor()
    });
    
    
    let routeData = this._route.snapshot.params;
    if(routeData?.companyId != undefined){

      this.fromDate = new Date(routeData?.fromDate);
      this.toDate = new Date(routeData?.toDate);
      this.companyId = routeData?.companyId;
      this.currencyId = routeData?.currencyId;

      this.param = new Query()
        .addParams("id", routeData?.companyId)
        .addParams("currencyId",routeData?.currencyId)
        .addParams("fromDate", this.fromDate.toISOString())
        .addParams("toDate", this.toDate.toISOString());

      this.initialCurrentBalance(routeData?.companyId, routeData?.currencyId, this.fromDate.toISOString(), this.toDate.toISOString());

    }
  }

  initialCurrentBalance(companyId, currencyId, fromDate, toDate){
    this._companyCashFlowService.getCurrentBalance(companyId, currencyId, fromDate, toDate)
    .subscribe(result=>{
      this.companyName = result.company?.name;
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
      CompanyMatchingDialogComponent,
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

  // filter():void{
    
  //   this.filterParams = undefined;
  //   if(this.input.companyId != undefined){
  //     this.addToFilterParams('companyId','equal',this.input.companyId);
  //   }
  //   if(this.input.currencyId != undefined){
  //     this.addToFilterParams('currencyId','equal',this.input.currencyId);
  //   }
  //   if(this.input.fromDate != undefined){
  //     this.addToFilterParams('fromDate','equal',this.input.fromDate);
  //   }
  //   if(this.input.toDate != undefined){
  //     this.addToFilterParams('toDate','equal',this.input.toDate);
  //   }
  //   if(this.filtering){
  //     this.grid.query = new Query().where(this.filterParams);
      
  //     this.grid.refresh();
  //   }
  // }

  // addToFilterParams(key: string,op: string,value: any){
  //   this.filtering = true;
  //   if(this.filterParams == undefined){
  //     this.filterParams= new Predicate(key, op, value, true); 
  //   }else{
  //     this.filterParams= this.filterParams.and(key, op, value, true);
  //   }
  // }

  

}
