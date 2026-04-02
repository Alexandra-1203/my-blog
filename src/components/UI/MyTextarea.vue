<template>
  <textarea :value="modelValue" @input="updateInput" class="textarea" type="text"></textarea>
</template>

<script>
export default {
  name: 'my-textarea',
  props: {
    modelValue: [String, Number],
  },
  methods: {
    updateInput(event) {
      this.$emit('update:modelValue', event.target.value)
    },
  },
}
</script>

<style scoped>
.textarea {
  width: 100%;
  padding: 15px;
  border: solid 2px #e0e0e0;
  margin-top: 15px;
  border-radius: 15px;
  background-color: white;
  resize: vertical;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.textarea:hover {
  border-color: #e09d5e;
}

.textarea:focus {
  outline: none;
  border-color: #e09d5e;
  box-shadow: 0 0 0 3px rgba(224, 157, 94, 0.2);
}

.textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

</style>
