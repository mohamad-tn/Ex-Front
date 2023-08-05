import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ClientCashFlowServiceProxy, InactiveClientDto } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SearchClientBalanceStatmentDialogComponent } from '../client-balance-statement/search-client-balance-statment-dialog.component';
import { SearchInactiveClientStatementComponent } from './search-inactive-client-statement.component';

@Component({
  selector: 'app-inactive-client-statement',
  templateUrl: './inactive-client-statement.component.html',
  styleUrls: ['./inactive-client-statement.component.scss']
})
export class InactiveClientStatementComponent extends AppComponentBase implements OnInit {

  
  dataSource: InactiveClientDto[] = [];
  
  constructor(
    injector: Injector,
    private _router: Router,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,

    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) { 
    super(injector);
  }

  ngOnInit(): void {
    setTimeout(()=>this.showSearchDialog(),500);
    //this.initialInactiveClient(1);
  }

  initialInactiveClient(days){
    this._clientCashFlowService.getInactiveClient(days)
    .subscribe(result =>{
      this.dataSource = result;
    })
  }

  
  showSearchDialog() {
    this._modalService.open(
      SearchInactiveClientStatementComponent
    ).onClose.subscribe((e:any) => {
      if(e != undefined && e?.days){
        this.initialInactiveClient(e.days);
      }
    });
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
          'toDate': data.toDate
        }
      ]);
  }

}
