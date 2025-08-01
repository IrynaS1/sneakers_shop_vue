import './assets/main.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import App from './App.vue';
import TheHome from './pages/TheHome.vue';
import TheFavourites from './pages/TheFavourites.vue';

const app = createApp(App);
const routes = [
  { path: '/', name: 'Home', component: TheHome },
  { path: '/favourites', name: 'Favourites', component: TheFavourites },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.use(autoAnimatePlugin);
app.mount('#app');
