import StaticBlurb from '../../components/feature-tests/static-blurb';
import FavoriteButton from '../../components/feature-tests/favorite-button';

<template>
  <h1 class="text-2xl font-semibold">Islands (Manual)</h1>
  <StaticBlurb />
  <div data-island="favorite-button" data-args='{"title":"Dune"}'>
    <FavoriteButton @title="Dune" />
  </div>
</template>
