'use server';

import { IImportProductsRepository } from '@/src/core/adapters/repository/marketplace/shared/import/post/IImportProductsRepository';
import { ImportProductsRepository } from '@/src/core/driver/repository/marketplace/shared/imports/post/ImportProductsRepository';

export type RunImportStatus = 'QUEUED' | 'STARTED' | 'SUCCESS' | 'FAILED';

type Params = {
  marketplace: 'megatone' | 'oncity' | 'fravega';
};

export async function runImportProductsAction(
  params: Params
): Promise<{ status: RunImportStatus }> {
  const repository: IImportProductsRepository =
    new ImportProductsRepository();

  return repository.execute({
    marketplace: params.marketplace,
  });
}
