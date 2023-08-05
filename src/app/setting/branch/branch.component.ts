import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, OnInit,ViewChild,ChangeDetectionStrategy, Injector, Optional, Inject } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { FilterSettingsModel, GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { API_BASE_URL, BranchServiceProxy } from '@shared/service-proxies/service-proxies';
import { NbDialogService } from '@nebular/theme';
import { CreateBranchDialogComponent } from './create-branch/create-branch-dialog.component';
import { finalize } from 'rxjs/operators';
import { EditBranchDialogComponent } from './edit-branch/edit-branch-dialog.component';



@Component({
  selector: "app-client",
  templateUrl: "./branch.component.html",
  styleUrls: ["./branch.component.scss"],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchComponent extends AppComponentBase implements OnInit {
  // Grid
  @ViewChild("branchGrid") public grid: GridComponent;
  public pageSettings: PageSettingsModel;
  public filterOption: FilterSettingsModel = { type: "Menu" };
  public branches: DataManager;
  private baseUrl: string;
  public pageSizes: number[] = [6, 20, 100];

  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _branchService: BranchServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }
  ngOnInit(): void {
    this.pageSettings = {
      pageSize: 6,
      pageCount: 10,
      pageSizes: this.pageSizes,
    };
    this.branches = new DataManager({
      url: this.baseUrl + "/api/services/app/Branch/GetForGrid",
      adaptor: new UrlAdaptor(),
    });
  }

  showCreateDialog() {
    this._modalService
      .open(CreateBranchDialogComponent)
      .onClose.subscribe((e: any) => {
        this.grid.refresh();
      });
  }

  showEditDialog(id) {
    this._modalService
      .open(EditBranchDialogComponent, {
        context: {
          id: id,
        },
      })
      .onClose.subscribe((e: any) => {
        this.refresh();
      });
  }

  delete(data): void {
    abp.message.confirm(
      this.l("DoYouWantToRemoveTheBranch", data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._branchService
            .delete(data.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l("SuccessfullyDeleted"));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  refresh() {
    this.grid.refresh();
  }
}