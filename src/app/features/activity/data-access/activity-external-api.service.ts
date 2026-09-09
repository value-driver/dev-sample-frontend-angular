import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, retry } from 'rxjs';

import { RuntimeConfigService } from '@core/config/runtime-config.service';
import { ActivityEvent } from '@features/activity/models/activity.models';

// External integrations use HttpClient directly so internal credentials are never forwarded.
@Injectable({
  providedIn: 'root',
})
export class ActivityExternalApiService {
  private readonly http = inject(HttpClient);
  private readonly runtimeConfig = inject(RuntimeConfigService);

  getRecentActivity(limit = 20): Observable<ActivityEvent[]> {
    return this.http
      .get<ReadonlyArray<GitHubEvent>>(this.runtimeConfig.config().externalActivityUrl)
      .pipe(
        map((events) => events.slice(0, limit).map(toActivityEvent)),
        retry({ count: 2, delay: 1000 }),
      );
  }

  getActivityForProject(projectId: string): Observable<ActivityEvent[]> {
    return this.getRecentActivity(100).pipe(
      map((events) => events.filter((event) => event.projectName === projectId)),
    );
  }
}

interface GitHubEvent {
  readonly id: string;
  readonly type: string;
  readonly actor?: { readonly login?: string };
  readonly repo?: { readonly name?: string };
  readonly created_at: string;
  readonly payload?: { readonly action?: string };
}

function toActivityEvent(event: GitHubEvent): ActivityEvent {
  const type = event.type.includes('PullRequest')
    ? 'pr'
    : event.type.includes('Issue')
      ? 'issue'
      : event.type.includes('Review')
        ? 'review'
        : 'commit';

  return {
    id: event.id,
    type,
    actor: event.actor?.login ?? 'unknown',
    projectName: event.repo?.name ?? 'unknown',
    description: event.payload?.action ?? event.type,
    timestamp: event.created_at,
  };
}
