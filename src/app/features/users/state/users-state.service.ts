import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { UsersApiService } from '@features/users/data-access/users-api.service';
import { User } from '@features/users/models/user.models';

export interface UsersQuery {
  search?: string;
  role?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UsersStateService {
  private readonly api = inject(UsersApiService);

  private readonly usersState = signal<User[]>([]);
  private readonly totalState = signal(0);
  private readonly loadingState = signal(false);
  private readonly savingState = signal(false);
  private readonly deletingState = signal<string | null>(null);
  private readonly errorState = signal<string | null>(null);
  private readonly searchQueryState = signal('');
  private readonly roleFilterState = signal<string | null>(null);
  private readonly pageIndexState = signal(1);
  private readonly pageSizeState = signal(10);

  readonly users = this.usersState.asReadonly();
  readonly total = this.totalState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly saving = this.savingState.asReadonly();
  readonly deleting = this.deletingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly searchQuery = this.searchQueryState.asReadonly();
  readonly roleFilter = this.roleFilterState.asReadonly();
  readonly pageIndex = this.pageIndexState.asReadonly();
  readonly pageSize = this.pageSizeState.asReadonly();

  async loadUsers(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const response = await firstValueFrom(this.api.getUsers(this.query()));
      this.usersState.set(response.users);
      this.totalState.set(response.total);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      this.loadingState.set(false);
    }
  }

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<void> {
    this.savingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.api.createUser(user));
      await this.loadUsers();
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      this.savingState.set(false);
    }
  }

  async updateUser(id: string, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    this.savingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.api.updateUser(id, user));
      await this.loadUsers();
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      this.savingState.set(false);
    }
  }

  async deleteUser(id: string): Promise<void> {
    this.deletingState.set(id);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.api.deleteUser(id));
      await this.loadUsers();
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      this.deletingState.set(null);
    }
  }

  async setSearchQuery(query: string): Promise<void> {
    this.searchQueryState.set(query);
    this.pageIndexState.set(1);
    await this.loadUsers();
  }

  async setRoleFilter(role: string | null): Promise<void> {
    this.roleFilterState.set(role);
    this.pageIndexState.set(1);
    await this.loadUsers();
  }

  async setPageIndex(pageIndex: number): Promise<void> {
    this.pageIndexState.set(pageIndex);
    await this.loadUsers();
  }

  async setPageSize(pageSize: number): Promise<void> {
    this.pageSizeState.set(pageSize);
    this.pageIndexState.set(1);
    await this.loadUsers();
  }

  private query(): UsersQuery {
    return {
      search: this.searchQueryState(),
      role: this.roleFilterState() ?? undefined,
      page: this.pageIndexState(),
      pageSize: this.pageSizeState(),
    };
  }
}
