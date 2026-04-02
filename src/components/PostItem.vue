<template>
  <div
    class="post"
    role="button"
    tabindex="0"
    @click="goToPost"
    @keydown.enter="goToPost"
    @keydown.space.prevent="goToPost"
  >
    <header class="header">
      <div class="author" @click.stop="handleProfileClick">
        <my-button class="btnProfile" :disabled="!profileActive">
          <img src="@/icons/profile.svg" alt="В профиль" class="iconProfile" />
        </my-button>
        <h4>{{ post.author }}</h4>
      </div>
      <div v-if="showRemove" class="post__btns" @click.stop>
        <my-button @click="$emit('edit', post)" class="btnEdit">
          <img src="@/icons/edit.svg" alt="редактировать" />
        </my-button>
        <my-button @click="$emit('remove', post)" class="btnDelete">
          <img src="@/icons/delete.svg" alt="удалить" />
        </my-button>
      </div>
    </header>
    <h3>{{ post.title }}</h3>
    <p class="description">{{ post.briefDescription }}</p>
    <footer class="footer">
      <span class="comments">
        💬
        {{
          post.comment === 0
            ? 'нет комментариев'
            : `${post.comment} ${
                post.comment === 1
                  ? 'комментарий'
                  : post.comment < 5
                    ? 'комментария'
                    : 'комментариев'
              }`
        }}
      </span>
      <span class="date">📅 {{ post.date }}</span>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
    profileActive: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleProfileClick() {
      if (this.profileActive) {
        this.$router.push(`/blog/${this.post.userId}`)
      }
    },
    goToPost() {
      this.$router.push(`/post/${this.post.id}`)
    },
  },
}
</script>

<style scoped>
.post {
  padding: 20px;
  border: 2px solid #e0e0e0;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #e09d5e;
}

.post:focus-visible {
  outline: 2px solid #e09d5e;
  outline-offset: 2px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #444;
  transition: color 0.2s;
}

.author:hover h4 {
  color: #e09d5e;
}

.post h3 {
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.description {
  color: #666;
  line-height: 1.5;
  margin: 4px 0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #888;
}

.comments,
.date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.iconProfile {
  width: 16px;
  height: 16px;
  display: block;
}

.btnProfile,
.btnEdit,
.btnDelete {
  padding: 5px;
  margin: 0;
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.1s ease;
}

.btnProfile img,
.btnEdit img,
.btnDelete img {
  width: 18px;
  height: 18px;
  transition: transform 0.1s ease;
}

.btnEdit:hover img,
.btnDelete:hover img {
  transform: scale(1.1);
}

.btnProfile:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btnProfile:disabled:hover img {
  transform: none;
}

.post__btns {
  display: flex;
  gap: 8px;
}

.btnEdit:hover {
  background-color: #e09d5e;
}

.btnEdit:hover img {
  filter: brightness(0) invert(1);
  transform: scale(1.1);
}

.btnDelete:hover {
  background-color: #ff4444;
}

.btnDelete:hover img {
  filter: brightness(0) invert(1);
  transform: scale(1.1);
}

.btnProfile:not(:disabled):hover {
  background-color: #e09d5e;
}

.btnProfile:not(:disabled):hover img {
  filter: brightness(0) invert(1);
  transform: scale(1.1);
}
</style>
