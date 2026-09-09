import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardStateService } from '@features/dashboard/state/dashboard-state.service';

describe('DashboardStateService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads summary, activity, and project health', async () => {
    const state = TestBed.inject(DashboardStateService);
    const load = state.loadDashboard();

    expect(state.loading()).toBe(true);

    await vi.runAllTimersAsync();
    await load;

    expect(state.loading()).toBe(false);
    expect(state.error()).toBeNull();
    expect(state.summary()?.activeUsers).toBe(42);
    expect(state.recentActivity().length).toBeGreaterThan(0);
    expect(state.projectHealth().length).toBeGreaterThan(0);
    expect(state.hasData()).toBe(true);
    expect(state.healthyProjectCount()).toBe(2);
  });
});
