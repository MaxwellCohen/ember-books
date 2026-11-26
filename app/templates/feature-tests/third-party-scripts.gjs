import loadThirdParty from '../../components/feature-tests/load-third-party';

<template>
  <h1 class="text-2xl font-semibold">Third-party scripts (Manual)</h1>
  <p data-testid="third-party" {{loadThirdParty "/feature-tests/fake-third-party.js"}}>
    /feature-tests/fake-third-party.js is injected after the load event and an idle callback.
  </p>
</template>
