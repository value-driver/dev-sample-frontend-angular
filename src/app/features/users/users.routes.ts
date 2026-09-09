import { Routes } from '@angular/router';
import { UsersListPageComponent } from '@features/users/pages/users-list/users-list-page.component';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersListPageComponent,
  },
];
