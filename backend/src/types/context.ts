import { DataLoaders } from '../utils/dataloaders';

export interface Context {
  userId?: string;
  dataLoaders: DataLoaders;
}
