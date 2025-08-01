<script setup>
import { ref, inject, computed } from 'vue';
import axios from 'axios';
import DrawerHead from './DrawerHead.vue';
import CartListItem from './CartListItem.vue';
import InfoBlock from './InfoBlock.vue';

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
});

const { cart } = inject('cart');

const isCreatingOrder = ref(false);
const orderId = ref(null);

const createOrder = async () => {
  try {
    isCreatingOrder.value = true;
    const { data } = await axios.post('https://8b64314a941ea90e.mokky.dev/orders', {
      items: cart.value,
      totalPrice: props.totalPrice.value,
      vatPrice: props.vatPrice.value,
    });
    cart.value = [];
    orderId.value = data.id;
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    isCreatingOrder.value = false;
  }
};
const cartIsEmpty = computed(() => cart.value.length === 0);
const buttonDisabled = computed(() => isCreatingOrder.value || cartIsEmpty.value);
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />
    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ №${orderId} скоро будет передан курьерской доставке`"
        image-url="/order-success-icon.png"
      />
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пустая"
        description="Добавьте хотя бы один товар, чтобы сделать заказ"
        image-url="/package-icon.png"
      />
    </div>

    <div v-else>
      <CartListItem />
      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed mb-1"></div>
          <b>{{ totalPrice }} руб.</b>
        </div>
        <div class="flex gap-2">
          <span>Налог:</span>
          <div class="flex-1 border-b border-dashed mb-1"></div>
          <b>{{ vatPrice }} руб.</b>
        </div>
        <button
          @click="createOrder"
          :disabled="buttonDisabled"
          class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-300 hover:bg-lime-600 active:bg-lime-700 cursor-pointer"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
