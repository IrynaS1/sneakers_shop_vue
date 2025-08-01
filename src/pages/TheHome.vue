<script setup>
import { onMounted, inject, reactive, watch, ref } from 'vue';
import axios from 'axios';
import debounce from 'lodash.debounce';
import CardList from '../components/CardList.vue';

const { cart, addToCart, removeFromCart } = inject('cart');

const items = ref([]);

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item);
  } else {
    removeFromCart(item);
  }
};

const filters = reactive({
  sortBy: 'title',
  searchQuery: '',
});

const fetchFavourites = async () => {
  try {
    const { data: favourites } = await axios.get('https://8b64314a941ea90e.mokky.dev/favourites');
    items.value = items.value.map((item) => {
      const favourite = favourites.find((favour) => favour.item_id === item.id);
      if (!favourite) {
        return item;
      }

      return {
        ...item,
        isFavourite: true,
        favouriteId: favourite.id,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    };

    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`;
    }

    const { data } = await axios.get('https://8b64314a941ea90e.mokky.dev/items', {
      params,
    });
    items.value = data.map((obj) => ({
      ...obj,
      isFavourite: false,
      favouriteId: null,
      isAdded: false,
    }));
  } catch (err) {
    console.log(err);
  }
};

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value;
}, 1000);

const addToFavourite = async (item) => {
  try {
    if (!item.isFavourite) {
      const obj = {
        item_id: item.id,
        item,
      };
      item.isFavourite = true;
      const { data } = await axios.post('https://8b64314a941ea90e.mokky.dev/favourites/', obj);

      item.favouriteId = data.id;
    } else {
      item.isFavourite = false;
      await axios.delete(`https://8b64314a941ea90e.mokky.dev/favourites/${item.favouriteId}`);
      item.favouriteId = null;
    }
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  const localCart = localStorage.getItem('cart');
  cart.value = localCart ? JSON.parse(localCart) || [] : [];
  await fetchItems();
  await fetchFavourites();

  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }));
});

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: false,
  }));
});

watch(filters, fetchItems);
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
    <div class="flex gap-4">
      <select
        @click="onChangeSelect"
        class="py-2 px-3 border border-gray-300 rounded-md outline-none focus:border-gray-400"
      >
        <option value="name">По названию</option>
        <option value="price">По цене (дешевле)</option>
        <option value="-price">По цене (дороже)</option>
      </select>

      <div class="relative">
        <img class="absolute left-3 top-4" src="/search.svg" alt="Найти" />
        <input
          @input="onChangeSearchInput"
          type="text"
          class="border rounded-md border-gray-300 py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          placeholder="Поиск..."
        />
      </div>
    </div>
  </div>
  <div class="mt-10">
    <CardList :items="items" @add-to-favourite="addToFavourite" @add-to-cart="onClickAddPlus" />
  </div>
</template>
