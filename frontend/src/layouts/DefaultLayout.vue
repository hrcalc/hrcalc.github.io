<template>
  <v-main>
    <v-btn :to="{name:'index'}">Cyprus</v-btn>
    <v-btn :to="{name:'spain'}">Spain</v-btn>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
</script>