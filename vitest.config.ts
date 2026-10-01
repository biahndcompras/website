import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      // The working copy sits on a removable volume, so macOS scatters `._*`
      // AppleDouble sidecars next to real files. They are binary stubs that
      // match the test glob and crash esbuild on the NUL byte. They are
      // gitignored, so excluding them here is the only durable fix -- deleting
      // them one by one just makes them reappear.
      '**/._*',
    ],
  },
});
