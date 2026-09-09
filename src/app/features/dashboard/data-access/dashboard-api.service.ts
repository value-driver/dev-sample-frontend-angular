import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { ApiClient } from '@core/http/api-client/api-client.service';
import {
  DashboardSummary,
  ProjectHealth,
  RecentActivity,
} from '@features/dashboard/models/dashboard.models';

const MOCK_SUMMARY: DashboardSummary = {
  activeUsers: 42,
  activeUsersChange: 12,
  openProjects: 8,
  openProjectsChange: -1,
  deploymentsToday: 5,
  deploymentsTodayChange: 25,
  testCoverage: '87%',
  testCoverageChange: 3,
  securityStatus: 'healthy',
};

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    type: 'deploy',
    title: 'Deployed to production',
    description: 'api-gateway v2.4.1 deployed successfully',
    timestamp: new Date(Date.now() - 15 * 60_000).toISOString(),
    actor: 'Alex Chen',
  },
  {
    id: '2',
    type: 'pr',
    title: 'Pull request merged',
    description: 'feat: add user pagination to /users endpoint',
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
    actor: 'Sam Rivera',
  },
  {
    id: '3',
    type: 'user',
    title: 'New team member joined',
    description: 'Jordan Kim joined the platform team',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
    actor: 'Jordan Kim',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Coverage threshold warning',
    description: 'auth-service coverage dropped to 78% (threshold: 80%)',
    timestamp: new Date(Date.now() - 4 * 3600_000).toISOString(),
    actor: 'CI Pipeline',
  },
  {
    id: '5',
    type: 'deploy',
    title: 'Deployed to staging',
    description: 'frontend-app v3.1.0-rc.2 deployed to staging',
    timestamp: new Date(Date.now() - 5 * 3600_000).toISOString(),
    actor: 'Morgan Lee',
  },
];

const MOCK_PROJECT_HEALTH: ProjectHealth[] = [
  {
    id: '1',
    name: 'api-gateway',
    status: 'healthy',
    coverage: 92,
    lastDeploy: new Date(Date.now() - 15 * 60_000).toISOString(),
  },
  {
    id: '2',
    name: 'frontend-app',
    status: 'healthy',
    coverage: 87,
    lastDeploy: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    id: '3',
    name: 'auth-service',
    status: 'warning',
    coverage: 78,
    lastDeploy: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
  },
  {
    id: '4',
    name: 'notification-worker',
    status: 'failing',
    coverage: 61,
    lastDeploy: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
  },
];

// Replace these delayed fixtures with ApiClient calls in a product application.
@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly _api = inject(ApiClient);

  getSummary(): Observable<DashboardSummary> {
    return of(MOCK_SUMMARY).pipe(delay(300));
  }

  getRecentActivity(): Observable<RecentActivity[]> {
    return of(MOCK_RECENT_ACTIVITY).pipe(delay(450));
  }

  getProjectHealth(): Observable<ProjectHealth[]> {
    return of(MOCK_PROJECT_HEALTH).pipe(delay(350));
  }
}
