<template>
  <div>
    <b-modal id="bv-entity" size="xl" :title="method+' Biometric Data'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <div class="row">
        <div class="col">
          <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
            <b-form-group
              id="input-group-patient"
              label="Patient:"
              label-for="input-patient"
            >
              <b-input-group>
                <b-form-input
                  id="input-patient"
                  v-model="form.patient"
                  type="text"
                  placeholder="Enter Patient"
                  required
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-info"><b-icon icon="search" @click="selectPatient"></b-icon></b-button>
                </b-input-group-append>
                <b-input-group-append>
                  <b-button variant="outline-danger"><b-icon icon="backspace" @click="unselectPatient"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <div v-if="togglePSelect" class="pt-3">
                <b-table id="my-patients-table" :items="selectablePEntity" :fields="selectablePFields" small hover responsive selectable select-mode="single" @row-selected="selectableEntityPClicked" :current-page="currentPatientPage" :per-page="perPage">
                  <template #cell(selected)="data">
                    <template v-if="data.item.id == form.patientId">
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
                  v-model="currentPatientPage"
                  :total-rows="patientRows"
                  :per-page="perPage"
                  aria-controls="my-patients-table"
                  align="center"
                ></b-pagination>
              </div>
            </b-form-group>
            <b-form-group
              id="input-group-biometricdatatype"
              label="Biometric Data Type:"
              label-for="input-biometricdatatype"
            >
              <b-input-group>
                <b-form-input
                  id="input-biometricdatatype"
                  v-model="form.biometricTypeName"
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
                    <template v-if="data.item.id == form.biometricTypeId">
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
            <b-form-group id="input-group-value" label="Value:" label-for="input-value">
              <b-input-group :append="form.biometricTypeUnit">
                <b-form-input
                  id="input-value"
                  v-model="form.value"
                  placeholder="X"
                  required
                  type="number"
                  step="0.01"
                  @change="parseFloat(form.value).toFixed(2)"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group  id="input-group-notes" label="Notes:" label-for="input-notes">
              <b-form-textarea
                id="input-notes"
                v-model="form.notes"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        patient: '',
        patientId: '',
        biometricTypeId: '',
        biometricTypeName: '',
        biometricTypeUnit: '',
        value: '',
        notes: ''
      },
      show: true,

      perPage: 4,

      currentPatientPage: 1,
      selectablePEntity: [],
      selectablePFields: [],
      togglePSelect: false,

      currentBioDataPage: 1,
      selectableTEntity: [],
      selectableTFields: [],
      toggleTSelect: false,
    }
  },
  computed: {
    patientRows() {
      return this.selectablePEntity.length
    },
    bioDataRows() {
      return this.selectableTEntity.length
    }
  },
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  methods: {
    selectableEntityPClicked(record){
      if (record[0]) {
        this.form.patient = record[0].name
        this.form.patientId = record[0].id
      }
    },
    selectableEntityTClicked(record){
      if (record[0]) {
        this.form.biometricTypeId = record[0].id
        this.form.biometricTypeName = record[0].name
        this.form.biometricTypeUnit = record[0].unit + ' ' + record[0].unit_name
      }
    },
    selectPatient(){
      this.togglePSelect = !this.togglePSelect;
    },
    unselectPatient(){
      this.form.patient = ""
      this.form.patientId = ""
    },
    selectBiometricType(){
      this.toggleTSelect = !this.toggleTSelect;
    },
    unselectBiometricType(){
      this.form.biometricTypeId = ""
      this.form.biometricTypeName = ""
      this.form.biometricTypeUnit = ""
    },
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      this.$emit("onSubmit",this.form, this.method)
    },
  },
  mounted() {
    //Load patients
    this.$axios
      .$get('/api/patients')
      .then(patients => {
        this.selectablePEntity = patients.entities
        this.selectablePFields = patients.columns
        this.toggleSelect = true
        this.selectablePFields.unshift("selected")
      })
      .catch((err)=>{
        console.log(err);
      });

      //Load Biometric Data Types
      this.$axios
      .$get('/api/biometricdatatypes')
      .then(biometricdatatypes => {
        this.selectableTEntity = biometricdatatypes.entities
        this.selectableTFields = biometricdatatypes.columns
        this.toggleTSelect = true
        this.selectableTFields.unshift("selected")
      })
      .catch((err)=>{
        console.log(err);
      });
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
        this.togglePSelect = false
        this.toggleTSelect = false
        if (this.method == 'edit') {
          this.form.patient = this.entity.patientName
          this.form.patientId = this.entity.patientId
          this.form.biometricTypeId = this.entity.biometricTypeId;
          this.form.biometricTypeName = this.entity.biometricDataTypeName;
          let biometricType = this.selectableTEntity.filter((e) => e.id == this.entity.biometricTypeId)[0];
          this.form.biometricTypeUnit = biometricType.unit + ' ' + biometricType.unit_name
          this.form.notes = this.entity.notes
          //this.form.biometricTypeUnit = this.entity.
          this.form.value = this.entity.value;
        }else {
          this.form.patient = ""
          this.form.biometricTypeId = ""
          this.form.biometricTypeName = ""
          this.form.biometricTypeUnit = ""
          this.form.value = ""
          this.form.patientId = ""
          this.form.notes = ""
        }
        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style scoped>

</style>
