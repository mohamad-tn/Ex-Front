import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { ClientBalanceStatementComponent } from './client-balance-statement/client-balance-statement.component';
import { CompanyBalanceStatementComponent } from './company-balance-statement/company-balance-statement.component';
import { DefaultersOfPaymentStatementComponent } from './defaulters-of-payment-statment/defaulters-of-payment-statement.component';
import { ExchangeCurrencyStatementComponent } from './exchange-currency-statement/exchange-currency-statement.component';
import { InactiveClientStatementComponent } from './inactive-client-statement/inactive-client-statement.component';
import { OutgoingTransferStatementComponent } from './outgoing-transfer-statement/outgoing-transfer-statement.component';
import { ReceiptsStatmentComponent } from './receipts-statement/receipts-statment.component';
import { SpendsStatmentComponent } from './spends-statment/spends-statment.component';
import { StatementComponent } from './statement.component';
import { SummaryStatementComponent } from './summary-statement/summary-statement/summary-statement.component';
import { TotalBalanceStatmentComponent } from './total-balance-statment/total-balance-statment.component';
import { TotalClientBalanceStatmentComponent } from './total-client-balance-statment/total-client-balance-statment.component';
import { TotalCompanyBalanceStatmentComponent } from './total-company-balance-statment/total-company-balance-statment.component';
import { TreasuryBalanceStatementComponent } from './treasury-balance-statment/treasury-balance-statement.component';

const routes: Routes = [{
  path: '',
  component: StatementComponent,
  children: [
    {
      path: 'client-balance-statement',
      component: ClientBalanceStatementComponent,
      //data: { permission : 'Pages.ClientBalanceStatements' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'total-client-balance-statement',
      component: TotalClientBalanceStatmentComponent,
      //data: { permission : 'Pages.TotalClientBalanceStatments' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'company-balance-statement',
      component: CompanyBalanceStatementComponent,
      //data: { permission : 'Pages.CompanyBalanceStatements' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'total-company-balance-statement',
      component: TotalCompanyBalanceStatmentComponent,
      //data: { permission : 'Pages.TotalCompanyBalanceStatments' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'total-balance-statement',
      component: TotalBalanceStatmentComponent,
      //data: { permission : 'Pages.TotalBalanceStatments' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'outgoing-transfer-statement',
      component: OutgoingTransferStatementComponent,
      //data: { permission : 'Pages.OutgoingTransferStatements' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'treasury-balance-statement',
      component: TreasuryBalanceStatementComponent,
      //data: { permission : 'Pages.CompanyBalanceStatements' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'spends-statement',
      component: SpendsStatmentComponent,
      //data: { permission : 'Pages.SpendsStatments' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'receipts-statement',
      component: ReceiptsStatmentComponent,
      //data: { permission : 'Pages.ReceiptsStatments' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'defaulters-of-payment-statement',
      component: DefaultersOfPaymentStatementComponent,
      //data: { permission : 'Pages.DefaultersOfPaymentStatements' },
      canActivate: [AppRouteGuard]
    },//
    {
      path: 'inactive-client-statement',
      component: InactiveClientStatementComponent,
      //data: { permission : 'Pages.InactiveClientStatement' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'exchange-currency-statement',
      component: ExchangeCurrencyStatementComponent,
      //data: { permission : 'Pages.InactiveClientStatement' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'summary-statement',
      component: SummaryStatementComponent,
      //data: { permission : 'Pages.SummaryStatements' },
      canActivate: [AppRouteGuard]
    },
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class StatementRoutingModule { }
