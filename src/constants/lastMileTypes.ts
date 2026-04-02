// Last Mile Types Constants and Type Definitions
export const LM_TYPES = {
  SIFY_FIBER: 'Sify Fiber',
  SIFY_WIRELESS: 'Sify Wireless', 
  LEASED_LINE_FIBER: 'Leased Line Fiber',
  LEASED_LINE_WIRELESS: 'Leased Line Wireless',
  BROADBAND: 'Broadband',
  THREE_G_FOUR_G: '3G/4G',
  VSAT: 'VSAT'
} as const;

export type LMType = typeof LM_TYPES[keyof typeof LM_TYPES];