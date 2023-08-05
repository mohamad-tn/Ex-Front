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
  ExpenseServiceProxy, UpdateExpenseDto,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'edit-expense-dialog.component.html',
  styleUrls:['edit-expense-dialog.component.scss']
})
export class EditExpenseDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  expense: UpdateExpenseDto = new UpdateExpenseDto();
  id: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _expenseService: ExpenseServiceProxy,
    public dialogRef: NbDialogRef<EditExpenseDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._expenseService.getForEdit(this.id).subscribe((result: UpdateExpenseDto) => {
      this.expense = result;
    });
  }

  save(): void {
    this.saving = true;

    this._expenseService
      .update(this.expense)
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
