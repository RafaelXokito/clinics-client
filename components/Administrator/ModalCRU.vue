<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method+' Administrator'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-1"
          label="Enter username:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            :disabled="method=='edit'"
            v-model="form.username"
            type="text"
            placeholder="Enter username"
            required
          ></b-form-input>
        </b-form-group>
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
          <b-form-group
          id="input-group-1"
          label="Enter password:"
          label-for="input-1"
          v-if="method !=='edit'"
        >
          <b-form-input
            id="input-1"
            v-model="form.password"
            type="password"
            placeholder="Enter password"
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
        username: '',
        email: '',
        name: '',
        gender: null,
        password: '',
      },
      genders: [{ text: 'Select One', value: null }, 'Male', 'Female'],
      show: true
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
      console.log(this.form)
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
          this.form.username = this.entity.username;
          this.form.email = this.entity.email;
          this.form.name = this.entity.name;
          this.form.gender = this.entity.gender;
        }else {
          this.form.username = ""
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
