import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { DirectTransferComponent } from './direct-transfer/direct-transfer.component';
import { PayDirectTransferComponent } from './direct-transfer/pay-direct-transfer/pay-direct-transfer.component';
import { CreateIncomeTransferComponent } from './income-transfer/create-income-transfer/create-income-transfer.component';
import { EditIncomeTransferComponent } from './income-transfer/edit-income-transfer/edit-income-transfer.component';
import { CreateOutgoingTransferComponent } from './outgoing-transfer/create-outgoing-transfer/create-outgoing-transfer.component';
import { EditOutgoingTransferComponent } from './outgoing-transfer/edit-outgoing-transfer/edit-outgoing-transfer.component';
import { SearchOutgoingTransferComponent } from './outgoing-transfer/search-outgoin-transfer/search-outgoing-transfer.component';
import { TransferComponent } from './transfer.component';

const routes: Routes = [{
  path: '',
  component: TransferComponent,
  children: [
    {
      path: 'create-outgoing-transfer',
      component: CreateOutgoingTransferComponent,
      data: { permission : 'Pages.OutgoingTransfers' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'edit-outgoing-transfer',
      component: EditOutgoingTransferComponent,
      data: { permission : 'Pages.OutgoingTransfers' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'search-outgoing-transfer',
      component: SearchOutgoingTransferComponent,
      data: { permission : 'Pages.OutgoingTransfers' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'create-income-transfer',
      component: CreateIncomeTransferComponent,
      //data: { permission : 'Pages.IncomeTransfers.Create' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'edit-income-transfer',
      component: EditIncomeTransferComponent,
      //data: { permission : 'Pages.IncomeTransfers.Edit' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'direct-transfer',
      component: DirectTransferComponent,
      //data: { permission : 'Pages.' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'pay-direct-transfer',
      component: PayDirectTransferComponent,
      //data: { permission : 'Pages.' },
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
export class TransferRoutingModule { }
