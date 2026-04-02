<template>
  <div class="post-page">
    <header class="header">
      <my-button @click="toHome">
        <img src="@/icons/back.svg" alt="назад" />
      </my-button>
      <h1>Пост</h1>
    </header>

    <my-dialog v-model:show="showDeleteDialog">
      <div class="delete-confirm">
        <h3>Удалить комментарий?</h3>
        <p>Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить.</p>
        <div class="delete-confirm-buttons">
          <my-button @click="showDeleteDialog = false">Отмена</my-button>
          <my-button @click="confirmDelete">Удалить</my-button>
        </div>
      </div>
    </my-dialog>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="post" class="post-content">
      <h2>{{ post.title }}</h2>
      <p class="description">{{ post.briefDescription }}</p>
      <div class="full-description">{{ post.fullDescription }}</div>
      <div class="meta">
        <span>Автор: {{ post.author }}</span>
        <span>Дата: {{ post.date }}</span>
      </div>

      <!-- Комментарии -->
      <div class="comments-section">
        <h3>Комментарии ({{ comments.length }})</h3>

        <div v-if="comments.length === 0" class="no-comments">
          Пока нет комментариев. Будьте первым!
        </div>

        <div v-else class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <strong>{{ comment.userInfo || comment.userName }}</strong>
              <span class="comment-email">{{ comment.email }}</span>
            </div>
            <div class="comment-content-btn">
              <div class="comment-content">
                <p class="comment-text">{{ comment.textComment }}</p>
                <span class="comment-date">{{ formatDate(comment.dateTime) }}</span>
              </div>
              <my-button
                v-if="canDeleteComment()"
                @click="deleteComment(comment.id)"
                class="delete-comment-btn"
                title="Удалить комментарий"
              >
                🗑️
              </my-button>
            </div>
          </div>
        </div>

        <!-- Форма добавления комментария -->
        <div class="comment-form">
          <h4>Добавить комментарий</h4>
          <form @submit.prevent="addComment">
            <div
              class="form-group"
              :class="{ 'has-error': commentErrors.userName && commentAttempted }"
            >
              <my-input
                v-model="newComment.userName"
                placeholder="Ваше имя (обязательно, до 50 символов)"
                :maxlength="50"
                @input="validateCommentUserName"
              />
              <span v-if="commentErrors.userName && commentAttempted" class="error-message">
                {{ commentErrors.userName }}
              </span>
              <span v-else class="hint-message"
                >{{ 50 - newComment.userName.length }} символов осталось</span
              >
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': commentErrors.email && commentAttempted }"
            >
              <my-input
                v-model="newComment.email"
                type="email"
                placeholder="Email (обязательно, до 50 символов)"
                :maxlength="50"
                @input="validateCommentEmail"
              />
              <span v-if="commentErrors.email && commentAttempted" class="error-message">
                {{ commentErrors.email }}
              </span>
              <span v-else class="hint-message"
                >{{ 50 - newComment.email.length }} символов осталось</span
              >
            </div>

            <div
              class="form-group"
              :class="{ 'has-error': commentErrors.text && commentAttempted }"
            >
              <my-textarea
                v-model="newComment.text"
                placeholder="Текст комментария (обязательно, до 255 символов)"
                :rows="3"
                :maxlength="255"
                @input="validateCommentText"
              />
              <span v-if="commentErrors.text && commentAttempted" class="error-message">
                {{ commentErrors.text }}
              </span>
              <span v-else class="hint-message"
                >{{ 255 - newComment.text.length }} символов осталось</span
              >
            </div>
            <my-button type="primary" :disabled="commentLoading">
              {{ commentLoading ? 'Отправка...' : 'Отправить' }}
            </my-button>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="error">Пост не найден</div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      post: null,
      comments: [],
      loading: false,
      commentLoading: false,
      currentUserInfo: null,
      newComment: {
        userName: '',
        email: '',
        text: '',
      },
      commentErrors: {
        userName: '',
        email: '',
        text: '',
      },
      commentAttempted: false,
      showDeleteDialog: false,
      commentToDelete: null, // ID комментария для удаления
    }
  },
  async mounted() {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      this.currentUserInfo = JSON.parse(userInfoStr)
    }
    await this.loadPost()
    await this.loadComments()
  },
  methods: {
    toHome() {
      this.$router.push('/')
    },

    validateCommentUserName() {
      const value = this.newComment.userName.trim()
      if (!value) {
        this.commentErrors.userName = 'Имя обязательно'
      } else if (value.length > 50) {
        this.commentErrors.userName = 'Имя не должно превышать 50 символов'
      } else {
        this.commentErrors.userName = ''
      }
    },

    validateCommentEmail() {
      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
      const value = this.newComment.email.trim()

      if (!value) {
        this.commentErrors.email = 'Email обязателен'
      } else if (value.length > 50) {
        this.commentErrors.email = 'Email не должен превышать 50 символов'
      } else if (!emailRegex.test(value)) {
        this.commentErrors.email = 'Введите корректный email'
      } else {
        this.commentErrors.email = ''
      }
    },

    validateCommentText() {
      const value = this.newComment.text.trim()
      if (!value) {
        this.commentErrors.text = 'Текст комментария обязателен'
      } else if (value.length > 255) {
        this.commentErrors.text = 'Текст не должен превышать 255 символов'
      } else {
        this.commentErrors.text = ''
      }
    },

    validateAllComments() {
      this.validateCommentUserName()
      this.validateCommentEmail()
      this.validateCommentText()
    },

    isCommentValid() {
      return (
        !this.commentErrors.userName &&
        !this.commentErrors.email &&
        !this.commentErrors.text &&
        this.newComment.userName.trim() &&
        this.newComment.email.trim() &&
        this.newComment.text.trim()
      )
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    async loadPost() {
      this.loading = true
      try {
        // Получаем всех пользователей, чтобы найти пост
        const response = await axios.get('/api/userInfo/findAll')
        const users = response.data

        // Ищем пост среди всех пользователей
        let foundPost = null
        let foundUser = null

        for (const user of users) {
          const post = user.post?.find((p) => p.id == this.id)
          if (post) {
            foundPost = post
            foundUser = user
            break
          }
        }

        if (foundPost) {
          this.post = {
            id: foundPost.id,
            title: foundPost.title,
            briefDescription: foundPost.briefDescription,
            fullDescription: foundPost.fullDescription,
            date: new Date(foundPost.dateTime).toLocaleDateString(),
            author: foundUser.fullName || foundUser.blogName,
            userId: foundUser.id,
            dateTime: foundPost.dateTime,
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки поста:', error)
        alert('Ошибка при загрузке поста')
      } finally {
        this.loading = false
      }
    },

    async loadComments() {
      try {
        const response = await axios.get(`/api/post/${this.id}`)
        this.comments = response.data.comments || []
      } catch (error) {
        console.error('Ошибка загрузки комментариев:', error)
      }
    },

    async addComment() {
      this.commentAttempted = true
      this.validateAllComments()

      if (!this.isCommentValid()) {
        return
      }

      this.commentLoading = true
      try {
        const response = await axios.post(
          '/api/comment',
          {
            userInfo: this.newComment.userName,
            email: this.newComment.email,
            textComment: this.newComment.text,
          },
          {
            params: {
              postId: this.post.id,
            },
          },
        )

        // Добавляем комментарий в список
        this.comments.unshift({
          id: response.data.id,
          userInfo: this.newComment.userName,
          email: this.newComment.email,
          textComment: this.newComment.text,
          dateTime: new Date().toISOString(),
        })

        this.newComment = {
          userName: '',
          email: '',
          text: '',
        }
        this.commentErrors = {
          userName: '',
          email: '',
          text: '',
        }
        this.commentAttempted = false
      } catch (error) {
        console.error('Ошибка добавления комментария:', error)
        alert('Ошибка при добавлении комментария')
      } finally {
        this.commentLoading = false
      }
    },

    canDeleteComment() {
      return this.currentUserInfo?.id === this.post?.userId
    },

    deleteComment(commentId) {
      this.commentToDelete = commentId
      this.showDeleteDialog = true
    },

    async confirmDelete() {
      if (!this.commentToDelete) return

      try {
        await axios.delete(`/api/comment/${this.commentToDelete}`)
        this.comments = this.comments.filter((c) => c.id !== this.commentToDelete)
        console.log('Комментарий удалён:', this.commentToDelete)
      } catch (error) {
        console.error('Ошибка при удалении комментария:', error)
        alert('Ошибка при удалении комментария')
      } finally {
        this.showDeleteDialog = false
        this.commentToDelete = null
      }
    },
  },
}
</script>

<style scoped>
.post-page {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.header h1 {
  font-family: 'Fyodor', sans-serif;
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}

.post-content {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-content h2 {
  margin-bottom: 15px;
  color: #333;
}

.description {
  font-size: 18px;
  color: #444;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.full-description {
  line-height: 1.6;
  margin-bottom: 20px;
  white-space: pre-wrap;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #888;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.delete-comment-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 6px;
  transition: all 0.2s;
  color: #999;
  margin: 0;
  margin-left: auto;
}

.delete-comment-btn:hover {
  background: #ff4444;
  color: white;
}

/* Комментарии */
.comments-section {
  margin-top: 40px;
}

.comments-section h3 {
  margin-bottom: 20px;
  color: #333;
}

.no-comments {
  text-align: center;
  padding: 40px;
  color: #888;
  background: #f9f9f9;
  border-radius: 12px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

.comment {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 15px;
}

.comment-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  align-items: center;
}

.comment-header strong {
  color: #444;
}

.comment-email {
  color: #888;
  font-size: 12px;
}

.comment-date {
  color: #aaa;
  font-size: 12px;
}

.comment-text {
  line-height: 1.5;
  color: #444;
  margin-bottom: 5px;
}

.comment-content-btn {
  display: flex;
  flex-direction: row;
}
/* Форма комментария */
.comment-form {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.comment-form h4 {
  margin-bottom: 15px;
  color: #333;
}

.comment-form form {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

/* Стили для диалога подтверждения */
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

.delete-confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
