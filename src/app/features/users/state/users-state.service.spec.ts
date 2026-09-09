import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UsersStateService } from '@features/users/state/users-state.service';

describe('UsersStateService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads paginated users', async () => {
    const state = TestBed.inject(UsersStateService);
    const load = state.loadUsers();

    expect(state.loading()).toBe(true);

    await vi.runAllTimersAsync();
    await load;

    expect(state.loading()).toBe(false);
    expect(state.users()).toHaveLength(10);
    expect(state.total()).toBe(15);
  });

  it('resets pagination and filters by search query', async () => {
    const state = TestBed.inject(UsersStateService);
    const update = state.setSearchQuery('user1');

    await vi.runAllTimersAsync();
    await update;

    expect(state.searchQuery()).toBe('user1');
    expect(state.pageIndex()).toBe(1);
    expect(state.users().every((user) => user.email.includes('user1'))).toBe(true);
  });

  it('creates a user and refreshes the list', async () => {
    const state = TestBed.inject(UsersStateService);
    const create = state.createUser({
      name: 'New Engineer',
      email: 'new.engineer@example.com',
      role: 'developer',
      status: 'active',
    });

    await vi.runAllTimersAsync();
    await create;

    expect(state.saving()).toBe(false);
    expect(state.total()).toBe(16);
    expect(state.users()[0].email).toBe('new.engineer@example.com');
  });
});
