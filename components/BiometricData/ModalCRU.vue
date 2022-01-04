<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Biometric Data'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <div class="row">
        <div class="col">
          <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
            <b-form-group
              v-if="fieldProperties('patientId').visible"
              id="input-group-patient"
              label="Patient:"
              label-for="input-patient"
              label-class="font-weight-bold"
            >
              <b-input-group>
                <b-form-input
                  id="input-patient"
                  :value="form.patientName"
                  type="text"
                  placeholder="Select the Patient"
                  disabled
                  :class="isSubmitting && !patientState ? 'border border-danger text-danger' : ''"
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-info" @click="selectPatient"><b-icon icon="search"></b-icon></b-button>
                </b-input-group-append>
                <b-input-group-append>
                  <b-button variant="outline-danger" @click="unselectPatient"><b-icon icon="backspace"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <b-card v-show="togglePSelect" class="mt-2">
                <b-form-group
                  label-for="filter-patients"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-patients"
                      v-model="filterPatient"
                      type="search"
                      placeholder="Type to Search"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filterPatient" @click="filterPatient = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
                <b-table id="my-patients-table" :busy="isBusy" :items="selectablePEntity" :fields="selectablePFields" small hover responsive selectable select-mode="single" @row-selected="selectableEntityPClicked" :current-page="currentPatientPage" :per-page="perPage" :filter="filterPatient" show-empty>
                  <template #empty="scope">
                    <h6 class="text-center">{{ scope.emptyText }}</h6>
                  </template>
                  <template #emptyfiltered="scope">
                    <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
                  </template>
                  <template #cell(selected)="data">
                    <template v-if="data.item.id === form.patientId">
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
            </b-card>
            </b-form-group>
            <b-form-group
              id="input-group-biometricdatatype"
              label="Biometric Data Type:"
              label-for="input-biometricdatatype"
              label-class="font-weight-bold"
            >
              <b-input-group>
                <b-form-input
                  id="input-biometricdatatype"
                  :value="form.biometricDataTypeName"
                  type="text"
                  placeholder="Select the Biometric Data Type"
                  disabled
                  :class="isSubmitting && !biometricDataTypeState ? 'border border-danger text-danger' : ''"
                ></b-form-input>
                <b-input-group-append v-if="fieldProperties('biometricTypeId').editable">
                  <b-button variant="outline-info" @click="selectBiometricType"><b-icon icon="search"></b-icon></b-button>
                </b-input-group-append>
                <b-input-group-append v-if="fieldProperties('biometricTypeId').editable">
                  <b-button variant="outline-danger" @click="unselectBiometricType"><b-icon icon="backspace"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <b-card v-show="toggleTSelect" class="mt-2">
                <b-form-group
                  label-for="filter-types"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-types"
                      v-model="filterTypes"
                      type="search"
                      placeholder="Type to Search"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filterTypes" @click="filterTypes = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
                <b-table  id="my-bioData-table" :items="selectableTEntity" :fields="selectableTFields" small hover responsive selectable select-mode="single" @row-selected="selectableEntityTClicked" :current-page="currentBioDataPage" :per-page="perPage" :filter="filterTypes" show-empty>
                  <template #empty="scope">
                    <h6 class="text-center">{{ scope.emptyText }}</h6>
                  </template>
                  <template #emptyfiltered="scope">
                    <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
                  </template>
                  <template #cell(selected)="data">
                    <template v-if="data.item.id === form.biometricTypeId">
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
              </b-card>
            </b-form-group>
            <div class="d-flex flex-row flex-wrap">
              <div v-if="fieldProperties('value').visible" class="flex-grow-1 px-1">
                <b-form-group id="input-group-value" label="Value:" label-for="input-value" label-class="font-weight-bold">
                  <b-input-group :prepend="form.valueUnit">
                    <b-form-input
                      id="input-value"
                      v-model="form.value"
                      placeholder="X"
                      type="number"
                      step="0.01"
                      @change="parseFloat(form.value).toFixed(2)"
                      :disabled="!fieldProperties('value').editable"
                      :state="valueState"
                      aria-describedby="input-value-feedback"
                    ></b-form-input>
                    <b-form-invalid-feedback id="input-value-feedback">
                      {{valueErr}}
                    </b-form-invalid-feedback>
                  </b-input-group>
                </b-form-group>
              </div>
              <div v-if="fieldProperties('biometricDataIssueId').visible" class="flex-grow-1 px-1">
                <b-form-group id="input-group-issue" label="Automatic Classification:" label-for="input-issue" label-class="font-weight-bold">
                  <b-form-input
                    id="input-issue"
                    :value="form.biometricDataIssueName ? form.biometricDataIssueName : 'N/A'"
                    :disabled="!fieldProperties('biometricDataIssueId').editable"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <b-form-group id="input-group-notes" label="Notes:" label-for="input-notes" label-class="font-weight-bold">
              <b-form-textarea
                id="input-notes"
                v-model="form.notes"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
                :disabled="!fieldProperties('notes').editable"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group
              id="input-group-source"
              label="Source:"
              label-for="input-source"
              label-class="font-weight-bold"
              v-if="fieldProperties('source').visible"
            >
              <b-form-select
                id="input-source"
                v-model="form.source"
                :disabled="!fieldProperties('source').editable"
                :options="sourceValues"
                :state="sourceState"
                aria-describedby="input-source-feedback"
              />
              <b-form-invalid-feedback id="input-source-feedback">
                {{sourceErr}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="input-group-createdAt" label="Created At:" label-for="input-createdAt" label-class="font-weight-bold" class="">
              <div class="d-flex flex-row flex-wrap">
                <div class="flex-grow-1 px-1 mb-2">
                  <b-form-datepicker
                    id="input-createdAt"
                    v-model="form.created_at"
                    :disabled="!fieldProperties('created_at').editable"
                    :state="createdAtState"
                    hide-header
                    aria-describedby="input-created-at-feedback"
                  />
                  <b-form-invalid-feedback id="input-created-at-feedback">
                    {{createdAtErr}}
                  </b-form-invalid-feedback>
                </div>
                <div class="flex-grow-1 px-1 mb-2">
                  <b-form-timepicker
                    id="timepicker-createdAt"
                    v-model="form.created_at_time"
                    :disabled="!fieldProperties('created_at').editable"
                    :state="createdAtState"
                  />
                </div>
              </div>
            </b-form-group>
              <b-button type="submit" variant="primary" v-if="method == 'create' || method == 'edit'">Submit</b-button>
              <b-button type="reset" variant="danger" v-if="method == 'create' || method == 'edit'">Reset</b-button>
              <b-button variant="info" class="float-right" @click="openImportFile" v-if="method=='create'">
                <b-icon icon="file-earmark-excel" aria-hidden="true"></b-icon>
                Import
              </b-button>
              <b-button-group class="float-right mr-2" v-if="method=='create'">
                <b-button href="importBiometricDataModel.csv" target="_blank">
                  <b-icon variant="warning" icon="file-earmark-excel" aria-hidden="true"></b-icon>
                  Example
                </b-button>
              </b-button-group>
          </b-form>
          <div v-else class="d-flex align-items-center justify-content-center">
            <b-spinner class="m-5" style="width: 3rem; height: 3rem;" label="Loading" />
          </div>
          <b-form-file v-if="method=='create'" id="importFileInput" class="d-none" accept=".csv" v-model="importFile"></b-form-file>
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
        id: '',
        biometricTypeId: '',
        value: '',
        notes: '',
        patientId: '',
        created_at: '',
        created_at_time: '',
        created_by: '',
        patientName: '',
        healthNo: '',
        biometricDataTypeName: '',
        min: '',
        max: '',
        valueUnit: '',
        source: '',
        biometricDataIssueId: '',
        biometricDataIssueName: '',
      },
      show: false,

      valueErr: '',
      sourceErr: '',
      createdAtErr: '',

      perPage: 4,
      currentPatientPage: 1,
      selectablePEntity: [],
      selectablePFields: [],
      togglePSelect: false,

      currentBioDataPage: 1,
      selectableTEntity: [],
      selectableTFields: [],
      toggleTSelect: false,

      clone: {},

      isSubmitting: false,

      sourceValues: [
        { value: 'Exam', text: 'Exam' },
        { value: 'Sensor', text: 'Sensor' },
        { value: 'Wearable', text: 'Wearable' },
      ],

      importFile: null,
      isBusy: false,

      filterPatient: null,
      filterTypes: null
    }
  },
  computed: {
    patientRows() {
      return this.selectablePEntity.length
    },
    bioDataRows() {
      return this.selectableTEntity.length
    },
    patientState(){
      if (!this.fieldProperties('patientId').editable) return null
      if (this.$auth.user.scope === "Patient")
        return true
      if ((this.form.patientId == null || this.form.patientId === '')) {
        return this.isSubmitting ? false : null
      }
      return true
    },
    biometricDataTypeState(){
      if ((this.form.biometricTypeId == null || this.form.biometricTypeId === '')) {
        return this.isSubmitting ? false : null
      }
      return true
    },
    valueState() {
      if (!this.fieldProperties('value').editable) return null
      if ((this.form.value == null || this.form.value === '')) {
        this.valueErr = "Value is required"
        return this.isSubmitting ? false : null
      }
      if (!this.biometricDataTypeState) {
        this.valueErr = "Select a Biometric Data Type"
        return false
      }
      if (this.form.value < this.form.min) {
        this.valueErr = "Value must be higher or equal then " + this.form.min;
        return false
      }
      if (this.form.value >= this.form.max) {
        this.valueErr = "Value must be lower then " + this.form.max;
        return false
      }
      return true
    },
    sourceState() {
      if (!this.fieldProperties('source').editable) return null
      if (this.form.source == null || this.form.source === '') {
        this.sourceErr = "Source is required"
        return this.isSubmitting ? false : null
      }
      if (this.form.source !== 'Exam' && this.form.source !== 'Sensor' && this.form.source !== 'Wearable') {
        this.sourceErr = "Source must be \"Exam\" or \"Sensor\" or \"Wearable\""
        return false
      }
      return true
    },
    createdAtState() {
      if (!this.fieldProperties('created_at').editable) return null
      if (this.form.created_at == null || this.form.created_at === '') {
        this.createdAtErr = "Created At is required"
        return this.isSubmitting ? false : null
      }
      if (this.getDateAndTimeSum(new Date(this.form.created_at), this.form.created_at_time) >= new Date()) {
        this.createdAtErr = "Created At date must be lower than the present date"
        return false
      }
      return true
    },
    isFormValid() {
      return this.patientState && this.biometricDataTypeState && this.valueState && this.sourceState && this.createdAtState
    }
  },
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  methods: {
    getDateAndTimeSum(date, timeString) {
      if (date == null || timeString == null || timeString === '') return ''
      let timePieces = timeString.split(':');

      if (timePieces.length !== 3) return ''

      date.setHours(timePieces[0], timePieces[1], timePieces[2])

      return date
    },
    openImportFile(){
      document.getElementById('importFileInput').click()
    },
    showErrorMessage(err) {
      if (err.response) {
        this.$toast.error('ERROR: ' + err.response.data).goAway(3000);
      }
      else {
        this.$toast.error(err).goAway(3000);
      }
    },
    selectableEntityPClicked(record){
      if (record[0]) {
        this.form.patientName = record[0].name
        this.form.patientId = record[0].id
        this.togglePSelect = false
      }
    },
    selectableEntityTClicked(record){
      if (record[0]) {
        this.form.biometricTypeId = record[0].id
        this.form.biometricDataTypeName = record[0].name
        this.form.valueUnit = record[0].unit_name
        this.form.max = record[0].max
        this.form.min = record[0].min
        this.toggleTSelect = false
      }
    },
    selectPatient(){
      this.togglePSelect = !this.togglePSelect;
    },
    unselectPatient(){
      this.form.patientName = ""
      this.form.patientId = ""
    },
    selectBiometricType(){
      this.toggleTSelect = !this.toggleTSelect;
    },
    unselectBiometricType(){
      this.form.biometricTypeId = ""
      this.form.biometricDataTypeName = ""
      this.form.valueUnit = ""
    },
    onReset(){
      this.$emit("onReset")
    },
    resetBtnPressed() {
      this.isSubmitting = false
      this.form = Object.assign({}, this.clone)
    },
    onSubmit(){
      this.isSubmitting = true
      if (!this.isFormValid) {
        this.showErrorMessage("Fix the errors before submitting")
        return;
      }
      this.$emit("onSubmit",this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'biometricTypeId') return { visible: true, editable: true }
          if (fieldName === 'value') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          if (fieldName === 'patientId') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: true }
          if (fieldName === 'created_at') return { visible: true, editable: true }
          if (fieldName === 'source') return { visible: true, editable: true }
          if (fieldName === 'biometricDataIssueId') return { visible: true, editable: false }
          break;
        case 'watch':
          if (fieldName === 'biometricTypeId') return { visible: true, editable: false }
          if (fieldName === 'value') return { visible: true, editable: false }
          if (fieldName === 'notes') return { visible: true, editable: false }
          if (fieldName === 'patientId') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: false }
          if (fieldName === 'created_at') return { visible: true, editable: false }
          if (fieldName === 'source') return { visible: true, editable: false }
          if (fieldName === 'biometricDataIssueId') return { visible: true, editable: false }
          break;
        case 'create':
          if (fieldName === 'biometricTypeId') return { visible: true, editable: true }
          if (fieldName === 'value') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          if (fieldName === 'patientId') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: true }
          if (fieldName === 'created_at') return { visible: true, editable: true }
          if (fieldName === 'source') return { visible: true, editable: true }
          if (fieldName === 'biometricDataIssueId') return { visible: false, editable: false }
          break;
        default: return { visible: true, editable: true }
      }
    },
    formatDate(dateStr) {
      if (dateStr == null || dateStr === '') return ''
      let date = new Date(dateStr)
      return date.toLocaleString('pt-PT')
    },
    formatTime(dateStr) {
      if (dateStr == null || dateStr === '') return ''
      let date = new Date(dateStr)
      return date.toTimeString().split(' ')[0]
    }
  },
  mounted() {
    //Load patients
    if (this.$auth.user.scope === 'HealthcareProfessional')
      this.$axios
        .$get('/api/patients')
        .then(patients => {
          this.selectablePEntity = patients
          this.selectablePFields = [
            {key: "selected", sortable: true},
            {key: "email", sortable: true},
            {key: "name", sortable: true},
            {key: "gender", sortable: true},
            {key: "healthNo", sortable: true},
          ]
        })
        .catch((err)=>{
          this.showErrorMessage(err);
        });

    //Load Biometric Data Types
    this.$axios
      .$get('/api/biometricdatatypes')
      .then(biometricdatatypes => {
        this.selectableTEntity = biometricdatatypes
        this.selectableTFields = [
          {key: "selected", sortable: true},
          {key: "name", sortable: true},
          {key: "unit", sortable: true},
          {key: "unit_name", sortable: true},
        ]
      })
      .catch((err)=>{
        this.showErrorMessage(err);
      });
  },
  watch: {
    importFile(newVal){
      let form = {file: newVal}
      this.$emit("onSubmit",form, "importFile")
    },
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
        this.togglePSelect = false;
        this.toggleTSelect = false;
        this.show = false
        if (this.method === 'edit' || this.method === 'watch') {
          this.$axios
            .$get('/api/biometricdatas/' + this.entity.id)
            .then(biometricData => {
              this.form.id = biometricData.id;
              this.form.biometricTypeId = biometricData.biometricTypeId;
              this.form.value =  biometricData.value;
              this.form.notes = biometricData.notes;
              this.form.patientId = biometricData.patientId;
              this.form.created_at = biometricData.created_at;
              this.form.created_at_time = this.formatTime(biometricData.created_at);
              this.form.created_by = biometricData.created_by;
              this.form.patientName = biometricData.patientName;
              this.form.healthNo = biometricData.healthNo;
              this.form.biometricDataTypeName = biometricData.biometricDataTypeName;
              this.form.max = biometricData.biometricDataTypeMax;
              this.form.min = biometricData.biometricDataTypeMin;
              this.form.valueUnit = biometricData.valueUnit;
              this.form.source = biometricData.source;
              this.form.biometricDataIssueId = biometricData.biometricDataIssueId;
              this.form.biometricDataIssueName = biometricData.biometricDataIssueName;

              let types = this.selectableTEntity.filter((e) => e.id === biometricData.biometricTypeId)
              if (types != null && types.length > 0) {
                let biometricType = types[0];
                this.form.biometricTypeUnit = biometricType.unit_name;
              }

              this.clone = Object.assign({}, this.form)
              this.show = true
            })
            .catch((err) => {
              this.showErrorMessage(err)
              this.$refs.bvEntity.hide()
              this.show = true
            })
        }
        else {
          this.form.id = '';
          this.form.biometricTypeId = '';
          this.form.value = '';
          this.form.notes = '';
          this.form.patientId = '';
          this.form.created_at = new Date();
          this.form.created_by = '';
          this.form.patientName = '';
          this.form.healthNo = '';
          this.form.biometricDataTypeName = '';
          this.form.valueUnit = '';
          this.form.source = 'Exam';
          this.form.biometricDataIssueId = '';
          this.form.biometricDataIssueName = '';
          this.form.created_at_time = this.formatTime(new Date());

          this.clone = Object.assign({}, this.form)
          this.show = true
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style scoped>

</style>
