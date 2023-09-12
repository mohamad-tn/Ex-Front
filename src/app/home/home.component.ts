import {
  IncomeTransferServiceProxy,
  OutgoingTransferServiceProxy,
} from "@shared/service-proxies/service-proxies";
import {
  Component,
  Injector,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { inputs } from "@syncfusion/ej2-angular-grids/src/grid/grid.component";
import {
  NbComponentShape,
  NbComponentSize,
  NbComponentStatus,
  NbThemeService,
} from "@nebular/theme";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Route, Router } from "@angular/router";

@Component({
  templateUrl: "./home.component.html",
  // animations: [appModuleAnimation()],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeComponent extends AppComponentBase implements OnInit {
  public readonly materialTheme$: Observable<boolean>;

  public readonly statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  public readonly shapes: NbComponentShape[] = [
    "rectangle",
    "semi-round",
    "round",
  ];
  public readonly sizes: NbComponentSize[] = [
    "tiny",
    "small",
    "medium",
    "large",
    "giant",
  ];
  date = new Date();

  constructor(
    injector: Injector,
    private router: Router,
    private readonly themeService: NbThemeService,
    private _outgoingTransfers: OutgoingTransferServiceProxy,
    private _incomingTransfers: IncomeTransferServiceProxy
  ) {
    super(injector);
    this.materialTheme$ = this.themeService.onThemeChange().pipe(
      map((theme) => {
        const themeName: string = theme?.name || "";
        return themeName.startsWith("material");
      })
    );
  }

  userId: number;
  outgoingPending: number;
  outgoingAccepted: number;
  outgoingRejected: number;
  incomePending: number;
  incomeAccepted: number;
  incomeRejected: number;

  ngOnInit(): void {
    console.log(this.isGranted("Pages.BranchTransfersCounter"));

    if (this.isGranted("Pages.BranchTransfersCounter")) {
      this.userId = this.appSession.userId;
      this.branchOutgoingTransfers(this.userId);
      this.branchIncomingTransfers(this.userId);
      console.log(this.isGranted("Pages.BranchTransfersCounter"));

      setTimeout(() => {
        this.ngOnInit();
      }, 5000);
    }
  }

  GoTo() {
    this.router.navigateByUrl("/app/transfer/edit-outgoing-transfer", {
      state: { id: 4, name: "edit-outgoing-transfer" },
    });
  }

  branchOutgoingTransfers(userId: number) {
    this._outgoingTransfers
      .getAllOutgoingTransfersForBranch(userId)
      .subscribe((result) => {
        this.outgoingPending = result.Pending;
        this.outgoingAccepted = result.Accepted;
        this.outgoingRejected = result.Rejected;
      });
  }

  branchIncomingTransfers(userId: number) {
    this._incomingTransfers
      .getAllIncomeTransfersForBranch(userId)
      .subscribe((result) => {
        this.incomePending = result.Pending;
        this.incomeAccepted = result.Accepted;
        this.incomeRejected = result.Rejected;
      });
  }
}
