import netlifyConfig from "@netlify/eslint-config-node";
import spellcheck from "@cspell/eslint-plugin";

/** @type {import('eslint').Linter.Config} */
export default [
  netlifyConfig,
  spellcheck,
  {
    rules: {
      "no-console": ["error"],
    },
  },
];
