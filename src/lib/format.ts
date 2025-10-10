export type SignDisplay = NonNullable<Intl.NumberFormatOptions['signDisplay']>;

interface FormatMillionsOptions {
  signDisplay?: SignDisplay;
  useGrouping?: boolean;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter({ signDisplay, useGrouping }: Required<FormatMillionsOptions>): Intl.NumberFormat {
  const key = `${signDisplay}|${useGrouping}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay,
        useGrouping
      })
    );
  }
  return formatterCache.get(key)!;
}

const DEFAULT_OPTIONS: Required<FormatMillionsOptions> = {
  signDisplay: 'auto',
  useGrouping: true
};

export function formatMillions(value: number | null | undefined, options: FormatMillionsOptions = {}): string {
  if (value === null || value === undefined) {
    return '';
  }
  const merged: Required<FormatMillionsOptions> = {
    ...DEFAULT_OPTIONS,
    ...options
  };
  return `${getFormatter(merged).format(value)}M`;
}

export function formatDeltaMillions(
  value: number | null | undefined,
  options: Omit<FormatMillionsOptions, 'signDisplay'> = {}
): string {
  return formatMillions(value, { signDisplay: 'exceptZero', ...options });
}
