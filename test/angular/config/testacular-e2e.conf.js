basePath = '../../../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/angular-old/e2e/*.js'
];

autoWatch = false;

browsers = ['Chrome'];

singleRun = true;

captureTimeout = 5000;
reportSlowerThan = 500;

proxies = {
  '/': 'http://localhost:9090/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
