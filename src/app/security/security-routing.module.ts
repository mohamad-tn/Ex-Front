import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { UserComponent } from './user/user.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { RoleComponent } from './role/role.component';

const routes: Routes = [{
  path: '',
  component: SecurityComponent,
  children: [
    {
      path: 'user',
      component: UserComponent,
      data: { permission : 'Pages.Users' },
      canActivate: [AppRouteGuard]
    },
    {
      path: 'role',
      component: RoleComponent,
      data: { permission : 'Pages.Roles' },
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
export class SecurityRoutingModule { }
