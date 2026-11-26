import { ResponsiveImage } from '@responsive-image/ember';
import hero from '../../images/feature-hero.jpg?responsive';
import offscreen from '../../images/feature-offscreen.jpg?responsive';

<template>
  <h1 class="text-2xl font-semibold">Image pipeline (Third-party)</h1>
  <p>@responsive-image/ember + @responsive-image/vite-plugin: build-time resize, srcset, AVIF/WebP.</p>
  <ResponsiveImage @src={{hero}} @size={{50}} alt="Hero (above the fold)" data-testid="hero-image" />
  <div style="height: 2400px" aria-hidden="true"></div>
  <ResponsiveImage @src={{offscreen}} @size={{50}} alt="Offscreen image" data-testid="offscreen-image" />
</template>
