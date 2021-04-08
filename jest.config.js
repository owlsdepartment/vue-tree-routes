module.exports = {
    roots: ['<rootDir>/tests'],
    verbose: true,
    collectCoverage: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
};
