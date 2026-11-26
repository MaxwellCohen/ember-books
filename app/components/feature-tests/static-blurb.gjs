// Static (server-only) component for the islands test. Its marker string must
// not appear in any JavaScript the islands page downloads.
<template>
  <section data-testid="static-blurb" class="rounded-md border p-4">
    <h2 class="font-semibold">Static component</h2>
    <p>STATIC_BLURB_MARKER_e8b14c: rendered on the server, never hydrated.</p>
  </section>
</template>
