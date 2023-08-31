import { AppComponentBase } from "@shared/app-component-base";
import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import {
  BranchServiceProxy,
  CountryDto,
  CountryServiceProxy,
  CreateBranchDto,
  GeneralSettingDto,
  GeneralSettingServiceProxy,
  ProvinceGroupDto,
  ProvinceServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { NbDialogRef } from "@nebular/theme";

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
  provinces: ProvinceGroupDto[] = [];
  company: string = "";
  public fields: Object = {
    groupBy: "group",
    text: "name",
    value: "provinceId",
  };
  @Output() onSave = new EventEmitter<any>();
  provinceId: any;

  constructor(
    injector: Injector,
    public _branchService: BranchServiceProxy,
    public _provinceService: ProvinceServiceProxy,
    public _generalSettingService: GeneralSettingServiceProxy,
    public dialogRef: NbDialogRef<CreateBranchDialogComponent>
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.branch.isActive = true;
    this.initialProvinces();
    this.initialCompanyName();
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

  onActivatedValueChanged(checked) {
    this.branch.isActive = checked;
  }

  save(): void {
    this.provinces.forEach((x) => {
      if (x.provinceId === this.provinceId) {
        this.branch.countryId = x.countryId;
        this.branch.name = this.company + "-" + x.name;
      }
    });
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
