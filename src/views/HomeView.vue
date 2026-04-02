<template>
  <div class="home">
    <header class="header">
      <h1 class="header__title">Главная</h1>
      <my-button @click="goToBlog">
        <img src="@/icons/profile.svg" alt="перейти в профиль" />
      </my-button>
      <my-dialog v-model:show="dialogVisibleBlog">
        <blog-form @createBlog="createBlog" />
      </my-dialog>
    </header>

    <post-list v-if="!loading" :posts="paginatedPosts" :profileActive="true" />
    <div v-else>Идет загрузка...</div>

    <div v-if="totalPages > 1" class="pagination">
      <my-button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
        ◀ Назад
      </my-button>

      <div class="pagination-pages">
        <my-button
          v-for="page in displayedPages"
          :key="page"
          class="pagination-page"
          :class="{ active: currentPage === page }"
          :disabled="page === '...'"
          @click="page !== '...' && (currentPage = page)"
        >
          {{ page }}
        </my-button>
      </div>

      <my-button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Вперед ▶
      </my-button>
    </div>
  </div>
</template>

<script>
import BlogForm from '@/components/BlogForm.vue'
import PostList from '@/components/PostList.vue'
import axios from 'axios'
export default {
  components: {
    PostList,
    BlogForm,
  },
  data() {
    return {
      posts: [], // все посты
      postsPerPage: 5, // постов на странице
      currentPage: 1, // текущая страница
      dialogVisibleBlog: false,
      loading: false,
    }
  },
  computed: {
    // Общее количество страниц
    totalPages() {
      return Math.ceil(this.posts.length / this.postsPerPage)
    },

    // Посты для текущей страницы
    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage
      const end = start + this.postsPerPage
      return this.posts.slice(start, end)
    },

    // Отображаемые страницы (с ...)
    displayedPages() {
      const total = this.totalPages
      const current = this.currentPage
      const delta = 2
      const range = []

      for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i)
      }

      const pages = [1]

      if (range[0] > 2) {
        pages.push('...')
      }

      pages.push(...range)

      if (range[range.length - 1] < total - 1) {
        pages.push('...')
      }

      if (total > 1) {
        pages.push(total)
      }

      return pages
    },
  },
  watch: {
    // При смене страницы скроллим наверх
    currentPage() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
  methods: {
    async fetchPosts() {
      this.loading = true
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          alert('Сначала войдите в систему')
          this.$router.push('/login')
          return
        }

        // 1. Получаем всех пользователей
        const usersResponse = await axios.get('/api/userInfo/findAll')

        const users = usersResponse.data

        // 2. Собираем все посты от всех пользователей
        const allPosts = []
        users.forEach((user) => {
          if (user.post && user.post.length > 0) {
            user.post.forEach((post) => {
              // Добавляем автора к каждому посту
              allPosts.push({
                id: post.id,
                title: post.title,
                briefDescription: post.briefDescription,
                date: new Date(post.dateTime).toLocaleDateString(),
                comment: post.comments?.length || 0,
                author: user.fullName || user.blogName,
                userId: user.id,
                fullDescription: post.fullDescription,
                dateTime: post.dateTime,
                comments: post.comments,
              })
            })
          }
        })

        // 3. Сортируем от новых к старым
        this.posts = allPosts.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      } catch (e) {
        console.error('Ошибка:', e)
        alert('Ошибка при загрузке постов')
      } finally {
        this.loading = false
      }
    },
    async goToBlog() {
      // Проверка, есть ли блог у пользователя
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const user = JSON.parse(userInfo)
        this.$router.push(`/blog/${user.id}`)
      } else {
        this.dialogVisibleBlog = true
      }
    },
    async createBlog(userData) {
      try {
        // Отправляем пользователя на сервер
        const response = await axios.post('/api/userInfo', {
          blogName: userData.blogName,
          fullName: userData.fullName,
        })

        console.log('Блог создан:', response.data)
        localStorage.setItem('userInfo', JSON.stringify(response.data))
        this.dialogVisibleBlog = false
        this.$router.push(`/blog/${response.data.id}`)
      } catch (error) {
        console.error('Ошибка при создании блога:', error)
        alert(
          'Ошибка при создании блога: ' + (error.response?.data?.message || 'Неизвестная ошибка'),
        )
      }
    },
  },
  mounted() {
    this.fetchPosts()
  },
}
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__title {
  font-family: 'Fyodor', sans-serif;
  font-weight: 700;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 20px 0;
}

.pagination-pages {
  display: flex;
  gap: 8px;
}

.pagination-page.active {
  background: #e09d5e;
  border-color: #e09d5e;
  color: white;
  cursor: default;
}
</style>
