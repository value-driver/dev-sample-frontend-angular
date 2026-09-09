export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
}
