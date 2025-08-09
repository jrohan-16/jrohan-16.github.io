import { spawn } from 'node:child_process';
const jobs = [
  { slug: 'jpm', name: 'JPMorgan Chase', rssd: 1039502 },
  { slug: 'pnc', name: 'PNC Financial Services', rssd: 1069778 }
];
const envBase = {
  FFIEC_START_Q: '2024-Q1',
  FFIEC_END_Q: '2025-Q1',
  FFIEC_TAX_RATE: '0.21'
};
function run(job) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, ...envBase,
      FFIEC_BANK_SLUG: job.slug,
      FFIEC_BANK_NAME: job.name,
      FFIEC_RSSD: String(job.rssd)
    };
    const p = spawn(process.execPath, ['scripts/ffiec-pull-y9c.js'], { stdio: 'inherit', env });
    p.on('exit', (code)=> code === 0 ? resolve(null) : reject(new Error(`exit ${code}`)));
  });
}
for (const j of jobs) {
  await run(j);
}
console.log('Done.');
