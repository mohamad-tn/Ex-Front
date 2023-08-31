import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, CurrencyDto, CurrencyServiceProxy, IncomeTransferDetailChangeStatusInput, IncomeTransferDetailDto, IncomeTransferDetailServiceProxy } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { ChangeDirectTransferStatusComponent } from './change-direct-transfer-status/change-direct-transfer-status.component';
import { DirectTransferFilterInput } from './direct-transfer-filter-input'

@Component({
  selector: "app-direct-transfer",
  templateUrl: "./direct-transfer.component.html",
  styleUrls: ["./direct-transfer.component.scss"],
})
export class DirectTransferComponent
  extends AppComponentBase
  implements OnInit
{
  // Grid
  @ViewChild("directTransferGrid") public grid: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public toolbarOption: ToolbarItems[];
  public searchSettings: SearchSettingsModel;
  public pageSizes: number[] = [10, 20, 100];
  filterParams: Predicate;
  input: DirectTransferFilterInput = new DirectTransferFilterInput();
  incomeTransferDetailDto: IncomeTransferDetailDto[] = [];
  currencies: CurrencyDto[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filtering: boolean = false;
  public fields: Object = { text: "name", value: "id" };
  public param: Query;

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NbDialogService,
    private _currencyAppService: CurrencyServiceProxy,

    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.toolbarOption = ["Search"];
    this.searchSettings = { fields: ["beneficiary.name"] };
    this.input.fromDate = new Date().toISOString();
    this.input.toDate = new Date().toISOString();
    this.initialCurrencies();

    this.pageSettings = {
      pageSize: 10,
      pageCount: 10,
      pageSizes: this.pageSizes,
    };

    this.param = new Query().addParams(
      "userId",
      this.appSession.userId.toString()
    );

    this.dataSource = new DataManager({
      url:
        this.baseUrl +
        "/api/services/app/IncomeTransferDetail/GetDirectTransferForGrid",
      adaptor: new UrlAdaptor(),
    });
  }

  initialCurrencies() {
    this._currencyAppService.getAll().subscribe((result) => {
      this.currencies.push(
        new CurrencyDto({ name: "الكل", isMainCurrency: false, id: -1 })
      );
      result.forEach((item) => {
        this.currencies.push(item);
      });
    });
  }

  filter(): void {

    this.param = new Query()
      .addParams("userId", this.appSession.userId.toString())
      .addParams("currencyId", this.input.currencyId.toString())
      .addParams("fromDate", this.input.fromDate)
      .addParams("toDate", this.input.toDate);
  }
  
  showChangeStatusDialog(data) {
    this._modalService
      .open(ChangeDirectTransferStatusComponent, {
        context: {
          id: data.id,
        },
      })
      .onClose.subscribe((e: any) => {
        this.refresh();
      });
  }

  refresh() {
    this.grid.refresh();
  }

  navigateToPayPage(data) {
    this._router.navigateByUrl("/app/transfer/pay-direct-transfer", {
      state: {
        amount: data.amount,
        id: data.id,
        currencyName: data.currency.name,
        currencyId: data.currency.id,
        beneficiaryId: data.beneficiary.id,
        phoneNumber: data.beneficiary.phoneNumber,
        identificationNumber: data.beneficiary.identificationNumber,
        company: data.incomeTransfer?.company?.name,
      },
    });
  }
}
