<script setup>
import { inject } from 'vue';

const { closeDrawer } = inject('cart');
</script>

<template>
  <div class="flex items-center gap-5 mb-8">
    <img
      @click="closeDrawer"
      src="/arrow-black.svg"
      alt="Вернуться назад"
      class="w-5 h-5 opacity-30 cursor-pointer rotate-180 hover:opacity-100 transition hover:translate-x-1"
    />
    <h2 class="text-2xl font-bold">Корзина</h2>
  </div>
</template>
