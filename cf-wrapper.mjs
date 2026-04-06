let appPromise;
async function loadApp() {
  if (!appPromise) {
    appPromise = import('./app.mjs');
  }
  return appPromise;
}

export default {
  async fetch(request, env, ctx) {
    try {
      const mod = await loadApp();
      return await mod.default.fetch(request, env, ctx);
    } catch (error) {
      console.error('Wrapper error:', error?.stack || error);
      return new Response(error?.stack || String(error), {
        status: 500,
        headers: { 'content-type': 'text/plain; charset=UTF-8' },
      });
    }
  },
};