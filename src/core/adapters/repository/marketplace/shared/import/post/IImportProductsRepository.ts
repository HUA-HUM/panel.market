import {
  ImportProductsResponse,
} from '@/src/core/driver/repository/marketplace/shared/imports/post/ImportProductsRepository';

export interface IImportProductsRepository {
  execute(params: {
    marketplace: 'google-merchant' | 'megatone' | 'oncity' | 'fravega';
  }): Promise<ImportProductsResponse>;
}
