import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { DateTimePicker } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-search-defaulters-of-payment-statement',
  templateUrl: './search-defaulters-of-payment-statement.component.html',
  styleUrls: ['./search-defaulters-of-payment-statement.component.scss']
})
export class SearchDefaultersOfPaymentStatementComponent extends AppComponentBase implements OnInit {

  saving = false;
  days: number = 1;
  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<SearchDefaultersOfPaymentStatementComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this.dialogRef.close({'days': this.days});
  }

}
