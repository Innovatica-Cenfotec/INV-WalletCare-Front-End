import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SignupComponent } from './pages/auth/sign-up/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { ILayout, IRole } from './interfaces';
import { UsersComponent } from './pages/users/users.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children:[
      {
        path: '',
        component: LandingPageComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'signup',
        component: SigUpComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'access-denied',
        component: AccessDeniedComponent,
      }
    ]
  },
  
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          layout: <ILayout>{
            icon: 'home',
            breadcrumb: ['Inicio'],
            name: 'Inicio',
          },
        }
      },
      {
        path: 'accounts',
        component: AccountsComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          layout: <ILayout>{
            icon: 'form',
            breadcrumb: ['Cuenta'],
            name: 'Mis cuentas',
          },
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          showInSidebar: false,
          layout: <ILayout>{
            icon: 'user',
            breadcrumb: ['Perfil'],
            name: 'Perfil',
          },
        }
      }
    ],
  }
];