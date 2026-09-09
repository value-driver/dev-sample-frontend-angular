import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCalendar,
  LucideEdit,
  LucideSave,
  LucideUser,
  LucideUsers,
} from '@lucide/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { Project } from '@features/projects/models/project.models';
import { ProjectsApiService } from '@features/projects/data-access/projects-api.service';
import { PageTitleBreadcrumbService } from '@core/layout/page-title-breadcrumb.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    NzCardModule,
    NzDescriptionsModule,
    NzTagModule,
    NzButtonModule,
    NzSkeletonModule,
    NzFormModule,
    NzInputModule,
    LucideArrowLeft,
    LucideEdit,
    LucideSave,
    LucideUser,
    LucideUsers,
    LucideCalendar,
  ],
  templateUrl: './project-detail-page.component.html',
})
export class ProjectDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ProjectsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly pageMetadata = inject(PageTitleBreadcrumbService);

  readonly project = signal<Project | undefined>(undefined);
  readonly loading = signal(true);
  readonly isEditing = signal(false);
  readonly saving = signal(false);

  readonly editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProject(id);
      }
    });
  }

  loadProject(id: string): void {
    this.loading.set(true);
    const requestUrl = this.router.url;
    this.api.getProject(id).subscribe((proj) => {
      this.project.set(proj);
      if (proj) {
        this.pageMetadata.setCurrentPageMetadata(
          {
            title: proj.name,
            subtitle: proj.description,
            breadcrumb: proj.name,
          },
          requestUrl,
        );
        this.editForm.patchValue({
          name: proj.name,
          description: proj.description,
        });
        this.editForm.markAsPristine();
      }
      this.loading.set(false);
    });
  }

  statusColor(status?: Project['status']): string {
    if (!status) return 'default';
    const map: Record<Project['status'], string> = {
      active: 'success',
      planning: 'processing',
      archived: 'default',
    };
    return map[status] ?? 'default';
  }

  startEditing(): void {
    const current = this.project();
    if (current) {
      this.editForm.patchValue({
        name: current.name,
        description: current.description,
      });
      this.editForm.markAsPristine();
      this.isEditing.set(true);
    }
  }

  cancelEditing(): void {
    const current = this.project();
    if (current) {
      this.editForm.reset({ name: current.name, description: current.description });
      this.editForm.markAsPristine();
    }
    this.isEditing.set(false);
  }

  saveProject(): void {
    const current = this.project();
    if (!current || this.editForm.invalid) return;

    this.saving.set(true);
    const updatedData = {
      name: this.editForm.value.name!,
      description: this.editForm.value.description!,
    };

    this.api.updateProject(current.id, updatedData).subscribe((updated) => {
      this.project.set(updated);
      this.editForm.markAsPristine();
      this.saving.set(false);
      this.isEditing.set(false);
    });
  }

  hasUnsavedChanges(): boolean {
    return this.isEditing() && this.editForm.dirty && !this.saving();
  }
}
