import { Component, Inject, Injector, OnInit, Optional, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, CommisionServiceProxy, CurrencyServiceProxy, ICurrencyDto } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, GridComponent, GroupSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor   } from '@syncfusion/ej2-data';
import { finalize } from 'rxjs/operators';
import { CreateCommisionDialogComponent } from './create-commision/create-commision-dialog.component';
import { EditCommisionDialogComponent } from './edit-commision/edit-commision-dialog.component';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';

setCulture('ar-SY');
L10n.load(LocalizationHelper.getArabicResources());

@Component({
  selector: 'app-commision',
  templateUrl: './commision.component.html',
  styleUrls: ['./commision.component.scss'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommisionComponent extends AppComponentBase implements OnInit {
  // Grid
  @ViewChild('commisionGrid') public grid: GridComponent;
  public commisions: DataManager;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [6, 20, 100];
  public groupOptions: GroupSettingsModel;
  public filterOption: FilterSettingsModel = { type: 'Menu' };
  private baseUrl: string;
  public currencies: ICurrencyDto[] = [];
  
  constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _commisionAppService: CommisionServiceProxy,
    private _currencyAppService: CurrencyServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.initialCurrencies();
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.commisions = new DataManager({
      url: this.baseUrl + '/api/services/app/Commision/GetForGrid',
      adaptor: new UrlAdaptor()
  });
  }
  initialCurrencies(){
    this._currencyAppService.getAll().subscribe(res =>{
      this.currencies = res;
    })
  }
  showCreateDialog() {
    this._modalService.open(
      CreateCommisionDialogComponent
    ).onClose.subscribe((e:any) => {
      console.log("close:: "+e);
      this.refresh();
    });
  }
  showEditDialog(id) {
    this._modalService.open(
      EditCommisionDialogComponent,
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
      this.l('DoYouWantToRemoveTheCommision', data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._commisionAppService
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
