import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-search-summary-statement',
  templateUrl: './search-summary-statement.component.html',
  styleUrls: ['./search-summary-statement.component.scss']
})
export class SearchSummaryStatementComponent extends AppComponentBase implements OnInit {

  saving = false;
  toDate: Date = new Date()
  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<SearchSummaryStatementComponent>
    ) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this.dialogRef.close({'toDate': this.toDate.toISOString()});
  }

}
