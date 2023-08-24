import { Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, TreasuryDto, CurrencyDto, CurrencyServiceProxy } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { TreasuryBalanceFilterInput } from './treasury-balance-filter-input'


@Component({
  selector: "app-treasury-balance-statement",
  templateUrl: "./treasury-balance-statement.component.html",
  styleUrls: ["./treasury-balance-statement.component.scss"],
})
export class TreasuryBalanceStatementComponent
  extends AppComponentBase
  implements OnInit
{
  // Grid
  @ViewChild("cashFlowGrid") public grid: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [100, 200, 1000];
  input: TreasuryBalanceFilterInput = new TreasuryBalanceFilterInput();
  treasurys: TreasuryDto[] = [];
  currencies: CurrencyDto[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filtering: boolean = false;
  public fields: Object = { text: "name", value: "id" };
  currencyName: string;
  data: object[] = [];
  public param: Query;

  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.input.fromDate = new Date().toISOString();
    this.input.toDate = new Date().toISOString();
    this.initialCurrencies();

    this.pageSettings = {
      pageSize: 100,
      pageCount: 100,
      pageSizes: this.pageSizes,
    };

    this.param = new Query().addParams(
      "userId",
      this.appSession.userId.toString()
    );

    this.dataSource = new DataManager({
      url: this.baseUrl + "/api/services/app/TreasuryCashFlow/GetForGrid",
      adaptor: new UrlAdaptor(),
    });
  }

  onActionComplete(args) {
    this.data = [];
    args.rows.forEach((row) => {
      this.data.push(row.data);
    });
  }

  initialCurrencies() {
    this._currencyAppService.getAll().subscribe((result) => {
      this.currencies = result;
    });
  }

  filter(): void {
    this.currencyName = this.currencies.find(
      (x) => x.id == this.input.currencyId
    )?.name;
    this.fromDate = new Date(this.input.fromDate);
    this.toDate = new Date(this.input.toDate);

    this.param = new Query()
      .addParams("userId", this.appSession.userId.toString())
      .addParams("currencyId", this.input.currencyId?.toString())
      .addParams("fromDate", this.input.fromDate)
      .addParams("toDate", this.input.toDate);

    // this.grid.refresh();
  }

  getRealDate(date): Date {
    return new Date(date);
  }
}
