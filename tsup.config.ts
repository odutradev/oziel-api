import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/server.ts"],
  target: "node18",
  format: ["esm"],
  splitting: false,
  sourcemap: !!options.watch,
  keepNames: true,
  minify: !options.watch,
  clean: true,
  onSuccess: options.watch ? "node dist/server.js" : undefined
}));