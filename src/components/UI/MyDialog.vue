<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
      <div @click.stop class="dialog__content"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name:  'my-dialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped>
.dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.dialog__content {
  background: linear-gradient(135deg, #fff5e8, #ffe0c8);
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
