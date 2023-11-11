import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: "app-search-management-statement",
  templateUrl: "./search-management-statement.component.html",
  styleUrls: ["./search-management-statement.component.scss"],
})
export class SearchManagementStatementComponent implements OnInit {

  saving = false;
  fromDate: Date = new Date();
  toDate: Date = new Date();

  constructor(
    public dialogRef: NbDialogRef<SearchManagementStatementComponent>
  ) {}

  ngOnInit(): void {}

  save() {
    alert;
    this.dialogRef.close({
      fromDate: this.fromDate.toISOString(),
      toDate: this.toDate.toISOString(),
    });
  }
}
