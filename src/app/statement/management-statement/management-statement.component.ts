import { DataManager, Query, UrlAdaptor } from "@syncfusion/ej2-data";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit,
  Optional,
  ViewChild,
} from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { API_BASE_URL, ManagementServiceProxy } from "@shared/service-proxies/service-proxies";
import { FilterSettingsModel, GridComponent, PageSettingsModel } from "@syncfusion/ej2-angular-grids";
import { SearchManagementStatementComponent } from "./search-management-statement.component";
import { LocalizationHelper } from "@shared/localization/localization-helper";
import { AppComponentBase } from "@shared/app-component-base";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-management-statement",
  templateUrl: "./management-statement.component.html",
  styleUrls: ["./management-statement.component.scss"],
})
export class ManagementStatementComponent
  extends AppComponentBase
  implements OnInit
{
  private baseUrl: string;
  @ViewChild("managementGrid") public grid: GridComponent;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  public param: Query;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [100, 150, 200];
  public dataSource: DataManager;
  public dataSource1: DataManager;
  public dataSource2: DataManager;
  public dataSource3: DataManager;
  public filterOption: FilterSettingsModel = { type: "Menu" };
  localizationHelper: LocalizationHelper;

  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _route: ActivatedRoute,
    private _managementService: ManagementServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {
      pageSize: 100,
      pageCount: 10,
      pageSizes: this.pageSizes,
    };

    this.getChangesCount();
  }

  incomeCount: string;
  outgoingCount: string;
  treasuryCount: string;
  exchangeCount: string;
  getChangesCount() {
    this._managementService.getChangesCount().subscribe((result) => {
      console.log(result);
      this.outgoingCount = result[0].toString();
      this.incomeCount = result[1].toString();
      this.treasuryCount = result[2].toString();
      this.exchangeCount = result[3].toString();
    });
  }

  loading: boolean = false;
  type:any;
  getDetail(type) {
    
    this._modalService
      .open(SearchManagementStatementComponent)
      .onClose.subscribe((e: any) => {
        if (e != undefined) {
          this.fromDate = new Date(e?.fromDate);
          this.toDate = new Date(e?.toDate);

          this.param = new Query()
            .addParams("fromDate", this.fromDate.toISOString())
            .addParams("toDate", this.toDate.toISOString())
            .addParams("type", type);

          this.type = type;
          this.loading = true;

          if (type == 0) {
            this.dataSource = new DataManager({
              url: this.baseUrl + "/api/services/app/Management/GetForGrid",
              adaptor: new UrlAdaptor(),
            });
          }

          if (type == 1) {
            this.dataSource1 = new DataManager({
              url: this.baseUrl + "/api/services/app/Management/GetForGrid",
              adaptor: new UrlAdaptor(),
            });
          }

          if (type == 2) {
            this.dataSource2 = new DataManager({
              url: this.baseUrl + "/api/services/app/Management/GetForGrid",
              adaptor: new UrlAdaptor(),
            });
          }

          if (type == 3) {
            this.dataSource3 = new DataManager({
              url: this.baseUrl + "/api/services/app/Management/GetForGrid",
              adaptor: new UrlAdaptor(),
            });
          }

        }
      });
  }

  refresh() {
    this.grid.refresh();
  }
  clearFilters() {
    this.grid.clearFiltering();
  }
  clearSorts() {
    this.grid.clearSorting();
  }
}
