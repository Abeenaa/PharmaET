/**
 * Application-wide configuration constants
 */

export const CONFIG = {
  // Pharmacy business rules
  EXPIRING_SOON_DAYS: parseInt(process.env.EXPIRING_SOON_DAYS || '30', 10),
  LOW_STOCK_THRESHOLD: parseInt(process.env.LOW_STOCK_THRESHOLD || '50', 10),

  // Pagination defaults
  DEFAULT_PAGE_LIMIT: 50,
  DEFAULT_PAGE_OFFSET: 0,

  // Date formats
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',

  // ID generation prefixes
  PO_NUMBER_PREFIX: 'PO',
  GRN_NUMBER_PREFIX: 'GRN',
  TXN_ID_PREFIX: 'TXN',
  SKU_PREFIX: 'MED',
};
