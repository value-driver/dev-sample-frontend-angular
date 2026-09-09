import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideCalendar,
  LucideExternalLink,
  LucideTrash2,
  LucideUser,
  LucideUsers,
} from '@lucide/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { Project } from '@features/projects/models/project.models';

@Component({
  selector: 'app-project-card',
  imports: [
    DatePipe,
    RouterLink,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    LucideUser,
    LucideUsers,
    LucideCalendar,
    LucideExternalLink,
    LucideTrash2,
  ],
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  readonly onArchive = output<string>();

  statusColor(status: Project['status']): string {
    const map: Record<Project['status'], string> = {
      active: 'success',
      planning: 'processing',
      archived: 'default',
    };
    return map[status] ?? 'default';
  }

  archive(): void {
    this.onArchive.emit(this.project().id);
  }
}
