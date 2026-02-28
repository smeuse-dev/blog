export async function register() {
  // Only run on Node.js server (not Edge, not client)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startCrosspostWorker } = await import('./lib/crosspost');
    startCrosspostWorker();
  }
}
