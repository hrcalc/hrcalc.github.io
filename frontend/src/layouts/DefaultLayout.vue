<template>
  <v-main>
    <v-btn :to="{name:'index'}" exact>Cyprus</v-btn>
    <v-btn :to="{name:'spain'}" exact>Spain</v-btn>
    <v-btn :to="{name:'mexico'}" exact>Mexico</v-btn>
    <v-btn :to="{name:'mexico_bonus'}" exact>Mexico + Bonus</v-btn>
    <router-view />
  </v-main>
</template>

<script setup lang="ts">
</script>