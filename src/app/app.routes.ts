import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SignupComponent } from './pages/auth/sign-up/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { ILayout, IRole } from './interfaces';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './pages/forgot-password-reset/forgot-password-reset.component';
import { InviteAccountComponent } from './components/account/account-detail/invite-account/invite-account.component';
import { AccountInvitationComponent } from './pages/account-invitation/account-invitation.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';
import { IncomeComponent } from './pages/income/income.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'forgot-password-reset',
    component: ForgotPasswordResetComponent
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [GuestGuard],
  },
  {
    path:'invitation',
    component: AccountInvitationComponent
  },
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
        path: 'accounts/details/:id',
        component: AccountDetailComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          parent: 'accounts',
          showInSidebar: false,
          layout: <ILayout>{
            icon: 'form',
            breadcrumb: ['Cuenta', 'Detalle de cuenta'],
            name: 'Detalle de cuenta',
          },
        },
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
      },
      {
        path: 'income',
        component: IncomeComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          showInSidebar: true,
          layout: <ILayout>{
            icon: 'bank',
            breadcrumb: ['Ingresos'],
            name: 'Ingresos',
          },
        }
      },
      // {
      //   path: 'expense',
      //   component: ExpensesComponent,
      //   data: {
      //     authorities: [
      //       IRole.admin,
      //       IRole.user
      //     ],
      //     showInSidebar: true,
      //     layout: <ILayout>{
      //       icon: 'fall',
      //       breadcrumb: ['Gastos'],
      //       name: 'Gastos',
      //     },
      //   }
      // },
    ],
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: LandingPageComponent,
        canActivate: [GuestGuard],
      },
      {
        path: 'access-denied',
        component: AccessDeniedComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      }
    ],
  }
];