import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { TreasuryBalanceDto, TreasuryBalanceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DialogEditEventArgs, EditSettingsModel, FilterSettingsModel, GridComponent, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-initial-balance',
  templateUrl: './initial-balance.component.html',
  styleUrls: ['./initial-balance.component.scss']
})
export class InitialBalanceComponent extends AppComponentBase implements OnInit {

  actionType: string;
  // Grid
  @ViewChild('initialBalanceGrid') public grid: GridComponent;
  initialBalances: TreasuryBalanceDto[];

  public pageSizes: number[] = [6, 20, 100];
  public pageSettings: PageSettingsModel;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];

  constructor(
    injector: Injector,
    private _treasuryBalanceServiceProxy: TreasuryBalanceServiceProxy
    ) { 
    super(injector);
  }

  ngOnInit(): void {
    this.initialTreasuryBalances();
      
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.editSettings = { allowEditing: true, mode: 'Normal' };
    this.toolbar = ['Search', 'Edit', 'Update', 'Cancel'];
    //this.grid.refresh();
  }

  initialTreasuryBalances(){
    this._treasuryBalanceServiceProxy.getAllWithDetails()
    .subscribe(result => {
      this.initialBalances = result;
    })
  }
  actionComplete(args) {
    
    if(args.requestType === 'save'){
      console.log(args.data);
      let treasuryBalance = new TreasuryBalanceDto();
      treasuryBalance.init(args.data);
      console.log(treasuryBalance);
      this._treasuryBalanceServiceProxy.updateAndGet(treasuryBalance)
      .pipe(
        finalize(() => {
          
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.grid.refresh();
      });
    }
}

actionBegin(args: SaveEventArgs): void {
  // if(args.requestType === 'add')
  //   this.actionType = 'add';

  // if(args.requestType === 'beginEdit')
  
  //   this.actionType = 'edit';

}

}
