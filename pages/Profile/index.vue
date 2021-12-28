<template>
  <div>
      <navbar/>
      <b-container class="text-center pt-5">
        <b-button @click="showEdit = !showEdit">{{showEdit ? 'Back' : 'Edit'}}</b-button>
        <div v-if="!showEdit">
          <h2>{{currentUser.name}}</h2>
          <h3>{{currentUser.email}}</h3>
          <h3>{{currentUser.gender}}</h3>
        </div>
        <b-form @submit.prevent="onSubmit" v-else-if="showEdit">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            placeholder="Enter name"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Gender:" label-for="input-3">
          <b-form-select
            id="input-3"
            v-model="form.gender"
            :options="genders"
            required
          ></b-form-select>
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
      form: {
        id: '',
        email: '',
        name: '',
        gender: null,
      },
      genders: [{ text: 'Select One', value: null }, 'Male', 'Female'],
      showEdit: true,
    }
  },
  computed: {
    currentUser(){
      return this.$auth.user
    }
  },
  mounted() {
    this.form.id = this.currentUser.id
    this.form.email = this.currentUser.email
    this.form.name = this.currentUser.name
    this.form.gender = this.currentUser.gender
  },
  methods: {
    onSubmit(){
      this.$axios
        .$put('/api/auth/update', this.form)
        .then(() => {
          this.$auth.fetchUser();
          this.$toast.success('Profile updated').goAway(3000);
        })
        .catch((err)=>{
          this.$toast.error('Profile was not updated').goAway(3000);
          console.log(err);
        });
    },
  }
}
</script>

<style>

</style>
