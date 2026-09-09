import { Routes } from '@angular/router';

import { authChildGuard } from '@core/auth/auth.guard';
import { requireAnyRole } from '@core/auth/role.guard';
import { AuthenticatedLayoutComponent } from '@layout/authenticated-layout/authenticated-layout.component';
import { AuthLayoutComponent } from '@layout/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from '@layout/blank-layout/blank-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivateChild: [authChildGuard],
    data: { layout: 'authenticated' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        data: {
          title: 'Engineering Hub Dashboard',
          subtitle: 'Delivery, health, and activity at a glance.',
          breadcrumb: 'Dashboard',
        },
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        canActivate: [requireAnyRole(['SuperAdmin'])],
        data: {
          title: 'User Management',
          subtitle: 'People and access.',
          breadcrumb: 'Users',
        },
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'projects',
        data: {
          title: 'Project Portfolio',
          subtitle: 'Active repositories and delivery health.',
          breadcrumb: 'Projects',
        },
        loadChildren: () =>
          import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES),
      },
      {
        path: 'activity',
        data: {
          title: 'Audit & Activity Stream',
          subtitle: 'Recent delivery and audit events.',
          breadcrumb: 'Activity',
        },
        loadChildren: () =>
          import('./features/activity/activity.routes').then((m) => m.ACTIVITY_ROUTES),
      },
      {
        path: 'settings',
        data: {
          title: 'Preferences & Security',
          subtitle: 'Workspace preferences.',
          breadcrumb: 'Settings',
        },
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
    ],
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    data: { layout: 'auth' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        data: {
          title: 'Sign In',
          breadcrumb: 'Sign In',
        },
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent,
          ),
      },
    ],
  },

  {
    path: 'reports',
    component: BlankLayoutComponent,
    data: { layout: 'blank' },
    children: [
      {
        path: 'print',
        data: {
          title: 'Engineering Audit Report',
          breadcrumb: 'Audit Report',
        },
        loadComponent: () =>
          import('./features/reports/pages/print-report-page/print-report-page.component').then(
            (m) => m.PrintReportPageComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
