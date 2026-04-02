<template>
  <form @submit.prevent>
    <h4>Создание блога</h4>
    <div class="form-group" :class="{ 'has-error': errors.blogName && attempted }">
      <my-input
        v-model="userInfo.blogName"
        type="text"
        placeholder="Название блога (обязательно, до 50 символов)"
        :maxlength="50"
        @input="validateBlogName"
      />
      <span v-if="errors.blogName && attempted" class="error-message">{{ errors.blogName }}</span>
      <span v-else class="hint-message">{{ 50 - userInfo.blogName.length }} символов осталось</span>
    </div>

    <div class="form-group" :class="{ 'has-error': errors.fullName && attempted }">
      <my-input
        v-model="userInfo.fullName"
        type="text"
        placeholder="Полное имя (обязательно, до 50 символов)"
        :maxlength="50"
        @input="validateFullName"
      />
      <span v-if="errors.fullName && attempted" class="error-message">{{ errors.fullName }}</span>
      <span v-else class="hint-message">{{ 50 - userInfo.fullName.length }} символов осталось</span>
    </div>

    <my-button @click="createBlog">Создать</my-button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        blogName: '',
        fullName: '',
      },
      errors: {
        blogName: '',
        fullName: '',
      },
      attempted: false,
    }
  },
  computed: {
    isValid() {
      return (
        !this.errors.blogName &&
        !this.errors.fullName &&
        this.userInfo.blogName.trim() &&
        this.userInfo.fullName.trim()
      )
    },
  },
  methods: {
    validateBlogName() {
      const value = this.userInfo.blogName.trim()
      if (!value) {
        this.errors.blogName = 'Название блога обязательно'
      } else if (value.length > 50) {
        this.errors.blogName = 'Название блога не должно превышать 50 символов'
      } else {
        this.errors.blogName = ''
      }
    },

    validateFullName() {
      const value = this.userInfo.fullName.trim()
      if (!value) {
        this.errors.fullName = 'Полное имя обязательно'
      } else if (value.length > 50) {
        this.errors.fullName = 'Полное имя не должно превышать 50 символов'
      } else {
        this.errors.fullName = ''
      }
    },

    validateAll() {
      this.validateBlogName()
      this.validateFullName()
    },

    createBlog() {
      this.attempted = true
      this.validateAll()

      if (this.isValid) {
        this.$emit('createBlog', {
          blogName: this.userInfo.blogName.trim(),
          fullName: this.userInfo.fullName.trim(),
        })
        this.resetForm()
      }
    },
    resetForm() {
      this.userInfo = {
        blogName: '',
        fullName: '',
      }
      this.errors = {
        blogName: '',
        fullName: '',
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

.form-group.has-error :deep(input) {
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
