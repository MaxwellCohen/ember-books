export default function config(environment) {
  const ENV = {
    modulePrefix: 'ember-books',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {},
    },
    APP: {},
  };

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
}

// ember-cli loads this file with require(). Node returns the module namespace
// for a plain ESM file, which is not callable. This export name makes require()
// return the function itself (Node 22.10+).
export { config as 'module.exports' };
