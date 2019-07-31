<template>
  <div class="home">
    <h1>这个是首页</h1>
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

<style lang="scss" scoped>
  .home{
    margin-top: 60px;
    line-height: 60px;
  }
  h1{
    font-size: 30px;
    font-weight: 600px;
  }
</style>
