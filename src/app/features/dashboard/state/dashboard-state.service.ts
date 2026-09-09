import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';

import { DashboardApiService } from '@features/dashboard/data-access/dashboard-api.service';
import {
  DashboardSummary,
  ProjectHealth,
  RecentActivity,
} from '@features/dashboard/models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardStateService {
  private readonly dashboardApi = inject(DashboardApiService);

  private readonly loadingState = signal(false);
  private readonly summaryState = signal<DashboardSummary | null>(null);
  private readonly recentActivityState = signal<RecentActivity[]>([]);
  private readonly projectHealthState = signal<ProjectHealth[]>([]);
  private readonly errorState = signal<string | null>(null);

  readonly loading = this.loadingState.asReadonly();
  readonly summary = this.summaryState.asReadonly();
  readonly recentActivity = this.recentActivityState.asReadonly();
  readonly projectHealth = this.projectHealthState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly hasData = computed(() => this.summaryState() !== null);
  readonly healthyProjectCount = computed(
    () => this.projectHealthState().filter((project) => project.status === 'healthy').length,
  );

  async loadDashboard(): Promise<void> {
    if (this.loadingState()) {
      return;
    }
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const { summary, recentActivity, projectHealth } = await firstValueFrom(
        forkJoin({
          summary: this.dashboardApi.getSummary(),
          recentActivity: this.dashboardApi.getRecentActivity(),
          projectHealth: this.dashboardApi.getProjectHealth(),
        }),
      );
      this.summaryState.set(summary);
      this.recentActivityState.set(recentActivity);
      this.projectHealthState.set(projectHealth);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load dashboard');
    } finally {
      this.loadingState.set(false);
    }
  }
}
