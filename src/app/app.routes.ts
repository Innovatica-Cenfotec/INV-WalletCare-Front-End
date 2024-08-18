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
import { GoalsComponent } from './pages/goals/goals.component';
import { SavingsComponent } from './pages/savings/savings.component';
import { UsersComponent } from './pages/users/users.component';

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
            IRole.user
          ],
          showInSidebar: true,
          layout: <ILayout>{
            icon: 'bank',
            breadcrumb: ['Mis ingresos'],
            name: 'Mis ingresos',
          },
        }
      },
      {
        path: 'savings',
        component: SavingsComponent,
        data: {
          authorities: [
            IRole.admin,
            IRole.user
          ],
          showInSidebar: true,
          layout: <ILayout>{
            icon: 'dollar-circle',
            breadcrumb: ['Mis ahorros'],
            name: 'Mis ahorros',
          },
        }
      },
      {
        path: 'expense',
        component: ExpensesComponent,
       data: {
          authorities: [
            IRole.user
          ],
          showInSidebar: true,
          layout: <ILayout>{
            icon: 'fall',
            breadcrumb: ['Mis gastos'],
            name: 'Mis gastos',
          },
        }
      },
      {
        path: 'goals',
        component: GoalsComponent,
       data: {
          authorities: [
            IRole.admin,
            IRole.user            
          ],
          showInSidebar: true,
          layout: <ILayout>{
            icon: 'fund-view',
            breadcrumb: ['Metas'],
            name: 'Metas',
          },
        }
      },
      {
        path: 'users',
        component: UsersComponent,
       data: {
          authorities: [
            IRole.admin         
          ],
          showInSidebar: true,
          layout: <ILayout>{
            icon: 'usergroup-add',
            breadcrumb: ['Usuarios'],
            name: 'Usuarios',
          },
        }
      },
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