import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { DataManager, UrlAdaptor   } from '@syncfusion/ej2-data';
import { API_BASE_URL, RoleServiceProxy } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, ForeignKeyService, GridComponent, GroupSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateRoleDialogComponent } from './create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './edit-role/edit-role-dialog.component';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';

setCulture('ar-SY');
L10n.load(LocalizationHelper.getArabicResources());

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ForeignKeyService]
})

export class RoleComponent extends AppComponentBase implements OnInit {
  
  // Grid
  @ViewChild('roleGrid') public grid: GridComponent;
  roles: DataManager;
  pageSettings: PageSettingsModel;
  pageSizes: number[] = [6, 20, 100];
  groupOptions: GroupSettingsModel;
  filterOption: FilterSettingsModel = { type: 'Menu' };
  baseUrl: string;

constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _roleAppService: RoleServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.roles = new DataManager({
      url: this.baseUrl + '/api/services/app/Role/GetForGrid',
      adaptor: new UrlAdaptor()
  });
  }
  showCreateDialog() {
    this._modalService.open(
      CreateRoleDialogComponent
    ).onClose.subscribe((e:any) => {
      this.refresh();
    });
  }
  showEditDialog(id) {
    this._modalService.open(
      EditRoleDialogComponent,
      {
        context: {
          id: id,
        },
      }
    ).onClose.subscribe((e:any) => {
      this.refresh();
    });
  }
  
  delete(data): void {
    abp.message.confirm(
      this.l('DoYouWantToRemoveTheRole', data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._roleAppService
            .delete(data.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
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
  clearFilters() {
    this.grid.clearFiltering();
  }
  clearSorts() {
    this.grid.clearSorting();
  }
}
