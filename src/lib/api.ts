import type { BankData, Scenario } from './types';
import { run_sequence } from './engine';

export function runModel({ bank }: { bank: BankData }): { scenario: Scenario } {
  const scenario = run_sequence(bank);
  return { scenario };
}
