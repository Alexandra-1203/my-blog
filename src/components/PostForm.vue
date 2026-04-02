<template>
  <form @submit.prevent>
    <h3>{{ isEdit ? 'Редактировать пост' : 'Создать пост' }}</h3>
    <div class="form-group" :class="{ 'has-error': errors.title }">
      <my-input
        v-model="form.title"
        type="text"
        placeholder="Название (обязательно, до 50 символов)"
        :maxlength="50"
        @input="validateTitle"
      />
      <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      <span v-else class="hint-message">{{ 50 - form.title.length }} символов осталось</span>
    </div>
    <div class="form-group" :class="{ 'has-error': errors.briefDescription }">
      <my-input
        v-model="form.briefDescription"
        type="text"
        placeholder="Краткое описание (обязательно, до 100 символов)"
        :maxlength="100"
        @input="validateBriefDescription"
      />
      <span v-if="errors.briefDescription" class="error-message">{{
        errors.briefDescription
      }}</span>
      <span v-else class="hint-message"
        >{{ 100 - form.briefDescription.length }} символов осталось</span
      >
    </div>
    <div class="form-group" :class="{ 'has-error': errors.fullDescription }">
      <my-textarea
        v-model="form.fullDescription"
        placeholder="Полное описание (до 255 символов)"
        :rows="4"
        :maxlength="255"
        @input="validateFullDescription"
      />
      <span v-if="errors.fullDescription" class="error-message">{{ errors.fullDescription }}</span>
      <span v-else class="hint-message"
        >{{ 255 - form.fullDescription.length }} символов осталось</span
      >
    </div>
    <my-button @click="submit">{{ isEdit ? 'Сохранить' : 'Создать' }}</my-button>
  </form>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        title: '',
        briefDescription: '',
        fullDescription: '',
      },
      errors: {
        title: '',
        briefDescription: '',
        fullDescription: '',
      },
      attempted: false, //попытка отправки
    }
  },
  computed: {
    isEdit() {
      return !!this.post
    },
    isValid() {
      return (
        !this.errors.title &&
        !this.errors.briefDescription &&
        !this.errors.fullDescription &&
        this.form.title.trim() &&
        this.form.briefDescription.trim()
      )
    },
  },
  watch: {
    // Следим за изменением props.post и заполняем форму
    post: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = {
            title: newVal.title || '',
            briefDescription: newVal.briefDescription || '',
            fullDescription: newVal.fullDescription || '',
          }
        } else {
          this.resetForm()
        }
      },
    },
  },
  methods: {
    validateTitle() {
      const value = this.form.title.trim()
      if (!value) {
        this.errors.title = 'Заголовок обязателен'
      } else if (value.length > 50) {
        this.errors.title = 'Заголовок не должен превышать 50 символов'
      } else {
        this.errors.title = ''
      }
    },

    validateBriefDescription() {
      const value = this.form.briefDescription.trim()
      if (!value) {
        this.errors.briefDescription = 'Краткое описание обязательно'
      } else if (value.length > 100) {
        this.errors.briefDescription = 'Краткое описание не должно превышать 100 символов'
      } else {
        this.errors.briefDescription = ''
      }
    },

    validateFullDescription() {
      if (this.form.fullDescription.length > 255) {
        this.errors.fullDescription = 'Полное описание не должно превышать 255 символов'
      } else {
        this.errors.fullDescription = ''
      }
    },

    validateAll() {
      this.validateTitle()
      this.validateBriefDescription()
      this.validateFullDescription()
    },
    submit() {
      this.attempted = true
      this.validateAll()

      if (this.isValid) {
        if (this.isEdit) {
          this.$emit('update', {
            id: this.post.id,
            ...this.form,
          })
        } else {
          this.$emit('create', this.form)
        }
        this.resetForm()
      }
    },

    resetForm() {
      this.form = {
        title: '',
        briefDescription: '',
        fullDescription: '',
      }
      this.errors = {
        title: '',
        briefDescription: '',
        fullDescription: '',
      }
      this.attempted = false
    },
  },
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group.has-error :deep(input),
.form-group.has-error :deep(textarea) {
  border-color: #ff4444;
}

.error-message {
  font-size: 12px;
  color: #ff4444;
}

.hint-message {
  font-size: 11px;
  color: #888;
}

.btn {
  align-self: flex-end;
}
</style>
