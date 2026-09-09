import { Injectable } from '@angular/core';
import { of, delay, Observable } from 'rxjs';
import { Project } from '@features/projects/models/project.models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsApiService {
  private mockProjects: Project[] = [
    {
      id: '1',
      name: 'Alpha Redesign',
      description: 'Redesigning the alpha product',
      status: 'active',
      ownerId: 'u1',
      ownerName: 'Alice',
      memberCount: 5,
      createdAt: '2026-08-01T10:00:00Z',
    },
    {
      id: '2',
      name: 'Beta Launch',
      description: 'Preparing beta launch materials',
      status: 'planning',
      ownerId: 'u2',
      ownerName: 'Bob',
      memberCount: 3,
      createdAt: '2026-08-05T12:00:00Z',
    },
    {
      id: '3',
      name: 'Gamma Legacy',
      description: 'Maintenance of legacy system',
      status: 'archived',
      ownerId: 'u1',
      ownerName: 'Alice',
      memberCount: 1,
      createdAt: '2025-01-10T09:00:00Z',
    },
    {
      id: '4',
      name: 'Delta API',
      description: 'New API for Delta services',
      status: 'active',
      ownerId: 'u3',
      ownerName: 'Charlie',
      memberCount: 4,
      createdAt: '2026-07-20T14:30:00Z',
    },
    {
      id: '5',
      name: 'Epsilon Mobile',
      description: 'Mobile app for Epsilon',
      status: 'planning',
      ownerId: 'u4',
      ownerName: 'Dave',
      memberCount: 6,
      createdAt: '2026-08-10T11:15:00Z',
    },
    {
      id: '6',
      name: 'Zeta Web',
      description: 'Web client modernization',
      status: 'active',
      ownerId: 'u2',
      ownerName: 'Bob',
      memberCount: 2,
      createdAt: '2026-06-15T08:45:00Z',
    },
    {
      id: '7',
      name: 'Eta Security',
      description: 'Security audit and fixes',
      status: 'active',
      ownerId: 'u5',
      ownerName: 'Eve',
      memberCount: 3,
      createdAt: '2026-08-02T16:20:00Z',
    },
    {
      id: '8',
      name: 'Theta Cloud',
      description: 'Cloud migration strategy',
      status: 'planning',
      ownerId: 'u3',
      ownerName: 'Charlie',
      memberCount: 7,
      createdAt: '2026-08-12T09:30:00Z',
    },
    {
      id: '9',
      name: 'Iota Analytics',
      description: 'Data warehouse setup',
      status: 'archived',
      ownerId: 'u1',
      ownerName: 'Alice',
      memberCount: 2,
      createdAt: '2025-11-05T13:00:00Z',
    },
    {
      id: '10',
      name: 'Kappa ML',
      description: 'Machine learning prototype',
      status: 'active',
      ownerId: 'u6',
      ownerName: 'Frank',
      memberCount: 4,
      createdAt: '2026-08-15T10:10:00Z',
    },
  ];

  getProjects(): Observable<Project[]> {
    return of(this.mockProjects).pipe(delay(400));
  }

  getProject(id: string): Observable<Project | undefined> {
    const project = this.mockProjects.find((p) => p.id === id);
    return of(project).pipe(delay(400));
  }

  createProject(data: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || 'New Project',
      description: data.description || '',
      status: data.status || 'planning',
      ownerId: data.ownerId || 'unknown',
      ownerName: data.ownerName || 'Unknown',
      memberCount: data.memberCount || 1,
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.mockProjects.push(newProject);
    return of(newProject).pipe(delay(400));
  }

  updateProject(id: string, data: Partial<Project>): Observable<Project> {
    const index = this.mockProjects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    this.mockProjects[index] = { ...this.mockProjects[index], ...data };
    return of(this.mockProjects[index]).pipe(delay(400));
  }

  archiveProject(id: string): Observable<string> {
    const index = this.mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProjects[index].status = 'archived';
    }
    return of(id).pipe(delay(400));
  }
}
