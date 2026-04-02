<template>
  <div class="login">
    <h1>Авторизация</h1>
    <form @submit.prevent="handleLogin" class="form">
      <my-input v-model="username" placeholder="Логин" />
      <my-input v-model="password" type="password" placeholder="Пароль" />
      <my-button type="submit">Войти</my-button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMessage: '',
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errorMessage = ''

      try {
        // Реальный запрос к API через прокси
        const response = await axios.post(
          `/auth/login?username=${this.username}&password=${this.password}`,
        )

        // Сохраняем токен из ответа
        const userData = response.data
        console.log('Токен получен:', userData)
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('Сохранённый пользователь:', localStorage.getItem('user'))
        // Переходим на главную
        this.$router.push('/')
      } catch (error) {
        console.error('Ошибка входа:', error)
        this.errorMessage = 'Неверный логин или пароль'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped></style>
