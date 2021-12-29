<template>
  <div>
    <navbar/>
    <b-container class="text-center pt-5">
      <b-form @submit.prevent="onSubmit">
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </p>
      <b-form-group
        id="input-group-1"
        label="Current Password:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.oldPassword"
          type="password"
          placeholder="****"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="New Password" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.newPassword"
          type="password"
          placeholder="****"
          required
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
    </b-container>
  </div>
</template>

<script>
import navbar from "../../components/NavBar.vue"
export default {
  middleware: ('auth'),
  components: {
    navbar
  },
  data() {
    return {
      errors: [],
      form: {
        id: '',
        oldPassword: '',
        newPassword: '',
      },
    }
  },
  computed: {
    currentUser(){
      return this.$auth.user
    }
  },
  methods: {
    showErrorMessage(err) {
      if (err.response) {
        this.$toast.error('ERROR: ' + err.response.data).goAway(3000);
      }
      else {
        this.$toast.error(err).goAway(3000);
      }
    },
    onSubmit(){
      this.$axios
        .$patch('/api/auth/updatepassword', this.form)
        .then(() => {
          this.$toast.success('Password updated').goAway(3000);
        })
        .catch((err)=>{
          this.$toast.error('Password was not updated').goAway(3000);
        });
    },
  },
}
</script>

<style>

</style>
