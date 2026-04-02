<template>
  <div v-if="posts.length > 0">
    <transition-group name="list">
      <post-item
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :profileActive="profileActive"
        :showRemove="showRemove"
        @remove="$emit('remove', post)"
        @edit="$emit('edit', post)"
      />
    </transition-group>
  </div>
  <h2 v-else>Постов нет</h2>
</template>

<script>
import PostItem from '@/components/PostItem.vue'
export default {
  components: {
    PostItem,
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
    profileActive: {           
      type: Boolean,
      default: true
    }
  },
}
</script>

<style scoped>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
