<template>
  <div>
    <keep-alive>
      <router-view :class="{'avue-view':!isMobile}" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view :class="{'avue-view':!isMobile}" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(["isMobile"]),
  },
}

</script>
