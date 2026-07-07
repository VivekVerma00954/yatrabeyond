/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    // Disallow `any` — forces explicit types
    "@typescript-eslint/no-explicit-any": "error",
    // Consistent type imports (tree-shakeable)
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    // Prevent accidental floating promises
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    // Next.js image/link component rules
    "@next/next/no-img-element": "error",
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "postcss.config.js",
    "tailwind.config.ts",
    "vitest.config.ts",
  ],
};
