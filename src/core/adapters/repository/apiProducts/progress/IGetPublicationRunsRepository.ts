import { PublicationRun } from '@/src/core/adapters/repository/apiProducts/progress/IGetPublicationRunRepository';

export interface IGetPublicationRunsRepository {
  execute(): Promise<PublicationRun[]>;
}
