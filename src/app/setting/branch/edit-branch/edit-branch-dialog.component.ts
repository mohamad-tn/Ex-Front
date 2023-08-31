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
  GeneralSettingServiceProxy,
  ProvinceGroupDto,
  ProvinceServiceProxy,
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
  provinces: ProvinceGroupDto[] = [];
  company: string = "";
  public fields: Object = {groupBy: 'group', text: "name", value: "provinceId" };
  provinceId: any=0;
  @Output() onSave = new EventEmitter<any>();

  ngOnInit(): void {
    this._branchService
      .getForEdit(this.id)
      .subscribe((result: UpdateBranchDto) => {
        this.branch = result;
        this.provinceId = result.id;
      });
    this.initialProvinces();
    this.initialCompanyName();
  }

  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<EditBranchDialogComponent>,
    public _provinceService: ProvinceServiceProxy,
    public _generalSettingService: GeneralSettingServiceProxy,
    public _branchService: BranchServiceProxy
  ) {
    super(injector);
  }

  initialProvinces() {
    this._provinceService.getProvinceGroup().subscribe((result) => {
      this.provinces = result;
    });
  }

  initialCompanyName() {
    this._generalSettingService.get().subscribe((result) => {
      this.company = result.companyName;
    });
  }

  save(): void {
    this.saving = true;
    this.provinces.forEach((x) => {
      if (x.provinceId === this.provinceId) {
        this.branch.name = this.company + "-" + x.name;
        this.branch.countryId = x.countryId;
      }
    });

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
