module.exports = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
  preset: 'angular',
  presetConfig: {
    types: [
      {type: 'feat', section: 'Features'},
      {type: 'fix', section: 'Bug Fixes'},
      {type: 'docs', section: 'Documentation'},
      {type: 'style', section: 'Styles'},
      {type: 'refactor', section: 'Code Refactoring'},
      {type: 'perf', section: 'Performance Improvements'},
      {type: 'test', section: 'Tests'},
      {type: 'build', section: 'Build System'},
      {type: 'ci', section: 'Continuous Integration'},
    ],
  },
};
