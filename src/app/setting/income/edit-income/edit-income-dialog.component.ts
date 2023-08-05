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
  IncomeServiceProxy, UpdateIncomeDto,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'edit-income-dialog.component.html',
  styleUrls:['edit-income-dialog.component.scss']
})
export class EditIncomeDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  income: UpdateIncomeDto = new UpdateIncomeDto();
  id: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _incomeService: IncomeServiceProxy,
    public dialogRef: NbDialogRef<EditIncomeDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._incomeService.getForEdit(this.id).subscribe((result: UpdateIncomeDto) => {
      this.income = result;
    });
  }

  save(): void {
    this.saving = true;

    this._incomeService
      .update(this.income)
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
