<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'my-button',
}
</script>

<style scoped>
.btn {
  margin-top: 15px;
  padding: 15px;
  background-color: white;
  color: black;
  border: solid 2px #e0e0e0;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn:hover {
  border-color: #e09d5e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.3);
}

.btn:disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>
