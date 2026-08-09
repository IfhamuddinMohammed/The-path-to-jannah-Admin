import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// A relative serverUrl ('') works when this app is served from the same origin as the
// API (Base44-hosted production, or local dev via the base44 vite plugin's /api proxy).
// Packaged into Capacitor, the app instead loads from https://localhost with no such
// proxy — a relative request just hits the WebView's local asset server, which silently
// falls back to serving index.html instead of failing, so every API call "succeeds" with
// the wrong content. Native builds need the real absolute backend URL.
const isNativeApp = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: isNativeApp ? appBaseUrl : '',
  requiresAuth: false,
  appBaseUrl
});
