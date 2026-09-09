import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProjectsStateService } from '@features/projects/state/projects-state.service';

describe('ProjectsStateService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads projects and derives active projects', async () => {
    const state = TestBed.inject(ProjectsStateService);
    const load = state.loadProjects();

    expect(state.loading()).toBe(true);

    await vi.runAllTimersAsync();
    await load;

    expect(state.loading()).toBe(false);
    expect(state.projects().length).toBeGreaterThan(0);
    expect(state.activeProjects().every((project) => project.status === 'active')).toBe(true);
  });

  it('archives a project in local state', async () => {
    const state = TestBed.inject(ProjectsStateService);
    const load = state.loadProjects();
    await vi.runAllTimersAsync();
    await load;

    const archive = state.archiveProject('1');
    await vi.runAllTimersAsync();
    await archive;

    expect(state.projects().find((project) => project.id === '1')?.status).toBe('archived');
    expect(state.saving()).toBe(false);
  });
});
