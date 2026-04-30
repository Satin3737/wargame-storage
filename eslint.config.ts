import type {Linter} from 'eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import {defineConfig, globalIgnores} from 'eslint/config';

const customEsLintSettings: Linter.RulesRecord = {
    '@typescript-eslint/no-unused-expressions': ['error', {allowShortCircuit: true, allowTernary: true}],
    '@typescript-eslint/no-unused-vars': [
        'warn',
        {argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', args: 'after-used', ignoreRestSiblings: true}
    ],
    '@typescript-eslint/no-explicit-any': ['error', {ignoreRestArgs: true}],
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/member-ordering': [
        'warn',
        {
            default: [
                'static-field',
                'public-instance-field',
                'protected-instance-field',
                'private-instance-field',
                'constructor',
                ['public-get', 'public-set'],
                'public-method',
                ['protected-get', 'protected-set'],
                'protected-method',
                ['private-get', 'private-set'],
                'private-method'
            ]
        }
    ]
};

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
    {
        rules: customEsLintSettings
    }
]);

export default eslintConfig;
