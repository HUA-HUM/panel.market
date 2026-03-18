export type ProductsFilters = {
  brand?: string;
  categoryId?: string;

  minPrice?: number;
  maxPrice?: number;

  minVisits?: number;
  maxVisits?: number;

  minOrders?: number;
  maxOrders?: number;

  excludeMarketplace?: string[];
  inMarketplace?: number;

  marketplaceStatus?: 'published' | 'not_published';

  status?: 'active' | 'paused' | 'closed' | 'under_review'; 
  matchedMarketplace?: 'megatone' | 'fravega';
};