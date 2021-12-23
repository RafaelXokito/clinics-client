<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method+' Biometric Data Type'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-1"
          label="Name:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-min" label="Min:" label-for="input-min">
          <b-input-group :append="buildUnitName">
            <b-form-input
              id="input-min"
              v-model="form.min"
              placeholder="X"
              required
              type="number"
              step="0.01"
              @change="parseFloat(form.min).toFixed(2)"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group id="input-group-max" label="Max:" label-for="input-max">
          <b-input-group :append="buildUnitName">
            <b-form-input
              id="input-max"
              v-model="form.max"
              placeholder="X"
              required
              type="number"
              step="0.01"
              @change="parseFloat(form.max).toFixed(2)"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
        <b-form-group id="input-group-unit" label="Unit:" label-for="input-unit">
          <b-form-input
            id="input-unit"
            v-model="form.unit"
            placeholder="Enter unit"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-unit-name" label="Unit Name:" label-for="input-unit-name">
          <b-form-input
            id="input-unit-name"
            v-model="form.unit_name"
            placeholder="Enter unit name"
            required
          ></b-form-input>
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
        min: '',
        max: '',
        unit: '',
        unit_name: '',
      },
      show: true
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
          this.form.id = this.entity.id;
          this.form.name = this.entity.name;
          this.form.min = this.entity.min;
          this.form.max = this.entity.max;
          this.form.unit = this.entity.unit;
          this.form.unit_name = this.entity.unit_name;
        }else {
          this.form = {}
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
