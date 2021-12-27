<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method+' Biometric Data Issue'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-2" label="Name:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.name"
            placeholder="Enter Name"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-min" label="Min:" label-for="input-min">
          <b-input-group :append="form.biometricDataTypeUnit">
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
          <b-input-group :append="form.biometricDataTypeUnit">
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
        <b-form-group
              id="input-group-biometricdatatype"
              label="Biometric Data Type:"
              label-for="input-biometricdatatype"
            >
              <b-input-group>
                <b-form-input
                  id="input-biometricdatatype"
                  v-model="form.biometricDataTypeName"
                  type="text"
                  placeholder="Enter Type"
                  required
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-info"><b-icon icon="search" @click="selectBiometricType"></b-icon></b-button>
                </b-input-group-append>
                <b-input-group-append>
                  <b-button variant="outline-danger"><b-icon icon="backspace" @click="unselectBiometricType"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <div v-if="toggleTSelect" class="pt-3">
                  <b-table  id="my-bioData-table" :items="selectableTEntity" :fields="selectableTFields" small hover responsive selectable select-mode="single" @row-selected="selectableEntityTClicked" :current-page="currentBioDataPage" :per-page="perPage">
                    <template #cell(selected)="data">
                      <template v-if="data.item.id == form.biometricDataTypeId">
                        <span aria-hidden="true">&check;</span>
                        <span class="sr-only">Selected</span>
                      </template>
                      <template v-else>
                        <span aria-hidden="true">&nbsp;</span>
                        <span class="sr-only">Not selected</span>
                      </template>
                    </template>
                  </b-table>
                  <b-pagination
                    v-model="currentBioDataPage"
                    :total-rows="bioDataRows"
                    :per-page="perPage"
                    aria-controls="my-patients-table"
                    align="center"
                  ></b-pagination>
                </div>
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
        biometricDataTypeId: '',
        biometricDataTypeName: '',
        biometricDataTypeUnit: ''
      },
      show: true,

      perPage: 4,

      currentBioDataPage: 1,
      selectableTEntity: [],
      selectableTFields: [],
      toggleTSelect: false,
    }
  },
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  computed: {
    bioDataRows() {
      return this.selectableTEntity.length
    }
  },
  mounted() {
    //Load Biometric Data Types
      this.$axios
      .$get('/api/biometricdatatypes')
      .then(biometricdatatypes => {
        this.selectableTEntity = biometricdatatypes.entities
        this.selectableTFields = biometricdatatypes.columns
        this.selectableTFields.unshift("selected")
      })
      .catch((err)=>{
        console.log(err);
      });
  },
  methods: {
    selectableEntityTClicked(record){
      if (record[0]) {
        this.form.biometricDataTypeId = record[0].id
        this.form.biometricDataTypeName = record[0].name
        this.form.biometricDataTypeUnit = record[0].unit + ' ' + record[0].unit_name
      }
    },
    onReset(){
      this.toggleTSelect = false
      this.$emit("onReset")
    },
    onSubmit(){
      console.log(this.form)
      this.toggleTSelect = false
      this.$emit("onSubmit",this.form, this.method)
    },
    selectBiometricType(){
      this.toggleTSelect = !this.toggleTSelect;
    },
    unselectBiometricType(){
      this.form.biometricDataTypeId = ""
      this.form.biometricDataTypeName = ""
      this.form.biometricDataTypeUnit = ""
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
        if (this.method == 'edit') {
          this.form.id = this.entity.id;
          this.form.name = this.entity.name;
          this.form.min = this.entity.min;
          this.form.max = this.entity.max;
          this.form.biometricDataTypeId = this.entity.biometricDataTypeId;
          this.form.biometricDataTypeName = this.entity.biometricDataTypeName;
          let biometricType = this.selectableTEntity.filter((e) => e.id == this.entity.biometricDataTypeId)[0];
          this.form.biometricDataTypeUnit = biometricType.unit + ' ' + biometricType.unit_name
        }else {
          this.form.id = ''
          this.form.name = ''
          this.form.min = ''
          this.form.max = ''
          this.form.biometricDataTypeId = ''
          this.form.biometricDataTypeName = ''
          this.form.biometricDataTypeUnit = ''
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
