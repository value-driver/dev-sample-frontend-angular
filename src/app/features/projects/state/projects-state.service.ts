import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ProjectsApiService } from '@features/projects/data-access/projects-api.service';
import { Project } from '@features/projects/models/project.models';

@Injectable({ providedIn: 'root' })
export class ProjectsStateService {
  private readonly projectsApi = inject(ProjectsApiService);

  private readonly projectsState = signal<Project[]>([]);
  private readonly loadingState = signal(false);
  private readonly savingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly projects = this.projectsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly saving = this.savingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly activeProjects = computed(() =>
    this.projectsState().filter((project) => project.status === 'active'),
  );

  async loadProjects(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      this.projectsState.set(await firstValueFrom(this.projectsApi.getProjects()));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to load projects');
    } finally {
      this.loadingState.set(false);
    }
  }

  async createProject(projectData: Partial<Project>): Promise<void> {
    this.savingState.set(true);
    this.errorState.set(null);

    try {
      const project = await firstValueFrom(this.projectsApi.createProject(projectData));
      this.projectsState.update((projects) => [...projects, project]);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      this.savingState.set(false);
    }
  }

  async archiveProject(id: string): Promise<void> {
    this.savingState.set(true);
    this.errorState.set(null);

    try {
      const archivedId = await firstValueFrom(this.projectsApi.archiveProject(id));
      this.projectsState.update((projects) =>
        projects.map((project) =>
          project.id === archivedId ? { ...project, status: 'archived' } : project,
        ),
      );
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to archive project');
    } finally {
      this.savingState.set(false);
    }
  }
}
