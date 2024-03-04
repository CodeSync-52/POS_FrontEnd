<template>
  <div @click.stop ref="outsideClickContainer">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const outsideClickContainer = ref<HTMLDivElement | null>(null);
const emit = defineEmits<{
  (e: 'outside-click', event: Event): void;
}>();
function handleOutsideClick(event: Event) {
  if (!outsideClickContainer.value) return;
  if (
    event.target !== outsideClickContainer.value &&
    !outsideClickContainer.value.contains(event.target as Node)
  ) {
    emit('outside-click', event);
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => document.removeEventListener('click', handleOutsideClick));
</script>
