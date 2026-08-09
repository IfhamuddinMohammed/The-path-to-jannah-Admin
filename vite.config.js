import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    base44({
      // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
      // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: true
    }),
    react(),
  ],
  // Vite's default build target tracks fairly recent evergreen browsers — fine in a desktop
  // dev browser, but this app also runs inside whatever Android System WebView version is
  // installed on a real device, which varies a lot and can lag well behind Chrome on older or
  // unupdated phones. A syntax/feature the bundle relies on but that WebView doesn't support
  // would throw immediately on script load — with no error boundary catching render errors
  // before this change, that reads as a silent blank white screen. es2020 is a safer baseline
  // (still covers the optional-chaining/nullish-coalescing syntax already used throughout this
  // codebase) without transpiling so far down that bundle size balloons.
  build: {
    target: "es2020",
  },
});
