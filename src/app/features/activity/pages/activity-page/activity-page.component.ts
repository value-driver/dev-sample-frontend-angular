import { Component, inject, OnInit, signal } from '@angular/core';
import {
  LucideCircleDot,
  LucideEye,
  LucideGitCommit,
  LucideGitPullRequest,
  LucideRefreshCw,
  LucideRocket,
} from '@lucide/angular';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { catchError, finalize, of } from 'rxjs';

import { ActivityEvent } from '@features/activity/models/activity.models';
import { ActivityExternalApiService } from '@features/activity/data-access/activity-external-api.service';

@Component({
  selector: 'app-activity-page',
  imports: [
    NzCardModule,
    NzTimelineModule,
    NzSkeletonModule,
    NzTagModule,
    NzButtonModule,
    NzAlertModule,
    NzEmptyModule,
    LucideGitCommit,
    LucideGitPullRequest,
    LucideRocket,
    LucideCircleDot,
    LucideEye,
    LucideRefreshCw,
  ],
  templateUrl: './activity-page.component.html',
})
export class ActivityPageComponent implements OnInit {
  private readonly activityService = inject(ActivityExternalApiService);

  readonly events = signal<ActivityEvent[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadActivity();
  }

  loadActivity(): void {
    this.loading.set(true);
    this.error.set(null);

    this.activityService
      .getRecentActivity(20)
      .pipe(
        catchError(() => {
          this.error.set(
            'Failed to load activity stream from external API. Resilient retry strategy available.',
          );
          return of([]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((data) => {
        if (!this.error()) {
          this.events.set(data);
        }
      });
  }

  typeColor(type: string): string {
    const map: Record<string, string> = {
      commit: 'blue',
      pr: 'green',
      deploy: 'orange',
      issue: 'red',
      review: 'purple',
    };
    return map[type] ?? 'default';
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      commit: 'Commit',
      pr: 'Pull Request',
      deploy: 'Deployment',
      issue: 'Issue',
      review: 'Code Review',
    };
    return map[type] ?? type.toUpperCase();
  }

  formatRelative(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}
