<template>
  <div class="blog">
    <header class="header">
      <my-button @click="toHome">
        <img src="@/icons/back.svg" alt="назад" />
      </my-button>
      <div class="name">
        <h1>{{ blogName }}</h1>
        <h2>{{ fullName }}</h2>
      </div>
      <my-button @click="showDialog">
        <img src="@/icons/add.svg" alt="добавить пост" />
      </my-button>
      <my-dialog v-model:show="dialogVisiblePost">
        <post-form :post="editingPost" @create="createPost" @update="updatePost" />
      </my-dialog>

      <my-dialog v-model:show="showDeleteDialog">
        <div class="delete-confirm">
          <h3>Удалить пост?</h3>
          <p>
            Вы уверены, что хотите удалить пост <strong>"{{ postToDelete?.title }}"</strong>? Это
            действие нельзя отменить.
          </p>
          <div class="delete-confirm-buttons">
            <my-button @click="showDeleteDialog = false">Отмена</my-button>
            <my-button type="danger" @click="confirmDeletePost">Удалить</my-button>
          </div>
        </div>
      </my-dialog>
    </header>
    <post-list
      :posts="posts"
      v-if="!loading"
      :showRemove="showRemoveButtons"
      @remove="removePost"
      @edit="editPost"
      :profileActive="false"
    />
    <div v-else>Идет загрузка...</div>
  </div>
</template>

<script>
import PostForm from '@/components/PostForm.vue'
import PostList from '@/components/PostList.vue'
import axios from 'axios'
export default {
  components: {
    PostForm,
    PostList,
  },
  props: {
    userId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      blogName: '',
      fullName: '',
      posts: [],
      currentUserId: null,
      dialogVisiblePost: false,
      editingPost: null, // null = создание, объект = редактирование
      loading: false,
      showDeleteDialog: false,
      postToDelete: null,
    }
  },
  computed: {
    isCurrentUser() {
      return this.currentUserId == this.userId
    },
    showRemoveButtons() {
      return this.isCurrentUser
    },
  },
  async mounted() {
    // Получаем ID текущего пользователя из localStorage
    const userStr = localStorage.getItem('userInfo')
    if (userStr) {
      this.currentUserId = JSON.parse(userStr).id
    }
    // Загружаем данные блога с сервера
    await this.loadBlogData()
  },
  methods: {
    toHome() {
      this.$router.push('/')
    },
    showDialog() {
      this.editingPost = null
      this.dialogVisiblePost = true
    },
    editPost(post) {
      this.editingPost = post
      this.dialogVisiblePost = true
    },
    async loadBlogData() {
      this.loading = true
      try {
        // Получаем всех пользователей
        const response = await axios.get('/api/userInfo/findAll')
        const user = response.data.find((u) => u.id == this.userId)

        if (user) {
          this.blogName = user.blogName || 'Блог'
          this.fullName = user.fullName || 'Автор'
        }

        this.posts = (user.post || [])
          .map((post) => ({
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
          }))
          .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
      } catch (error) {
        console.error('Ошибка загрузки блога:', error)
        alert('Ошибка при загрузке блога')
      } finally {
        this.loading = false
      }
    },
    removePost(post) {
      this.postToDelete = post
      this.showDeleteDialog = true
    },
    async confirmDeletePost() {
      if (!this.postToDelete) return
      try {
        // Отправляем запрос на удаление на сервер
        await axios.delete(`/api/post/${this.postToDelete.id}`)

        // Удаляем пост из локального списка
        this.posts = this.posts.filter((p) => p.id !== this.postToDelete.id)

        console.log('Пост удалён:', this.postToDelete.id)
      } catch (error) {
        console.error('Ошибка при удалении поста:', error)
        alert('Ошибка при удалении поста')
      }
    },
    async createPost(postData) {
      try {
        // Отправляем пост на сервер
        const response = await axios.post(
          '/api/post',
          {
            title: postData.title,
            briefDescription: postData.briefDescription,
            fullDescription: postData.fullDescription,
          },
          {
            params: {
              userInfoId: this.userId,
            },
          },
        )

        console.log('Пост создан:', response.data)

        // Добавляем новый пост в начало списка (с теми же полями, что ожидает PostItem)
        this.posts.unshift({
          id: response.data.id,
          title: response.data.title,
          briefDescription: response.data.briefDescription,
          date: new Date(response.data.dateTime).toLocaleDateString(),
          comment: 0,
          author: this.fullName,
          userId: this.userId,
          fullDescription: response.data.fullDescription,
          dateTime: response.data.dateTime,
          comments: [],
        })

        // Закрываем диалог
        this.dialogVisiblePost = false
      } catch (error) {
        console.error('Ошибка при создании поста:', error)
        alert(
          'Ошибка при создании поста: ' + (error.response?.data?.message || 'Неизвестная ошибка'),
        )
      }
    },
    async updatePost(updatedData) {
      try {
        const response = await axios.put(`/api/post`, {
          id: updatedData.id,
          title: updatedData.title,
          briefDescription: updatedData.briefDescription,
          fullDescription: updatedData.fullDescription,
        })

        // Обновляем пост в локальном списке
        const index = this.posts.findIndex((p) => p.id === updatedData.id)
        if (index !== -1) {
          this.posts[index] = {
            ...this.posts[index],
            title: response.data.title,
            briefDescription: response.data.briefDescription,
            fullDescription: response.data.fullDescription,
            userId: this.posts[index].userId,
          }
        }

        this.dialogVisiblePost = false
        this.editingPost = null
        console.log('Пост обновлён:', response.data)
      } catch (error) {
        console.error('Ошибка при обновлении поста:', error)
        alert('Ошибка при обновлении поста')
      }
    },
  },
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-family: 'Fyodor', sans-serif;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.delete-confirm {
  text-align: center;
}

.delete-confirm h3 {
  margin-bottom: 15px;
  color: #333;
}

.delete-confirm p {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.delete-confirm strong {
  color: #444;
}

.delete-confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
