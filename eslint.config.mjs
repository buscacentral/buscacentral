import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scripts utilitários one-off (seed/geração), não fazem parte do app:
    "add_12_articles.js",
    "insert_articles.js",
    "generate-cities.js",
  ]),
  {
    rules: {
      "react/no-unescaped-entities": "off"
    }
  }
]);

export default eslintConfig;
