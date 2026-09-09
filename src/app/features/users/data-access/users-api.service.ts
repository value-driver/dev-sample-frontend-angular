import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '@features/users/models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private mockUsers: User[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `usr_${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'admin' : i % 2 === 0 ? 'developer' : 'viewer',
    status: i % 4 === 0 ? 'inactive' : 'active',
    createdAt: new Date(Date.now() - i * 100000000).toISOString(),
  }));

  getUsers(params: {
    search?: string;
    role?: string;
    page: number;
    pageSize: number;
  }): Observable<{ users: User[]; total: number }> {
    let filtered = this.mockUsers;
    if (params.search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          u.email.toLowerCase().includes(params.search!.toLowerCase()),
      );
    }
    if (params.role) {
      filtered = filtered.filter((u) => u.role === params.role);
    }
    const total = filtered.length;
    const start = (params.page - 1) * params.pageSize;
    const paginated = filtered.slice(start, start + params.pageSize);
    return of({ users: paginated, total }).pipe(delay(400));
  }

  getUser(id: string): Observable<User> {
    const user = this.mockUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return of(user).pipe(delay(400));
  }

  createUser(data: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...data,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.mockUsers = [newUser, ...this.mockUsers];
    return of(newUser).pipe(delay(400));
  }

  updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Observable<User> {
    const index = this.mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    this.mockUsers[index] = { ...this.mockUsers[index], ...data };
    return of(this.mockUsers[index]).pipe(delay(400));
  }

  deleteUser(id: string): Observable<void> {
    this.mockUsers = this.mockUsers.filter((u) => u.id !== id);
    return of(void 0).pipe(delay(400));
  }
}
