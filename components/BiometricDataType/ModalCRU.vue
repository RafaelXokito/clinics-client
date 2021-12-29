<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method+' Biometric Data Type'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-form-group
          id="input-group-name"
          label="Name:"
          label-for="input-name"
        >
          <b-form-input
            id="input-name"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            :state="nameState"
            required
            trim
          ></b-form-input>
          <b-form-invalid-feedback id="input-name-feedback">
            {{form.nameError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-min" label="Min:" label-for="input-min">
          <b-input-group :append="buildUnitName">
            <b-form-input
              id="input-min"
              v-model="form.min"
              placeholder="X"
              :state="minState"
              required
              type="number"
              step="0.01"
              @change="parseFloat(form.min).toFixed(2)"
            ></b-form-input>
            <b-form-invalid-feedback id="input-min-feedback">
              {{form.minError}}
            </b-form-invalid-feedback>
          </b-input-group>
        </b-form-group>
        <b-form-group id="input-group-max" label="Max:" label-for="input-max">
          <b-input-group :append="buildUnitName">
            <b-form-input
              id="input-max"
              v-model="form.max"
              placeholder="X"
              :state="maxState"
              required
              type="number"
              step="0.01"
              @change="parseFloat(form.max).toFixed(2)"
            ></b-form-input>
            <b-form-invalid-feedback id="input-max-feedback">
              {{form.maxError}}
            </b-form-invalid-feedback>
          </b-input-group>
        </b-form-group>
        <b-form-group id="input-group-unit" label="Unit:" label-for="input-unit">
          <b-form-input
            id="input-unit"
            v-model="form.unit"
            placeholder="Enter unit"
            :state="unitState"
            required
          ></b-form-input>
          <b-form-invalid-feedback id="input-unit-feedback">
            {{form.unitError}}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-unit-name" label="Unit Name:" label-for="input-unit-name">
          <b-form-input
            id="input-unit-name"
            v-model="form.unit_name"
            placeholder="Enter unit name"
            :state="unit_nameState"
            required
          ></b-form-input>
          <b-form-invalid-feedback id="input-unit_name-feedback">
            {{form.unit_nameError}}
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
        name: '',
        nameError: '',
        min: '',
        minError: '',
        max: '',
        maxError: '',
        unit: '',
        unitError: '',
        unit_name: '',
        unit_nameError: '',
      },
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
    buildUnitName(){
      return this.form.unit || this.form.unit_name ? (this.form.unit ?? '') + ' ' + (this.form.unit_name ?? '') : ''
    },
    nameState(){
      if (this.form.name == "" || this.form.name == null) {
        return null
      }
      if (!(this.form.name.length >= 2)) {
        this.form.nameError = "Name need to contains at least 2 characters!"
        return false
      }
      return true
    },
    minState(){
      if (this.form.min == "" || this.form.min == null) {
        return null
      }
      if (!(this.form.min < this.form.max)) {
        this.form.minError = "Invalid minimum! Minimum should be lower than maximum."
        return false
      }
      return true
    },
    maxState(){
      if (this.form.max == "" || this.form.max == null) {
        return null
      }
      if (!(this.form.max > this.form.min)) {
        this.form.maxError = "Invalid maximum! Maximum should be higher than minimum."
        return false
      }
      return true
    },
    unitState(){
      if (this.form.unit == "" || this.form.unit == null) {
        return null
      }
      if (!(this.form.unit.length >= 1)) {
        this.form.nameError = "Unit need to contains at least 1 characters!"
        return false
      }
      return true
    },
    unit_nameState(){
      if (this.form.unit_name == "" || this.form.unit_name == null) {
        return null
      }
      if (!(this.form.unit_name.length >= 2)) {
        this.form.unit_nameError = "Unit name need to contains at least 2 characters!"
        return false
      }
      return true
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
    resetBtnPressed() {
      this.form = Object.assign({}, this.clone)
    },
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
    entity(newEntity){
      if (newEntity != null) {
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
          this.form = {}
          this.clone = Object.assign({}, this.form)
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
