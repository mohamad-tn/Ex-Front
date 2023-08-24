import { Component, Inject, Injector, OnInit, Optional, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, IncomeServiceProxy } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, GridComponent, GroupSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor   } from '@syncfusion/ej2-data';
import { finalize } from 'rxjs/operators';
import { CreateIncomeDialogComponent } from './create-income/create-income-dialog.component';
import { EditIncomeDialogComponent } from './edit-income/edit-income-dialog.component';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';

setCulture('ar-SY');
L10n.load(LocalizationHelper.getArabicResources());

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeComponent extends AppComponentBase implements OnInit {
  // Grid
  @ViewChild('incomeGrid') public grid: GridComponent;
  public incomes: DataManager;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [6, 20, 100];
  public groupOptions: GroupSettingsModel;
  public filterOption: FilterSettingsModel = { type: 'Menu' };
  private baseUrl: string;
  
  constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _incomeAppService: IncomeServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.incomes = new DataManager({
      url: this.baseUrl + '/api/services/app/Income/GetForGrid',
      adaptor: new UrlAdaptor()
  });
  }
  showCreateDialog() {
    this._modalService.open(
      CreateIncomeDialogComponent
    ).onClose.subscribe((e:any) => {
      console.log("close:: "+e);
      this.refresh();
    });
  }
  showEditDialog(id) {
    this._modalService.open(
      EditIncomeDialogComponent,
      {
        context: {
          id: id,
        },
      }
    ).onClose.subscribe((e:any) => {
      console.log("close:: "+e);
      this.refresh();
    });
  }
  
  delete(data): void {
    abp.message.confirm(
      this.l('DoYouWantToRemoveTheIncome', data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._incomeAppService
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
