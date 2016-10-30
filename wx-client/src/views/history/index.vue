<template lang="pug">
#history
  banner
  content
  float-button(v-if="user.type === 9", style="right: 20px; bottom: 20px; z-index: 99", fixed, color="red", icon="settings", v-link="{path: '/history/article/upload'}")
</template>

<script>
import { user } from '../../vuex/getters'

import banner from '../../components/history/banner'
import content from '../../components/history/content'

export default {
  components: {
    banner,
    content
  },
  vuex: {
    getters: {
      user
    }
  }
}
</script>
