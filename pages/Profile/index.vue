<template>
  <div>
      <navbar/>
      <b-container class="text-center pt-5">
        <h2>{{currentUser.name}}</h2>
      </b-container>
  </div>
</template>

<script>
import navbar from "../../components/NavBar.vue"

export default {
  components: {
    navbar
  },
  computed: {
    currentUser(){
      return this.$auth.user
    }
  }
}
</script>

<style>

</style>
