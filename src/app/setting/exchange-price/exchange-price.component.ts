import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { ExchangePriceDto, ExchangePriceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DialogEditEventArgs, EditSettingsModel, FilterSettingsModel, GridComponent, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-exchange-price',
  templateUrl: './exchange-price.component.html',
  styleUrls: ['./exchange-price.component.scss']
})
export class ExchangePriceComponent extends AppComponentBase implements OnInit {

  actionType: string;
  // Grid
  @ViewChild('exchangePriceGrid') public grid: GridComponent;
  exchangePrices: ExchangePriceDto[] = [];
  mainCurrency: string;
  public pageSizes: number[] = [6, 20, 100];
  public pageSettings: PageSettingsModel;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];

  constructor(
    injector: Injector,
    private _router: Router,
    private _exchangePriceServiceProxy: ExchangePriceServiceProxy
    ) { 
    super(injector);
  }

  ngOnInit(): void {
    this.initialExchangePrices();
      
    this.pageSettings = {pageSize: 6, pageCount: 10, pageSizes: this.pageSizes};
    this.editSettings = { allowEditing: true, mode: 'Normal', allowEditOnDblClick: false };
    this.toolbar = ['Search', 'Edit', 'Update', 'Cancel'];
    //this.grid.refresh();
  }

  initialExchangePrices(){
    this.exchangePrices = [];
    this._exchangePriceServiceProxy.getAll()
    .subscribe(result => {
      result.forEach(exPrice => {
        if(!exPrice.currency.isMainCurrency){
          this.exchangePrices.push(exPrice);
        }else{
          this.mainCurrency = exPrice.currency.name;
        }
        this.grid.refresh();
      });
    })
  }
  actionComplete(args) {
    
    if(args.requestType === 'save'){
      let exchangePrice = new ExchangePriceDto();
      exchangePrice.init(args.data);
      
      this._exchangePriceServiceProxy.update(exchangePrice)
      .pipe(
        finalize(() => {
          
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.initialExchangePrices();
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
