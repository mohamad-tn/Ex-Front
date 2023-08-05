import { Component, Injector, OnInit } from '@angular/core';
import { CreateCompanyDialogComponent } from '@app/setting/company/create-company/create-company-dialog.component';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { IncomeTransferDetailChangeStatusInput, IncomeTransferDetailServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-change-direct-transfer-status',
  templateUrl: './change-direct-transfer-status.component.html',
  styleUrls: ['./change-direct-transfer-status.component.scss']
})
export class ChangeDirectTransferStatusComponent extends AppComponentBase implements OnInit {

  id: number;
  input: IncomeTransferDetailChangeStatusInput = new IncomeTransferDetailChangeStatusInput();
  saving: boolean;
  detailStatus: object[] = [];
  public fields: Object = { text: 'name', value: 'id' };

  constructor(injector: Injector,
    public dialogRef: NbDialogRef<ChangeDirectTransferStatusComponent>,
    private _incomeTransferDetailAppService: IncomeTransferDetailServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.input.id = this.id;
    
    this.detailStatus = [
      {'name' : 'غير مبلغ' , 'id' : 0},
      {'name' : 'مبلغ' , 'id' : 1},
    ];
  }

  save(): void {
    this.saving = true;
    
    this._incomeTransferDetailAppService.changeStatus(this.input)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.close();
      });
  }

}
