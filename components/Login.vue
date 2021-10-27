<template>
    <div class="vue-tempalte">
        <b-form @submit="onSubmit" @reset="onReset">

            <div class="mb-5 text-center">
              <b-img src="https://www.sns.gov.pt/wp-content/uploads/2016/08/CHLeiria_logo.jpg" fluid alt="Responsive image"></b-img>
            </div>

            <div class="form-group">
                <label>Email address</label>
                <input type="email" class="form-control form-control-lg" />
            </div>

            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control form-control-lg" />
            </div>

            <button type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

            <p class="forgot-password text-right mt-2 mb-4">
                <router-link to="/forgot-password">Forgot password ?</router-link>
            </p>

        </b-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              form: {
                email: '',
                password: ''
              },
            }
        },
        methods: {
          onSubmit(event) {
            event.preventDefault()
            alert(JSON.stringify(this.form))
            this.$router.push({ name: 'dashboard' })
          },
          onReset(event) {
            event.preventDefault()
            // Reset our form values
            this.form.email = ''
            this.form.password = ''
            this.$nextTick(() => {
              this.show = true
            })
          }
        },
    }
</script>

<style scoped>
  img{
    height: 150px;
  }
</style>
