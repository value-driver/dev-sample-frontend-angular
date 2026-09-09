import { provideHttpClient, withFetch } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import { RuntimeConfigService } from '@core/config/runtime-config.service';
import { ActivityExternalApiService } from './activity-external-api.service';

const endpoint = 'https://api.github.com/events';
const server = setupServer(
  http.get(endpoint, () =>
    HttpResponse.json([
      {
        id: '1',
        type: 'PullRequestEvent',
        actor: { login: 'octocat' },
        repo: { name: 'frontend-reference-app' },
        created_at: '2026-09-08T10:00:00Z',
        payload: { action: 'opened' },
      },
    ]),
  ),
);

describe('ActivityExternalApiService', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('maps an external response without using internal credentials', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        ActivityExternalApiService,
        {
          provide: RuntimeConfigService,
          useValue: { config: () => ({ externalActivityUrl: endpoint }) },
        },
      ],
    });

    const service = TestBed.inject(ActivityExternalApiService);
    const events = await firstValueFrom(service.getRecentActivity());

    expect(events).toEqual([
      expect.objectContaining({
        type: 'pr',
        actor: 'octocat',
        projectName: 'frontend-reference-app',
      }),
    ]);
  });
});
