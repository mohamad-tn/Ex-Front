import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateIncomeDto,
  IncomeServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'create-income-dialog.component.html',
  styleUrls:['create-income-dialog.component.scss'],
  providers:[IncomeServiceProxy]
})
export class CreateIncomeDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  income: CreateIncomeDto = new CreateIncomeDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _incomeService: IncomeServiceProxy,
    public dialogRef: NbDialogRef<CreateIncomeDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;

    this._incomeService
      .create(this.income)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
}
