<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1)+' Administrator'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-form-group
          id="input-group-email"
          label="Email:"
          label-for="input-email"
          label-class="font-weight-bold"
        >
          <b-form-input
            id="input-email"
            v-model.lazy="form.email"
            type="email"
            :state="emailState"
            placeholder="Enter email"
            aria-describedby="input-email-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-email-feedback">
            {{emailError}}
          </b-form-invalid-feedback>
        </b-form-group>
          <b-form-group
          id="input-group-password"
          label="Password:"
          label-for="input-password"
          label-class="font-weight-bold"
          v-if="method !=='edit'"
        >
          <b-form-input
            id="input-password"
            v-model.lazy="form.password"
            type="password"
            name="password"
            autocomplete="on"
            :state="passwordState"
            aria-describedby="input-password-feedback"
            placeholder="Enter password"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-password-feedback">
            {{passwordError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-name" label="Name:" label-for="input-name" label-class="font-weight-bold">
          <b-form-input
            id="input-name"
            v-model.lazy="form.name"
            :state="nameState"
            aria-describedby="input-name-feedback"
            placeholder="Enter name"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-name-feedback">
            {{nameError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-gender" label="Gender:" label-for="input-gender" label-class="font-weight-bold">
          <b-form-select
            id="input-gender"
            :state="genderState"
            v-model="form.gender"
            aria-describedby="input-gender-feedback"
            :options="genders"
          ></b-form-select>
          <b-form-invalid-feedback id="input-gender-feedback">
            {{genderError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
          id="input-group-birthdate"
          label="Date of Birth:"
          label-for="input-birthdate"
          label-class="font-weight-bold"
        >
          <b-form-datepicker
            id="input-birthdate"
            v-model="form.birthDate"
            :state="birthdateState"
            show-decade-nav
            hide-header
            aria-describedby="input-birthdate-feedback"
          />
          <b-form-invalid-feedback id="input-birthdate-feedback">
            {{birthdateErr}}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-button type="submit" variant="primary">{{this.method === 'create' ? 'Create' : 'Save'}}</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      form: {
        id: '',
        email: '',
        name: '',
        gender: null,
        password: '',
        birthDate: null
      },

      emailError: '',
      nameError: '',
      genderError: '',
      passwordError: '',
      birthdateErr: '',
      isSubmitting: false,

      genders: ['Male', 'Female', 'Other'],
      show: true,
      clone: {}
    }
  },
  computed: {
    emailState(){
      if (this.form.email === "") {
        this.emailError = "Email is required"
        return this.isSubmitting ? false : null
      }
      var re = /\S+@\S+\.\S+/;
      if (!re.test(this.form.email)) {
        this.emailError = "Invalid email!"
        return false
      }
      return true
    },
    nameState(){
      if (this.form.name === "") {
        this.nameError = "Name is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.name.length > 5)) {
        this.nameError = "Name need to contains at least 6 characters!"
        return false
      }
      return true
    },
    genderState(){
      if (this.form.gender === "") {
        this.genderError = "Gender is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.gender === 'Male' || this.form.gender === 'Female' || this.form.gender === 'Other')) {
        this.genderError = "Invalid gender!"
        return false
      }
      return true
    },
    passwordState(){
      if (this.method === 'edit')
        return true
      if (this.form.password === "") {
        this.passwordError = "Password is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.password.length > 3)) {
        this.passwordError = "Password need to contains at least 4 characters!"
        return false
      }
      return true
    },
    birthdateState() {
      if (this.form.birthDate == null) {
        this.birthdateErr = "Day of Birth is required"
        return this.isSubmitting ? false : null
      }
      if (new Date(this.form.birthDate) > new Date()) {
        this.birthdateErr = "Day of Birth should be lower than current day"
        return false
      }
      return true
    },
    isFormValid() {
      return this.emailState && this.nameState && this.genderState && this.passwordState && this.birthdateState
    }
  },
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
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
    resetBtnPressed() {
      this.isSubmitting = false
      this.form = Object.assign({}, this.clone)
    },
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      this.isSubmitting = true
      if (!this.isFormValid) {
        this.showErrorMessage("Fix the errors before submitting")
        return;
      }
      this.form.birthDate = new Date(this.form.birthDate)

      this.$emit("onSubmit",this.form, this.method)
    },
  },
  watch: {
    modalShow(newVal){
      if (newVal === true) {
        this.$refs.bvEntity.show()
      }else{
        this.$refs.bvEntity.hide()
      }
    },
    entity(newEntity){
      if (newEntity != null) {
        this.isSubmitting = false
        if (this.method === 'edit') {
          this.form.id = this.entity.id;
          this.form.email = this.entity.email;
          this.form.name = this.entity.name;
          this.form.gender = this.entity.gender;
          this.form.birthDate = new Date(this.entity.birthDate);
          this.clone = Object.assign({}, this.form)
        }
        else {
          this.form.id = ""
          this.form.email = ""
          this.form.name = ""
          this.form.gender = "Male"
          this.form.password = ""
          this.form.birthDate = null
          this.clone = Object.assign({}, this.form)
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
