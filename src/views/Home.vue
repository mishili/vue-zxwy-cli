<template>
  <div class="home">
    <Headers/>
    <router-view name="sidebar"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Headers from '@/components/Headers.vue'

export default {
  name: 'home',
  components: {
    Headers
  }
}
</script>
