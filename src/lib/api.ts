export interface ModelResult {
  data: Record<string, unknown>[];
  schema: { fields: { name: string }[] };
}

/**
 * Run the capital model. The implementation simply returns a small
 * mock data set but will attempt to fetch real results from `/api/model`
 * if that endpoint is available.
 */
export async function runModel(): Promise<ModelResult> {
  try {
    const resp = await fetch('/api/model');
    if (resp.ok) {
      return (await resp.json()) as ModelResult;
    }
  } catch {
    // ignore network errors and fall back to mock data
  }

  const data = [
    { period: '24Q4', cet1_ratio: 0.110, total_ratio: 0.140 },
    { period: '25Q1', cet1_ratio: 0.112, total_ratio: 0.142 },
    { period: '25Q2', cet1_ratio: 0.115, total_ratio: 0.145 }
  ];
  const schema = { fields: Object.keys(data[0]).map(name => ({ name })) };
  return { data, schema };
}
