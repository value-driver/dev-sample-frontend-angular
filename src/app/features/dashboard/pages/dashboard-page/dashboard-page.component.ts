import { Component, inject } from '@angular/core';
import {
  LucideActivity,
  LucideAlertTriangle,
  LucideCheckCircle2,
  LucideChevronDown,
  LucideChevronUp,
  LucideGitBranch,
  LucideRocket,
  LucideShieldCheck,
  LucideUsers,
} from '@lucide/angular';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { DashboardStateService } from '@features/dashboard/state/dashboard-state.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    NzCardModule,
    NzSkeletonModule,
    NzTagModule,
    NzAlertModule,
    LucideUsers,
    LucideGitBranch,
    LucideRocket,
    LucideShieldCheck,
    LucideCheckCircle2,
    LucideAlertTriangle,
    LucideActivity,
    LucideChevronUp,
    LucideChevronDown,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  protected readonly dashboardState = inject(DashboardStateService);
  private readonly now = Date.now();

  constructor() {
    void this.dashboardState.loadDashboard();
  }

  protected readonly activityTypeLabel: Record<string, string> = {
    deploy: 'Deploy',
    pr: 'PR',
    alert: 'Alert',
    user: 'User',
  };

  protected activityTypeColor(type: string): string {
    const map: Record<string, string> = {
      deploy: 'blue',
      pr: 'green',
      alert: 'orange',
      user: 'purple',
    };
    return map[type] ?? 'default';
  }

  protected projectStatusColor(status: string): string {
    const map: Record<string, string> = {
      healthy: 'success',
      warning: 'warning',
      failing: 'error',
    };
    return map[status] ?? 'default';
  }

  protected formatRelative(iso: string): string {
    const diff = Math.max(0, this.now - new Date(iso).getTime());
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}
