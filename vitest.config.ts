import path from "node:path";
import {readFile} from "node:fs/promises";
import {transform} from "esbuild";
import {defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {alias: {"@": path.resolve(process.cwd(), "src")}},
  plugins: [{
    name: "wardogs-tsx-loader",
    enforce: "pre",
    async load(id) {
      if (!id.endsWith(".tsx")) return null;
      const result = await transform(await readFile(id, "utf8"), {loader: "tsx", jsx: "automatic", sourcemap: "inline", sourcefile: id});
      return {code: result.code, moduleType: "js"};
    }
  }],
  test: {environment: "node", include: ["tests/**/*.test.{ts,tsx}"]}
});
