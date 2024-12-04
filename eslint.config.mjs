import spellcheck from "@cspell/eslint-plugin/configs";
import typescriptEslintParser from "@typescript-eslint/parser";
import tsEslint from "typescript-eslint";

export default [
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: true,
        sourceType: "module",
      },
    },
  },
  spellcheck.recommended,
  ...tsEslint.configs.recommended,
  {
    rules: {
      "no-console": ["error"],
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@cspell/spellchecker": [
        "warn",
        {
          checkComments: false,
          autoFix: false,
          cspell: {
            words: ["gyazo"],
          },
        },
      ],
    },
  },
  {
    ignores: ["node_modules/", "dist/"],
  },
];
