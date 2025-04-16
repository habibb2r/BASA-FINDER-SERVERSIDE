import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jsPlugin from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules", "dist"],
    rules: {
      "no-unused-vars": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "no-undef": "error",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  jsPlugin.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
];