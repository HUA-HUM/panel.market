export type PricingSalesChannel = 'megatone' | 'fravega' | 'oncity';

export type PricingBulkItemInput = {
  sku: string;
  salePrice: number;
  salesChannel: PricingSalesChannel;
};

export type PricingBulkItemResult = {
  input: PricingBulkItemInput;
  prices: {
    salePrice: number;
    meliContributionPercentage: number;
    meliContributionAmount: number;
    sellerNetPrice: number;
  };
  datosBase: {
    sku: string;
    weightKg: number;
    volumetricWeightKg: number;
    sellerNetPrice: number;
    categoryId: string;
  };
  tiposDeCambio: {
    tcAmco: number;
    tcTlq: number;
  };
  costosOperativos: {
    commissionMpPercentage: number;
    envioMlAmount: number;
    precioAmzAmount: number;
    depositoUsaAmount: number;
    costosAmcoAmount: number;
    imptosAmcoAmount: number;
  };
  emo: {
    ivaCatAranc: number;
    sumaTasasYDer: number;
  };
  costosCalculados: {
    utilidadAmount: number;
    impuestosMeliAmount: number;
    comisionMpAmount: number;
  };
  resultados: {
    totalCosts: number;
    operatingProfit: number;
    operatingProfitPercent: string;
  };
  precio: {
    suggestedPrice: number;
    discount: string;
  };
  status: {
    profitable: boolean;
    shouldPause: boolean;
  };
};

export type PricingBulkResponse = {
  items: PricingBulkItemResult[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};
