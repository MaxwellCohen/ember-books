const environment = import.meta.env.MODE ?? 'development';

const ENV = {
  modulePrefix: 'ember-books',
  environment,
  rootURL: '/',
  locationType: environment === 'test' ? 'none' : 'history',
  EmberENV: {
    EXTEND_PROTOTYPES: false,
    FEATURES: {},
  },
  APP: {},
};

if (environment === 'test') {
  ENV.APP.LOG_ACTIVE_GENERATION = false;
  ENV.APP.LOG_VIEW_LOOKUPS = false;
  ENV.APP.rootElement = '#ember-testing';
  ENV.APP.autoboot = false;
}

export default ENV;
