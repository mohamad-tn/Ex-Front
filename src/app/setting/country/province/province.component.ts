import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ProvinceDto } from '@shared/service-proxies/service-proxies';
import { DialogEditEventArgs, EditSettingsModel, FilterSettingsModel, GridComponent, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.scss']
})
export class ProvinceComponent extends AppComponentBase implements OnInit {

  actionType: string;
  // Grid
  @ViewChild('proviceGrid') public grid: GridComponent;
  @Input() provinces: ProvinceDto[];
  @Output() onUpdateProvinces = new EventEmitter<any>();

  public pageSizes: number[] = [6, 20, 100];
  public pageSettings: PageSettingsModel;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];

  constructor(injector: Injector) { 
    super(injector);
  }

  ngOnInit(): void {
    if(this.provinces == undefined)
      this.provinces = [];
      
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    //this.grid.refresh();
  }

  actionComplete(args) {
    
    if(args.requestType === 'save'){
      if(args.action === 'add'){
        // debugger;
        // this.provinces.push(new ProvinceDto({ id:0, name:args.data.name }));
        this.onUpdateProvinces.emit(new ProvinceDto({ id:0, name:args.data.name }));
      }
    }
}

actionBegin(args: SaveEventArgs): void {
  if(args.requestType === 'add')
    this.actionType = 'add';

  if(args.requestType === 'beginEdit')
    this.actionType = 'edit';

}

}
