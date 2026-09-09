export interface DashboardSummary {
  activeUsers: number;
  activeUsersChange: number; // % change from last period
  openProjects: number;
  openProjectsChange: number;
  deploymentsToday: number;
  deploymentsTodayChange: number;
  testCoverage: string;
  testCoverageChange: number;
  securityStatus: 'healthy' | 'attention' | 'critical';
}

export interface RecentActivity {
  id: string;
  type: 'deploy' | 'pr' | 'alert' | 'user';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface ProjectHealth {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'failing';
  coverage: number;
  lastDeploy: string;
}
