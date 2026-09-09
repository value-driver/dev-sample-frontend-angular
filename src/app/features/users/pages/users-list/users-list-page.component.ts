import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { User } from '@features/users/models/user.models';
import { UsersStateService } from '@features/users/state/users-state.service';
import { UserFormComponent } from '@features/users/ui/user-form/user-form.component';

@Component({
  selector: 'app-users-list-page',
  imports: [
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzModalModule,
    NzTagModule,
    LucideSearch,
  ],
  templateUrl: './users-list-page.component.html',
})
export class UsersListPageComponent implements OnInit {
  private readonly modalService = inject(NzModalService);
  protected readonly usersState = inject(UsersStateService);

  ngOnInit(): void {
    void this.usersState.loadUsers();
  }

  onSearch(query: string): void {
    void this.usersState.setSearchQuery(query);
  }

  onRoleFilterChange(role: string | null): void {
    void this.usersState.setRoleFilter(role);
  }

  onPageIndexChange(pageIndex: number): void {
    void this.usersState.setPageIndex(pageIndex);
  }

  onPageSizeChange(pageSize: number): void {
    void this.usersState.setPageSize(pageSize);
  }

  openUserForm(user?: User): void {
    const modal = this.modalService.create({
      nzTitle: user ? 'Edit User' : 'Create User',
      nzContent: UserFormComponent,
      nzFooter: null,
      nzData: { user },
    });

    modal.afterClose.subscribe((result: Omit<User, 'id' | 'createdAt'> | undefined) => {
      if (result) {
        if (user) {
          void this.usersState.updateUser(user.id, result);
        } else {
          void this.usersState.createUser(result);
        }
      }
    });
  }

  confirmDelete(user: User): void {
    this.modalService.confirm({
      nzTitle: `Delete ${user.name}?`,
      nzContent: 'This action cannot be undone.',
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.usersState.deleteUser(user.id),
    });
  }

  roleColor(role: string): string {
    const map: Record<string, string> = {
      admin: 'red',
      developer: 'blue',
      viewer: 'default',
    };
    return map[role] ?? 'default';
  }

  statusColor(status: string): string {
    return status === 'active' ? 'success' : 'default';
  }
}
