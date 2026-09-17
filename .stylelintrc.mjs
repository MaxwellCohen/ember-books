export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'alpha-value-notation': null,
    'at-rule-no-deprecated': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'layer',
          'config',
          'plugin',
          'reference',
        ],
      },
    ],
    'at-rule-prelude-no-invalid': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'import-notation': null,
  },
};
