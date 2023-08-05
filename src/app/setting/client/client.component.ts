import { Component, Inject, Injector, OnInit, Optional, ViewChild,ChangeDetectionStrategy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ClientServiceProxy } from '@shared/service-proxies/service-proxies';
import { FilterSettingsModel, GridComponent, GroupSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor   } from '@syncfusion/ej2-data';
import { finalize } from 'rxjs/operators';
import { CreateClientDialogComponent } from './create-client/create-client-dialog.component';
import { EditClientDialogComponent } from './edit-client/edit-client-dialog.component';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientComponent extends AppComponentBase implements OnInit {
  // Grid
  @ViewChild('clientGrid') public grid: GridComponent;
  public clients: DataManager;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [6, 20, 100];
  public groupOptions: GroupSettingsModel;
  public filterOption: FilterSettingsModel = { type: 'Menu' };
  private baseUrl: string;
  localizationHelper : LocalizationHelper;
  constructor(injector: Injector,
    private _modalService: NbDialogService,
    private _clientAppService: ClientServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.clients = new DataManager({
      url: this.baseUrl + '/api/services/app/Client/GetForGrid',
      adaptor: new UrlAdaptor()
  });
  
  }
  showCreateDialog() {
    this._modalService.open(
      CreateClientDialogComponent
    ).onClose.subscribe((e:any) => {
      
      this.refresh();
    });
  }
  showEditDialog(id) {
    this._modalService.open(
      EditClientDialogComponent,
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
      this.l('DoYouWantToRemoveTheClient', data.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._clientAppService
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

  checkboxChange(args: any) {  
    let currentRowObject: any = this.grid.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));  
    let currentRowData: Object = currentRowObject.data;  
 
    let rowIndex: any = args.event.target.closest('td').getAttribute("index");    
    this.grid.setCellValue(currentRowData["id"],"activated",args.checked);    //save the checkbox changes 
}  
}
