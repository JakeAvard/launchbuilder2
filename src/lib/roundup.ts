export interface RoundUpSettings {
  enabled: boolean;
  round_to: number;
  multiplier?: number;
}

export function calculateRoundUp(
  amount: number,
  settings: RoundUpSettings
): { finalAmount: number; roundUpAmount: number; originalAmount: number } {
  const originalAmount = amount;

  if (!settings.enabled) {
    return {
      finalAmount: amount,
      roundUpAmount: 0,
      originalAmount,
    };
  }

  const roundTo = settings.round_to || 1.0;
  const multiplier = settings.multiplier || 1.0;

  const remainder = amount % roundTo;
  const roundUpAmount = remainder === 0 ? 0 : (roundTo - remainder) * multiplier;
  const finalAmount = amount + roundUpAmount;

  return {
    finalAmount: Math.round(finalAmount * 100) / 100,
    roundUpAmount: Math.round(roundUpAmount * 100) / 100,
    originalAmount: Math.round(originalAmount * 100) / 100,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}
