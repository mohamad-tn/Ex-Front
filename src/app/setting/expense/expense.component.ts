import { Component, Inject, Injector, OnInit, Optional, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ExpenseServiceProxy } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, GridComponent, GroupSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor   } from '@syncfusion/ej2-data';
import { finalize } from 'rxjs/operators';
import { CreateExpenseDialogComponent } from './create-expense/create-expense-dialog.component';
import { EditExpenseDialogComponent } from './edit-expense/edit-expense-dialog.component';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';

setCulture('ar-SY');
L10n.load(LocalizationHelper.getArabicResources());

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseComponent extends AppComponentBase implements OnInit {
  // Grid
  @ViewChild('expenseGrid') public grid: GridComponent;
  public expenses: DataManager;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [6, 20, 100];
  public groupOptions: GroupSettingsModel;
  public filterOption: FilterSettingsModel = { type: 'Menu' };
  private baseUrl: string;
  
  constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _expenseAppService: ExpenseServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.expenses = new DataManager({
      url: this.baseUrl + '/api/services/app/Expense/GetForGrid',
      adaptor: new UrlAdaptor()
  });
  }
  showCreateDialog() {
    this._modalService.open(
      CreateExpenseDialogComponent
    ).onClose.subscribe((e:any) => {
      console.log("close:: "+e);
      this.refresh();
    });
  }
  showEditDialog(id) {
    this._modalService.open(
      EditExpenseDialogComponent,
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
      this.l('DoYouWantToRemoveTheExpense', data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._expenseAppService
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
