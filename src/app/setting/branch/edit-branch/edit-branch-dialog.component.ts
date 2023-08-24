import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { AppComponentBase } from "@shared/app-component-base";
import {
  BranchServiceProxy,
  UpdateBranchDto,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";

@Component({
  templateUrl: "edit-branch-dialog.component.html",
  styleUrls: ["edit-branch-dialog.component.scss"],
})
export class EditBranchDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  branch: UpdateBranchDto = new UpdateBranchDto();
  id: number;
  @Output() onSave = new EventEmitter<any>();

  ngOnInit(): void {
    this._branchService
      .getForEdit(this.id)
      .subscribe((result: UpdateBranchDto) => {
        this.branch = result;
      });
  }

  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<EditBranchDialogComponent>,
    public _branchService: BranchServiceProxy
  ) {
    super(injector);
  }

  save(): void {
    this.saving = true;

    this._branchService
      .update(this.branch)
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

  onActivatedValueChanged(checked) {
    this.branch.isActive = checked;
  }
}
