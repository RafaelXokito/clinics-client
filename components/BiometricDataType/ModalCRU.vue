<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1)+' Biometric Data Type'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-form-group
          id="input-group-name"
          label="Name:"
          label-for="input-name"
          label-class="font-weight-bold"
        >
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            :state="nameState"
            aria-describedby="input-name-feedback"
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-name-feedback">
            {{nameError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-min" label="Min:" label-for="input-min" label-class="font-weight-bold">
          <b-input-group :prepend="form.unit_name">
            <b-form-input
              id="input-min"
              v-model="form.min"
              placeholder="X"
              :state="minState"
              aria-describedby="input-min-feedback"
              type="number"
              step="0.01"
              @change="parseFloat(form.min).toFixed(2)"
            ></b-form-input>
            <b-form-invalid-feedback id="input-min-feedback">
              {{minError}}
            </b-form-invalid-feedback>
          </b-input-group>
        </b-form-group>
        <b-form-group id="input-group-max" label="Max:" label-for="input-max" label-class="font-weight-bold">
          <b-input-group :prepend="form.unit_name">
            <b-form-input
              id="input-max"
              v-model="form.max"
              placeholder="X"
              :state="maxState"
              aria-describedby="input-max-feedback"
              type="number"
              step="0.01"
              @change="parseFloat(form.max).toFixed(2)"
            ></b-form-input>
            <b-form-invalid-feedback id="input-max-feedback">
              {{maxError}}
            </b-form-invalid-feedback>
          </b-input-group>
        </b-form-group>
        <b-form-group id="input-group-unit" label="Unit:" label-for="input-unit" label-class="font-weight-bold">
          <b-form-input
            id="input-unit"
            v-model="form.unit"
            placeholder="Enter unit"
            :state="unitState"
            aria-describedby="input-unit-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="input-unit-feedback">
            {{unitError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-unit-name" label="Unit Name:" label-for="input-unit-name" label-class="font-weight-bold">
          <b-form-input
            id="input-unit-name"
            v-model="form.unit_name"
            placeholder="Enter unit name"
            :state="unit_nameState"
            aria-describedby="input-unit_name-feedback"
          ></b-form-input>
          <b-form-invalid-feedback id="input-unit_name-feedback">
            {{unit_nameError}}
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
        name: '',
        min: '',
        max: '',
        unit: '',
        unit_name: '',
      },

      nameError: '',
      minError: '',
      maxError: '',
      unitError: '',
      unit_nameError: '',

      isSubmitting: false,

      show: true,
      clone: {},
    }
  },
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  computed: {
    nameState(){
      if (this.form.name === "" || this.form.name == null) {
        this.nameError = "Name is required"
        return this.isSubmitting ? false : null
      }
      if (this.form.name.length < 2) {
        this.nameError = "Name need to contains at least 2 characters!"
        return false
      }
      return true
    },
    minState(){
      if (this.form.min == null || this.form.min === "") {
        this.minError = "Min is required"
        return this.isSubmitting ? false : null
      }
      if ((this.form.max !== "") && Number(this.form.min) >= Number(this.form.max)) {
        this.minError = "Invalid minimum! Minimum should be lower than maximum."
        return false
      }
      return true
    },
    maxState(){
      if (this.form.max == null || this.form.max === "") {
        this.maxError = "Max is required"
        return this.isSubmitting ? false : null
      }
      if ((this.form.min !== "") && Number(this.form.max) <= Number(this.form.min)) {
        this.maxError = "Invalid maximum! Maximum should be higher than minimum."
        return false
      }
      return true
    },
    unitState(){
      if (this.form.unit === "" || this.form.unit == null) {
        this.unitError = "Unit is required"
        return this.isSubmitting ? false : null
      }
      if (this.form.unit.length === 0) {
        this.nameError = "Unit need to contains at least 1 characters!"
        return false
      }
      return true
    },
    unit_nameState(){
      if (this.form.unit_name === "" || this.form.unit_name == null) {
        this.unit_nameError = "Unit name is required"
        return this.isSubmitting ? false : null
      }
      if (this.form.unit_name.length < 2) {
        this.unit_nameError = "Unit name need to contains at least 2 characters!"
        return false
      }
      return true
    },
    isFormValid() {
      return this.nameState && this.minState && this.maxState && this.unit_nameState && this.unitState
    },
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
          this.form.name = this.entity.name;
          this.form.min = this.entity.min;
          this.form.max = this.entity.max;
          this.form.unit = this.entity.unit;
          this.form.unit_name = this.entity.unit_name;
          this.clone = Object.assign({}, this.form)
        }
        else {
          this.form.id = 0
          this.form.name = "";
          this.form.min = "";
          this.form.max = "";
          this.form.unit = "";
          this.form.unit_name = "";
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
