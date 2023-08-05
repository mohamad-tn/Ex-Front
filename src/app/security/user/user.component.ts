import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { DataManager, UrlAdaptor   } from '@syncfusion/ej2-data';
import { API_BASE_URL, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, ForeignKeyService, GridComponent, GroupSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password-dialog.component';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';

setCulture('ar-SY');
L10n.load(LocalizationHelper.getArabicResources());

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ForeignKeyService]
})

export class UserComponent extends AppComponentBase implements OnInit {
  
  // Grid
  @ViewChild('userGrid') public grid: GridComponent;
  users: DataManager;
  pageSettings: PageSettingsModel;
  pageSizes: number[] = [6, 20, 100];
  groupOptions: GroupSettingsModel;
  filterOption: FilterSettingsModel = { type: 'Menu' };
  filter: Object;
  baseUrl: string;
  teamLeaderData: Object[];

constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _userAppService: UserServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.filter = { type: "CheckBox" };
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.users = new DataManager({
      url: this.baseUrl + '/api/services/app/User/GetForGrid',
      adaptor: new UrlAdaptor()
  });
  }
  showCreateDialog() {
    this._modalService.open(
      CreateUserDialogComponent
    ).onClose.subscribe((e:any) => {
      this.refresh();
    });
  }
  showEditDialog(id) {
    this._modalService.open(
      EditUserDialogComponent,
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
      this.l('DoYouWantToRemoveTheUser', data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userAppService
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
  showResetPasswordUserDialog(data): void {
    this._modalService.open(
      ResetPasswordDialogComponent,
      {
        context: {
          id: data.id,
        },
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
