<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Biometric Data Issue'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-tabs content-class="p-2 pt-3">
          <b-tab title="Biometric Data Issue" active>
            <b-form-group id="input-group-2" label="Name:" label-for="input-2" label-class="font-weight-bold">
              <b-form-input
                id="input-2"
                v-model="form.name"
                placeholder="Enter Name"
                required
                :state="nameState"
                aria-describedby="input-name-feedback"
              ></b-form-input>
              <b-form-invalid-feedback id="input-name-feedback">
                {{nameErr}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group id="input-group-min" label="Min (inclusive):" label-for="input-min" label-class="font-weight-bold">
              <b-input-group :prepend="form.biometricDataTypeUnitName">
                <b-form-input
                  id="input-min"
                  v-model="form.min"
                  :placeholder="form.biometricDataTypeMin == null ? 'X' : '≥ ' + form.biometricDataTypeMin"
                  required
                  type="number"
                  step="0.01"
                  @change="parseFloat(form.min).toFixed(2)"
                  :state="minState"
                  aria-describedby="input-min-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="input-min-feedback">
                  {{minErr}}
                </b-form-invalid-feedback>
              </b-input-group>
            </b-form-group>
            <b-form-group id="input-group-max" label="Max (exclusive):" label-for="input-max" label-class="font-weight-bold">
              <b-input-group :prepend="form.biometricDataTypeUnitName">
                <b-form-input
                  id="input-max"
                  v-model="form.max"
                  :placeholder="form.biometricDataTypeMax == null ? 'X' : '≤ ' + form.biometricDataTypeMax"
                  required
                  type="number"
                  step="0.01"
                  @change="parseFloat(form.max).toFixed(2)"
                  :state="maxState"
                  aria-describedby="input-max-feedback"
                ></b-form-input>
                <b-form-invalid-feedback id="input-max-feedback">
                  {{maxErr}}
                </b-form-invalid-feedback>
              </b-input-group>
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
                      v-model="form.biometricDataTypeName"
                      type="text"
                      placeholder="Enter Type"
                      required
                      disabled
                      :class="!biometricDataTypeState ? 'border border-danger text-danger' : ''"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button variant="outline-info" @click="selectBiometricType"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                    <b-input-group-append>
                      <b-button variant="outline-danger" @click="unselectBiometricType"><b-icon icon="backspace"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  <b-card v-if="toggleTSelect" class="mt-2">
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
                    </b-card>
            </b-form-group>
          </b-tab>
          <b-tab v-if="hasIssues" :title="form.biometricDataTypeName">
            <b-form-group
              id="input-group-biometricdatatypeissues"
              :label="'Biometric Data Issues:'"
              label-for="input-biometricdatatypeissues"
              label-class="font-weight-bold"
            >
              <b-table :items="issues" :fields="issueFields" />
            </b-form-group>
          </b-tab>
        </b-tabs>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <div v-else class="d-flex align-items-center justify-content-center">
        <b-spinner class="m-5" style="width: 3rem; height: 3rem;" label="Loading" />
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
        name: '',
        min: '',
        max: '',
        biometricDataTypeId: '',
        biometricDataTypeName: '',
        biometricDataTypeUnitName: '',
        biometricDataTypeMax: '',
        biometricDataTypeMin: '',
      },
      show: false,

      perPage: 4,

      currentBioDataPage: 1,
      selectableTEntity: [],
      selectableTFields: [],
      toggleTSelect: false,

      nameErr: '',
      minErr: '',
      maxErr: '',

      issues: [],
      issueFields: ['name', 'min', 'max'],

      clone: {},

      filterTypes: null
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
    },
    hasIssues() {
      return this.issues != null && this.issues.length > 0;
    },
    biometricDataTypeState(){
      if ((this.form.biometricDataTypeId == null || this.form.biometricDataTypeId === '')) {
        return false
      }
      return true
    },
    nameState() {
      if (this.form.name == null || this.form.name.trim() === '') {
        this.nameErr = "Name is required"
        return false
      }
      return true
    },
    minState() {
      if (!this.biometricDataTypeState) {
        this.minErr = "Select a Biometric Data Type"
        return false
      }

      if (this.form.min === '') {
        this.minErr = "Min is required"
        return false
      }

      if (this.form.min < this.form.biometricDataTypeMin || this.form.min > this.form.biometricDataTypeMax) {
        this.minErr = "Min must be in bounds [" + this.form.biometricDataTypeMin + ", " + this.form.biometricDataTypeMax + "]"
        return false
      }

      if (this.form.max !== '' && this.form.min >= this.form.max) {
        this.minErr = "Min must be lower than max"
        return false
      }
      return true
    },
    maxState() {
      if (!this.biometricDataTypeState) {
        this.maxErr = "Select a Biometric Data Type"
        return false
      }

      if (this.form.max === '') {
        this.maxErr = "Max is required"
        return false
      }

      if (this.form.max < this.form.biometricDataTypeMin || this.form.max > this.form.biometricDataTypeMax) {
        this.maxErr = "Max must be in bounds [" + this.form.biometricDataTypeMin + ", " + this.form.biometricDataTypeMax + "]"
        return false
      }

      if (this.form.min !== '' && this.form.min >= this.form.max) {
        this.maxErr = "Max must be higher than min"
        return false
      }
      return true
    },
    isFormValid() {
      return this.biometricDataTypeState && this.nameState && this.minState && this.maxState
    },
  },
  mounted() {
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
  methods: {
    showErrorMessage(err) {
      if (err.response) {
        this.$toast.error('ERROR: ' + err.response.data).goAway(3000);
      }
      else {
        this.$toast.error(err).goAway(3000);
      }
    },
    selectableEntityTClicked(record){
      if (record[0]) {
        this.form.biometricDataTypeId = record[0].id
        this.form.biometricDataTypeName = record[0].name
        this.form.biometricDataTypeUnitName = record[0].unit_name
        this.form.biometricDataTypeMax = record[0].max
        this.form.biometricDataTypeMin = record[0].min

        //GET CURRENT ISSUES OF THAT BIO TYPE
        this.issues = []
        this.$axios
          .$get('/api/biometricdatatypes/' + record[0].id + '/biometricdataissues')
          .then(biometricDataIssues => {
            this.issues = biometricDataIssues;
          })
          .catch((err) => {
            this.showErrorMessage(err);
          })
        this.toggleTSelect = false
      }
    },
    onReset(){
      this.toggleTSelect = false
      this.issues = []
      this.$emit("onReset")
    },
    onSubmit(){
      this.toggleTSelect = false

      if (!this.isFormValid) {
        this.showErrorMessage("Fix the errors before submitting")
        return;
      }

      this.$emit("onSubmit",this.form, this.method)
    },
    selectBiometricType(){
      this.toggleTSelect = !this.toggleTSelect;
    },
    unselectBiometricType(){
      this.issues = []
      this.form.biometricDataTypeId = ""
      this.form.biometricDataTypeName = ""
      this.form.biometricDataTypeUnit = ""
      this.form.biometricDataTypeMax = ""
      this.form.biometricDataTypeMin = ""
    },
    resetBtnPressed() {
      this.form = Object.assign({}, this.clone)
      this.issues = Object.assign([], this.cloneIssues)
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
      this.toggleTSelect = false;

      if (newEntity != null) {
        this.show = false
        if (this.method === 'edit') {
          this.$axios
            .$get('/api/biometricdataissues/' + this.entity.id)
            .then(biometricData => {

              this.form.id = biometricData.id;
              this.form.name = biometricData.name;
              this.form.min = biometricData.min;
              this.form.max = biometricData.max;
              this.form.biometricDataTypeId = biometricData.biometricDataTypeId;
              this.form.biometricDataTypeName = biometricData.biometricDataTypeName;

              let biometricType = this.selectableTEntity.filter((e) => e.id === biometricData.biometricDataTypeId);
              if (biometricType != null && biometricType.length > 0) {
                this.form.biometricDataTypeUnitName = biometricType[0].unit_name;
                this.form.biometricDataTypeMax = biometricType[0].max;
                this.form.biometricDataTypeMin = biometricType[0].min;
              }

              this.clone = Object.assign({}, this.form)
              this.show = true

              //GET CURRENT ISSUES OF THAT BIO TYPE
              this.issues = []
              this.$axios
                .$get('/api/biometricdatatypes/' + biometricData.biometricDataTypeId + '/biometricdataissues')
                .then(biometricDataIssues => {
                  this.issues = biometricDataIssues;

                  this.cloneIssues = Object.assign([], this.issues)
                })
                .catch((err) => {
                  this.showErrorMessage(err);
                })
            })
            .catch((err) => {
              this.showErrorMessage(err);
              this.$refs.bvEntity.hide()
            })
        }
        else {
          this.form.id = ''
          this.form.name = ''
          this.form.min = ''
          this.form.max = ''
          this.form.biometricDataTypeId = ''
          this.form.biometricDataTypeName = ''
          this.form.biometricDataTypeUnitName = ''
          this.form.biometricDataTypeMax = '';
          this.form.biometricDataTypeMin = '';
          this.issues = []

          this.clone = Object.assign({}, this.form)
          this.cloneIssues = []
          this.show = true
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
