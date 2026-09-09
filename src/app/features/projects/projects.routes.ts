import { Routes } from '@angular/router';

import { RouteLabelContext } from '@core/layout/breadcrumb.models';
import { unsavedChangesGuard } from '@core/forms/unsaved-changes.guard';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/projects-list/projects-list-page.component').then(
            (m) => m.ProjectsListPageComponent,
          ),
      },
      {
        path: ':id',
        data: {
          title: ({ params }: RouteLabelContext) => `Project ${params['id']}`,
          breadcrumb: ({ params }: RouteLabelContext) => `Project ${params['id']}`,
        },
        canDeactivate: [unsavedChangesGuard],
        loadComponent: () =>
          import('./pages/project-detail/project-detail-page.component').then(
            (m) => m.ProjectDetailPageComponent,
          ),
      },
    ],
  },
];
