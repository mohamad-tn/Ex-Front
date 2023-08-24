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
  CreateExpenseDto,
  ExpenseServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: 'create-expense-dialog.component.html',
  styleUrls:['create-expense-dialog.component.scss'],
  providers:[ExpenseServiceProxy]
})
export class CreateExpenseDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  expense: CreateExpenseDto = new CreateExpenseDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _expenseService: ExpenseServiceProxy,
    public dialogRef: NbDialogRef<CreateExpenseDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;

    this._expenseService
      .create(this.expense)
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
