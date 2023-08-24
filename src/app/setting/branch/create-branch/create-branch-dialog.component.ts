import { AppComponentBase } from '@shared/app-component-base';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BranchServiceProxy, CreateBranchDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { NbDialogRef } from '@nebular/theme';



@Component({
  templateUrl: "create-branch-dialog.component.html",
  styleUrls: ["create-branch-dialog.component.scss"],
  providers: [BranchServiceProxy],
})
export class CreateBranchDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  branch: CreateBranchDto = new CreateBranchDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _branchService: BranchServiceProxy,
    public dialogRef: NbDialogRef<CreateBranchDialogComponent>
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.branch.isActive = true;
  }

  onActivatedValueChanged(checked) {
    this.branch.isActive = checked;
  }

  save(): void {
    this.saving = true;
    this._branchService
      .create(this.branch)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
}