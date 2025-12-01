import js from "@eslint/js";
import ts from "typescript-eslint";

export default ts.config(
  {
    ignores: ["node_modules", "dist"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["apps/frontend/**/*.{ts,tsx}"],
    extends: ["plugin:react/recommended"],
    parserOptions: {
      project: "apps/frontend/tsconfig.json",
    },
  },
  {
    files: ["apps/backend/**/*.ts"],
    parserOptions: {
      project: "apps/backend/tsconfig.json",
    },
  }
);
