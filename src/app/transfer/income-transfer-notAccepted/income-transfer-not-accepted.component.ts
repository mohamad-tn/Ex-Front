import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, OutgoingTransferServiceProxy, ReadOutgoingTransferDto } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, GridComponent, PageSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: "app-income-transfer-not-accepted",
  templateUrl: "./income-transfer-not-accepted.component.html",
  styleUrls: ["./income-transfer-not-accepted.component.scss"],
  animations: [appModuleAnimation()],
})
export class IncomeTransferNotAcceptedComponent
  extends AppComponentBase
  implements OnInit
{
  @ViewChild("incomeTransferNotAcceptedGrid") public grid: GridComponent;

  public pageSizes: number[] = [6, 20, 100];
  public pageSettings: PageSettingsModel;
  public toolbar: ToolbarItems[];
  public filterOption: FilterSettingsModel = { type: "Menu" };
  public transfers: ReadOutgoingTransferDto[];
  private baseUrl: string;

  constructor(
    injector: Injector,
    private _outGoingTransferServiceProxy: OutgoingTransferServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this._outGoingTransferServiceProxy
      .getAllNotCompleted()
      .subscribe((result) => {
        this.transfers = result;
      });

    this.pageSettings = {
      pageSize: 6,
      pageCount: 10,
      pageSizes: this.pageSizes,
    };

    this.toolbar = ["Search"];

    // this.transfers = new DataManager({
    //   url:
    //     this.baseUrl +
    //     "/api/services/app/OutgoingTransfer/GetForNotAcceptedGrid",
    //   adaptor: new UrlAdaptor(),
    // });
  }

  AcceptTransfer(data: ReadOutgoingTransferDto) {
    console.log(this.transfers);
    console.log(data);
  }
}
    