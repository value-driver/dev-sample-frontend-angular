import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideSearch } from '@lucide/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { ProjectsStateService } from '@features/projects/state/projects-state.service';
import { ProjectCardComponent } from '@features/projects/ui/project-card/project-card.component';
import { PageStateComponent } from '@shared/ui/page-state/page-state.component';

@Component({
  selector: 'app-projects-list-page',
  imports: [
    FormsModule,
    NzCardModule,
    NzSkeletonModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    ProjectCardComponent,
    PageStateComponent,
    LucideSearch,
  ],
  templateUrl: './projects-list-page.component.html',
})
export class ProjectsListPageComponent implements OnInit {
  private readonly modal = inject(NzModalService);
  readonly projectsState = inject(ProjectsStateService);

  readonly search = signal('');
  readonly statusFilter = signal<string | null>(null);

  readonly filteredProjects = computed(() => {
    let list = this.projectsState.projects();
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();

    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.ownerName.toLowerCase().includes(query),
      );
    }

    if (status) {
      list = list.filter((p) => p.status === status);
    }

    return list;
  });

  ngOnInit(): void {
    void this.projectsState.loadProjects();
  }

  onArchive(id: string): void {
    const project = this.projectsState.projects().find((p) => p.id === id);
    this.modal.confirm({
      nzTitle: `Archive "${project?.name ?? 'this project'}"?`,
      nzContent: 'Archived projects will remain accessible in read-only mode.',
      nzOkText: 'Archive',
      nzCancelText: 'Cancel',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.projectsState.archiveProject(id),
    });
  }

  reload(): void {
    void this.projectsState.loadProjects();
  }
}
