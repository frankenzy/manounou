import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Fichiers legacy à nettoyer dans Phase 3
      "src/controllers/**",
      "src/services/**",
      "src/models/**",
      "src/repositories/**",
      "src/Auth/**",
      "src/components/**",
      "src/hooks/**",
      "src/utils/**",
      // Pages avec erreurs legacy temporaires
      "src/app/about/**",
      "src/app/contact/**",
      "src/app/login/**",
      "src/app/manounou/**",
      "src/app/page.tsx",
      "src/app/todo/**",
    ],
  },
];

export default eslintConfig;
