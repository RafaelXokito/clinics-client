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
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-min" label="Min:" label-for="input-min" label-class="font-weight-bold">
              <b-input-group :append="form.biometricDataTypeUnitName">
                <b-form-input
                  id="input-min"
                  v-model="form.min"
                  :placeholder="form.biometricDataTypeMin ? '≥ ' + form.biometricDataTypeMin : 'X'"
                  required
                  type="number"
                  step="0.01"
                  @change="parseFloat(form.min).toFixed(2)"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group id="input-group-max" label="Max:" label-for="input-max" label-class="font-weight-bold">
              <b-input-group :append="form.biometricDataTypeUnitName">
                <b-form-input
                  id="input-max"
                  v-model="form.max"
                  :placeholder="form.biometricDataTypeMax ? '≤ ' + form.biometricDataTypeMax : 'X'"
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
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button variant="outline-info" @click="selectBiometricType"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                    <b-input-group-append>
                      <b-button variant="outline-danger" @click="unselectBiometricType"><b-icon icon="backspace"></b-icon></b-button>
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
        biometricDataTypeUnitName: ''
      },
      show: false,

      perPage: 4,

      currentBioDataPage: 1,
      selectableTEntity: [],
      selectableTFields: [],
      toggleTSelect: false,

      issues: [],
      issueFields: ['name', 'min', 'max'],

      clone: {},
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
    }
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
      }
    },
    onReset(){
      this.toggleTSelect = false
      this.issues = []
      this.$emit("onReset")
    },
    onSubmit(){
      this.toggleTSelect = false
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
