<script setup>
import TheCard from './TheCard.vue';
defineProps({
  items: Array,
  isFavourites: Boolean,
  isAdd: Boolean,
});

const emit = defineEmits(['addToFavourite', 'addToCart']);
</script>

<template>
  <div class="grid grid-cols-4 gap-5" v-auto-animate>
    <TheCard
      v-for="item in items"
      :key="item.id"
      :id="item.id"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :price="item.price"
      :isFavourite="item.isFavourite"
      :onClickFavourite="isFavourites ? null : () => emit('addToFavourite', item)"
      :onClickAdd="isAdd ? null : () => emit('addToCart', item)"
      :isAdded="item.isAdded"
    />
  </div>
</template>
