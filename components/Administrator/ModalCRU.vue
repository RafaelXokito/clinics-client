<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method+' Administrator'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-id"
          label-for="input-id"
          v-if="method=='edit'"
        >
          <b-form-input
            id="input-id"
            :disabled="method=='edit'"
            v-model="form.id"
            type="text"
            placeholder="Enter id"
            required
            trim
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-email"
          label="Email address:"
          label-for="input-email"
        >
          <b-form-input
            id="input-email"
            v-model.lazy="form.email"
            type="email"
            :state="emailState"
            placeholder="Enter email"
            aria-describedby="input-email-feedback"
            required
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-email-feedback">
            {{form.emailError}}
          </b-form-invalid-feedback>
        </b-form-group>
          <b-form-group
          id="input-group-password"
          label="Enter password:"
          label-for="input-password"
          v-if="method !=='edit'"
        >
          <b-form-input
            id="input-password"
            v-model.lazy="form.password"
            type="password"
            :state="passwordState"
            aria-describedby="input-password-feedback"
            placeholder="Enter password"
            required
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-password-feedback">
            {{form.passwordError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-name" label="Your Name:" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model.lazy="form.name"
            :state="nameState"
            aria-describedby="input-name-feedback"
            placeholder="Enter name"
            required
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-name-feedback">
            {{form.nameError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-gender" label="Gender:" label-for="input-gender">
          <b-form-select
            id="input-gender"
            :state="genderState"
            v-model="form.gender"
            aria-describedby="input-gender-feedback"
            :options="genders"
            required
          ></b-form-select>
          <b-form-invalid-feedback id="input-gender-feedback">
            {{form.genderError}}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
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
        emailError: '',
        name: '',
        nameError: null,
        gender: null,
        genderError: null,
        password: '',
        passwordError: null,
      },
      genders: [{ text: 'Select One', value: null }, 'Male', 'Female'],
      show: true,
    }
  },
  computed: {
    emailState(){
      if (this.form.email == "") {
        return null
      }
      var re = /\S+@\S+\.\S+/;
      if (!re.test(this.form.email)) {
        this.form.emailError = "Invalid email!"
        return false
      }
      return true
    },
    nameState(){
      if (this.form.name == "") {
        return null
      }
      if (!(this.form.name.length > 5)) {
        this.form.nameError = "Name need to contains at least 6 characters!"
        return false
      }
      return true
    },
    genderState(){
      if (this.form.gender == "") {
        return null
      }
      if (!(this.form.gender === 'Male' || this.form.gender === 'Female' || this.form.gender === 'Other')) {
        this.form.genderError = "Invalid gender!"
        return false
      }
      return true
    },
    passwordState(){
      if (this.form.password == "") {
        return null
      }
      if (!(this.form.password.length > 3)) {
        this.form.passwordError = "Password need to contains at least 4 characters!"
        return false
      }
      return true
    }
  },
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  methods: {
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
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
    entity(newEntity, oldVar){
      if (newEntity != null) {
        if (this.method == 'edit') {
          this.form.id = this.entity.id;
          this.form.email = this.entity.email;
          this.form.name = this.entity.name;
          this.form.gender = this.entity.gender;
        }else {
          this.form.id = ""
          this.form.email = ""
          this.form.name = ""
          this.form.gender = ""
        }

        // if (newEntity["name"] != undefined) {
        //   this.name = newEntity["name"];
        // }else{
        //   this.name = this.$route.name.replace(/([A-Z])/g, ' $1').trim()
        // }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
