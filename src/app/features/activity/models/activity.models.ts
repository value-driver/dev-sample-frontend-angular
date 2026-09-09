export interface ActivityEvent {
  id: string;
  type: 'commit' | 'pr' | 'deploy' | 'issue' | 'review';
  actor: string;
  projectName: string;
  description: string;
  timestamp: string;
  url?: string;
}
