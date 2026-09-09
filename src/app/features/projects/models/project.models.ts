export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'planning';
  ownerId: string;
  ownerName: string;
  memberCount: number;
  createdAt: string;
}
