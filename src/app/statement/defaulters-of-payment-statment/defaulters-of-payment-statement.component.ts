import { ConditionalExpr } from '@angular/compiler';
import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ClientCashFlowServiceProxy, DefaultersOfPaymentDto } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SearchClientBalanceStatmentDialogComponent } from '../client-balance-statement/search-client-balance-statment-dialog.component';
import { SearchDefaultersOfPaymentStatementComponent } from './search-defaulters-of-payment-statement.component';
import { DefaultersOfPaymentOutpot } from './defaulters-of-payment-outpot';

@Component({
  selector: 'app-defaulters-of-payment-statement',
  templateUrl: './defaulters-of-payment-statement.component.html',
  styleUrls: ['./defaulters-of-payment-statement.component.scss']
})
export class DefaultersOfPaymentStatementComponent extends AppComponentBase implements OnInit {

  // Grid
  @ViewChild('cashFlowGrid') public grid: GridComponent;
  
  dataSource: DefaultersOfPaymentOutpot[] = [];
  clientCashFlows: DefaultersOfPaymentDto[] = [];
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [10, 20, 100];
  showColumnBalance0: boolean = false;
  showColumnBalance1: boolean = false;
  showColumnBalance2: boolean = false;
  showColumnBalance3: boolean = false;
  showColumnBalance4: boolean = false;
  
  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,

    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) { 
    super(injector);
  }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 10, pageCount: 10, pageSizes: this.pageSizes};
    setTimeout(()=>this.showSearchDialog(),500);
    //this.initialDefaultersOfPayment(1);
  }

  initialDefaultersOfPayment(days){
    this._clientCashFlowService.getDefaulters(days)
    .subscribe(result =>{
      this.clientCashFlows = result;
      this.initialDataSource(result);
    })
  }

  days: number = 1;
  showSearchDialog() {
    this._modalService.open(
      SearchDefaultersOfPaymentStatementComponent
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e?.days){
        this.days = e?.days;
        this.initialDefaultersOfPayment(e.days);
      }
    });
  }


  initialDataSource(items: DefaultersOfPaymentDto[]){
    this.dataSource = [];
    items.forEach(item => {
      let data = new DefaultersOfPaymentOutpot();
      data.clientId = item.clientId;
      data.lastActionDate = item.lastActionDate;
      data.clientName = item.clientName;
      var currencyCount = item.currencyBalances.length;
      if(currencyCount > 0){
        data.balance0 = item.currencyBalances[0].currentBalance;
        this.showColumnBalance0 = true;
      }

      if(currencyCount > 1){
        data.balance1 = item.currencyBalances[1].currentBalance;
        this.showColumnBalance1 = true;
      }

      if(currencyCount > 2){
        data.balance2 = item.currencyBalances[2].currentBalance;
        this.showColumnBalance2 = true;
      }

      if(currencyCount > 3){
        data.balance3 = item.currencyBalances[3].currentBalance;
        this.showColumnBalance3 = true;
      }

      if(currencyCount > 4){
        data.balance4 = item.currencyBalances[4].currentBalance;
        this.showColumnBalance4 = true;
      }

      this.dataSource.push(data);
    });
    
    //this.grid.refresh();
    this.calculateTotal();
  }

  getColumnName(index){
    if(this.clientCashFlows != undefined && this.clientCashFlows[0].currencyBalances?.length > 0){
      return this.clientCashFlows[0].currencyBalances[index]?.currencyName;
    }
    return '';
  }

  

  showSearchDetailDialog(data){
    this._modalService.open(
      SearchClientBalanceStatmentDialogComponent,
      {
        context: {
          selectedClientId: data.clientId,
        },
      }
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e?.input){
        this.navigateToClientBalanceDetailPage(e?.input);
      }
      
    });
  }

  navigateToClientBalanceDetailPage(data) {
    this._router.navigate(
      ['/app/statement/client-balance-statement',
        {
          'clientId': data.clientId,
          'currencyId': data.currencyId,
          'fromDate': data.fromDate,
          'days': data.days
        }
      ]);
  }
  
  //-----------
  totalBalanceForHim0 = 0;
  totalBalanceOnHim0 = 0;
  totalBalanceForHim1 = 0;
  totalBalanceOnHim1 = 0;
  totalBalanceForHim2 = 0;
  totalBalanceOnHim2 = 0;
  totalBalanceForHim3 = 0;
  totalBalanceOnHim3 = 0;
  totalBalanceForHim4 = 0;
  totalBalanceOnHim4 = 0;

  calculateTotal(){
    this.totalBalanceForHim0 = 0;
    this.totalBalanceOnHim0 = 0;
    this.totalBalanceForHim1 = 0;
    this.totalBalanceOnHim1 = 0;
    this.totalBalanceForHim2 = 0;
    this.totalBalanceOnHim2 = 0;
    this.totalBalanceForHim3 = 0;
    this.totalBalanceOnHim3 = 0;
    this.totalBalanceForHim4 = 0;
    this.totalBalanceOnHim4 = 0;
    this.dataSource.forEach(item =>{

      if(item.balance0 < 0){
        this.totalBalanceForHim0 += item.balance0;
      }else{
        this.totalBalanceOnHim0 += item.balance0;
      }

      if(item.balance1 < 0){
        this.totalBalanceForHim1 += item.balance1;
      }else{
        this.totalBalanceOnHim1 += item.balance1;
      }

      if(item.balance2 < 0){
        this.totalBalanceForHim2 += item.balance2;
      }else{
        this.totalBalanceOnHim2 += item.balance2;
      }

      if(item.balance3 < 0){
        this.totalBalanceForHim3 += item.balance3;
      }else{
        this.totalBalanceOnHim3 += item.balance3;
      }

      if(item.balance4 < 0){
        this.totalBalanceForHim4 += item.balance4;
      }else{
        this.totalBalanceOnHim4 += item.balance4;
      }

    });
  }
  
}
