import { RESOURCE_TYPES } from '../rw/resource-watch/types';

export interface Favorite {
  id: string;
  application: string;
  createdAt: Date;
  resourceId: string;
  resourceType: RESOURCE_TYPES;
  type: 'favourite';
  userId: string;
}
