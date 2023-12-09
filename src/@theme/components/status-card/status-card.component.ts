import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "ngx-status-card",
  styleUrls: ["./status-card.component.scss"],
  template: `
    <nb-card (click)="goTo(destination)">
      <div class="icon-container">
        <div class="icon status-primary">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h5">{{ title }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {
  @Input() title: string;
  @Input() destination: string;

  constructor(private router: Router) {}

  goTo(destination) {
    switch (destination) {
      case "Countries":
        this.router.navigateByUrl("/app/setting/country");
        break;
      case "Currencies":
        this.router.navigateByUrl("/app/setting/currency");
        break;
      case "Companies":
        this.router.navigateByUrl("/app/setting/company");
        break;
      case "Clients":
        this.router.navigateByUrl("/app/setting/client");
        break;
      case "InitialBalance":
        this.router.navigateByUrl("/app/setting/initial-balance");
        break;
      case "Commision":
        this.router.navigateByUrl("/app/setting/commision");
        break;
      case "Expenses":
        this.router.navigateByUrl("/app/setting/expense");
        break;
      case "Incomes":
        this.router.navigateByUrl("/app/setting/income");
        break;
      case "ExchangePrice":
        this.router.navigateByUrl("/app/setting/exchange-price");
        break;
      case "GeneralSetting":
        this.router.navigateByUrl("/app/setting/general-setting");
        break;
      case "OutgoingTransfers":
        this.router.navigateByUrl("/app/transfer/create-outgoing-transfer");
        break;
      case "IncomeTransfers":
        this.router.navigateByUrl("/app/transfer/create-income-transfer");
        break;
      case "NoneReceivedTransfer":
        this.router.navigateByUrl("/app/transfer/direct-transfer");
        break;
      case "SendTransfers":
        this.router.navigateByUrl("/app/transfer/sending-outgoing");
        break;
      case "ExchangeCurrency":
        this.router.navigateByUrl("/app/exchange-currency/create");
        break;
      case "Treasury":
        this.router.navigateByUrl("/app/treasury/treasury-action");
        break;
      case "ClientBalanceStatement":
        this.router.navigateByUrl(
          "/app/statement/total-client-balance-statement"
        );
        break;
      case "CompanyBalanceStatement":
        this.router.navigateByUrl(
          "/app/statement/total-company-balance-statement"
        );
        break;
      case "TreasuryBalanceStatement":
        this.router.navigateByUrl("/app/statement/treasury-balance-statement");
        break;
      case "TotalBalanceStatement":
        this.router.navigateByUrl("/app/statement/total-balance-statement");
        break;
      case "OutgoingTransferStatement":
        this.router.navigateByUrl("/app/statement/outgoing-transfer-statement");
        break;
      case "SpendsStatment":
        this.router.navigateByUrl("/app/statement/spends-statement");
        break;
      case "ReceiptsStatment":
        this.router.navigateByUrl("/app/statement/receipts-statement");
        break;
      case "DefaultersOfPayment":
        this.router.navigateByUrl(
          "/app/statement/defaulters-of-payment-statement"
        );
        break;
      case "InactiveClientStatment":
        this.router.navigateByUrl("/app/statement/inactive-client-statement");
        break;
      case "ExchangeCurrencyStatement":
        this.router.navigateByUrl("/app/statement/exchange-currency-statement");
        break;
      case "Customers":
        this.router.navigateByUrl("/app/statement/customer-statement");
        break;
      case "Management":
        this.router.navigateByUrl("/app/statement/management-statement");
        break;
      case "Summary":
        this.router.navigateByUrl("/app/statement/summary-statement");
        break;
      case "Users":
        this.router.navigateByUrl("/app/security/user");
        break;
      case "Roles":
        this.router.navigateByUrl("/app/security/role");
        break;

      default:
        break;
    }
  }
}
