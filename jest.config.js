module.exports = {
    'roots': [
        '<rootDir>/src'
    ],
    'transform': {
        '^.+\\.tsx?$': 'ts-jest'
    },
    'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))_test\\.tsx?$',
    'moduleFileExtensions': [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ],
    'testPathIgnorePatterns': [
        'utils.ts'
    ]
}
