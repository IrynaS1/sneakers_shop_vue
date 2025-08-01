<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import CardList from '../components/CardList.vue';

const favourites = ref([]);

onMounted(async () => {
  try {
    const { data } = await axios.get(
      'https://8b64314a941ea90e.mokky.dev/favourites?_relations=items',
    );
    favourites.value = data.map((el) => el.item);
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
<h2 class="text-3xl font-bold mb-8">Мои закладки</h2>
  <CardList :items="favourites" is-favourites is-add/>
</template>
