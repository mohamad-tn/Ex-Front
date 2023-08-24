import { AfterViewInit, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckEditPasswordComponent } from '@app/setting/general-setting/check-edit-password/check-edit-password.component';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, TreasuryActionServiceProxy } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list-treasury-action',
  templateUrl: './list-treasury-action.component.html',
  styleUrls: ['./list-treasury-action.component.scss']
})
export class ListTreasuryActionComponent extends AppComponentBase implements OnInit {

  @ViewChild('searchGrid') gridInstance: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [10, 20, 100];
  public param: Query;
  filterParams: Predicate;
  filtering: boolean = false;
  gridHeight: string = '30vh';
  fromDate: Date = new Date();
  toDate: Date = new Date();
  actionType: string;
  documentNumber: string;
  mainAccount: string;
  incomeTransferDetailId: string;
  mainAccountCompanyId: string;
  mainAccountClientId: string;
  expenseId: string;
  incomeId: string;
  currencyId: string;

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NbDialogService,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 10, pageCount: 10, pageSizes: this.pageSizes};
    this.dataSource = new DataManager({
      url: this.baseUrl + '/api/services/app/TreasuryAction/GetForGrid',
      adaptor: new UrlAdaptor()
    });
    
    let routeData = this._route.snapshot.params;
    if(routeData != undefined){
      
      this.fromDate = new Date(routeData?.fromDate);
      this.toDate = new Date(routeData?.toDate);
      this.actionType = routeData?.actionType == 'undefined' ? undefined : routeData?.actionType;
      this.documentNumber = routeData?.documentNumber == 'undefined' ? undefined : routeData?.documentNumber;
      this.mainAccount = routeData?.mainAccount == 'undefined' ? undefined : routeData?.mainAccount;
      this.incomeTransferDetailId = routeData?.incomeTransferDetailId == 'undefined' ? undefined : routeData?.incomeTransferDetailId;
      this.mainAccountCompanyId = routeData?.mainAccountCompanyId == 'undefined' ? undefined : routeData?.mainAccountCompanyId;;
      this.mainAccountClientId = routeData?.mainAccountClientId == 'undefined' ? undefined : routeData?.mainAccountClientId;;
      this.expenseId = routeData?.expenseId == 'undefined' ? undefined : routeData?.expenseId;;
      this.incomeId = routeData?.incomeId == 'undefined' ? undefined : routeData?.incomeId;;
      this.currencyId = routeData?.currencyId == 'undefined' ? undefined : routeData?.currencyId;;
      
      this.param = new Query()
        .addParams("number", this.documentNumber)
        .addParams("actionType", this.actionType)
        .addParams("mainAccount",this.mainAccount)
        .addParams("incomeTransferDetailId",this.incomeTransferDetailId)
        .addParams("expenseId",this.expenseId)
        .addParams("incomeId",this.incomeId)
        .addParams("mainAccountCompanyId",this.mainAccountCompanyId)
        .addParams("mainAccountClientId",this.mainAccountClientId)
        .addParams("currencyId", this.currencyId)
        .addParams("fromDate", this.fromDate.toISOString())
        .addParams("toDate", this.toDate.toISOString());
    }
  }

  showDialog(id,type){
    this._modalService.open(
      CheckEditPasswordComponent
    ).onClose.subscribe((e:any) => {
      if(e.success == true){
        if(type == 'edit'){
          this.showEditPage(id);
        }else if(type == 'delete'){
          this.delete(id);
        }
      }
    });
  }
  showEditPage(id){
    this._router.navigate(
      ['/app/treasury/edit-treasury-action',
        {
          "id" : id,
        }
      ]);
  }

  delete(id): void {
    abp.message.confirm(
      this.l('هل انت متأكد الحذف'),
      undefined,
      (result: boolean) => {
        if (result) {
          this._treasuryActionAppService
            .delete(id)
            .pipe(
              finalize(() => {
                this.gridInstance.refresh();
                abp.notify.success(this.l('SuccessfullyDeleted'));
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

}
