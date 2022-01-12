<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Patient '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-tabs content-class="p-2 pt-3">
          <b-tab title="Patient" active>
            <b-form-group
              id="input-group-id"
              label="Id:"
              label-for="input-id"
              label-class="font-weight-bold"
              v-if="fieldProperties('id').visible"
            >
              <b-form-input
                id="input-id"
                v-model="form.id"
                :disabled="!fieldProperties('id').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-email"
              label="E-mail:"
              label-for="input-email"
              label-class="font-weight-bold"
              v-if="fieldProperties('email').visible"
            >
              <b-form-input
                id="input-email"
                aria-describedby="input-email-feedback"
                v-model="form.email"
                :state="emailState"
                :disabled="!fieldProperties('email').editable"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="input-email-feedback">
                {{emailError}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="input-group-password"
              label="Password:"
              label-for="input-password"
              label-class="font-weight-bold"
              v-if="fieldProperties('password').visible"
            >
              <b-form-input
                id="input-password"
                aria-describedby="input-password-feedback"
                v-model="form.password"
                type="password"
                name="password"
                autocomplete="on"
                :state="passwordState"
                :disabled="!fieldProperties('password').editable"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="input-password-feedback">
                {{passwordError}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="input-group-name"
              label="Name:"
              label-for="input-name"
              label-class="font-weight-bold"
              v-if="fieldProperties('name').visible"
            >
              <b-form-input
                id="input-name"
                aria-describedby="input-name-feedback"
                v-model="form.name"
                :state="nameState"
                :disabled="!fieldProperties('name').editable"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="input-name-feedback">
                {{nameError}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="input-group-gender"
              label="Gender:"
              label-for="input-gender"
              label-class="font-weight-bold"
              v-if="fieldProperties('gender').visible"
            >
              <b-form-select
                id="input-gender"
                aria-describedby="input-gender-feedback"
                v-model="form.gender"
                :state="genderState"
                :disabled="!fieldProperties('gender').editable"
                :options="genderValues"
              />
              <b-form-invalid-feedback id="input-gender-feedback">
                {{genderError}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="input-group-birthdate"
              label="Date of Birth:"
              label-for="input-birthdate"
              label-class="font-weight-bold"
            >
              <b-form-datepicker
                id="input-birthdate"
                v-model="form.birthDate"
                :disabled="!fieldProperties('birthdate').editable"
                :state="birthdateState"
                show-decade-nav
                hide-header
                aria-describedby="input-birthdate-feedback"
              />
              <b-form-invalid-feedback id="input-healthNo-feedback">
                {{birthdateErr}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="input-group-healthNo"
              label="Health Number:"
              label-for="input-healthNo"
              label-class="font-weight-bold"
              v-if="fieldProperties('healthNo').visible"
            >
              <b-form-input
                id="input-healthNo"
                aria-describedby="input-healthNo-feedback"
                v-model="form.healthNo"
                :state="healthNoState"
                :disabled="!fieldProperties('healthNo').editable"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="input-healthNo-feedback">
                {{healthNoError}}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-tab>

          <b-tab id="biometric-datas-table" v-if="form.biometricDatas && form.biometricDatas.length > 0" title="Biometric Data">
            <b-form-group label-for="filter-bio-datas" class="mb-0">
              <b-input-group size="sm">
                <b-form-input
                  id="filter-bio-datas"
                  v-model="filterBioData"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filterBioData" @click="filterBioData = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-table striped hover responsive :items="form.biometricDatas" :fields="fieldsBiometricData" :filter="filterBioData" show-empty>
              <template #empty="scope">
                <h6 class="text-center">{{ scope.emptyText }}</h6>
              </template>
              <template #emptyfiltered="scope">
                <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
              </template>
              <template #cell(created_at)="data">
                {{formatDate(data.item.created_at)}}
              </template>
            </b-table>
            <b-pagination
              v-if="form.biometricDatas.length > perPage"
              v-model="currentPageBiometricDatas"
              :total-rows="dataRowsBiometricDatas"
              :per-page="perPage"
              aria-controls="biometric-datas-table"
              align="center"
            ></b-pagination>
          </b-tab>

          <b-tab id="observations-table" title="Observations" v-if="form.observations && form.observations.length > 0">
            <b-form-group label-for="filter-observations" class="mb-0">
              <b-input-group size="sm">
                <b-form-input
                  id="filter-observations"
                  v-model="filterObservations"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filterObservations" @click="filterObservations = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-table striped hover responsive :items="form.observations" :fields="fieldsObservations" :filter="filterObservations" show-empty>
              <template #empty="scope">
                <h6 class="text-center">{{ scope.emptyText }}</h6>
              </template>
              <template #emptyfiltered="scope">
                <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
              </template>
              <template #cell(created_at)="data">
                {{formatDate(data.item.created_at)}}
              </template>
              <template #cell(Documents)="data">
                {{data.item.nDocuments}}
              </template>
              <template #cell(Details)="data">
                <b-button
                  variant="warning"
                  @click="data.toggleDetails"
                  size="sm"
                  class="mr-2"
                >
                  <b-icon-arrows-angle-contract v-if="data.detailsShowing"></b-icon-arrows-angle-contract>
                  <b-icon-arrows-angle-expand v-else></b-icon-arrows-angle-expand>
                </b-button>
              </template>
              <template #row-details="data">
                <b-card>
                  <b-form-group
                    id="input-group-notes"
                    label="Notes:"
                    label-for="input-notes"
                  >
                    <b-form-textarea
                      id="input-notes"
                      :value="data.item.notes"
                      disabled
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                  </b-form-group>
                  <div v-if="data.item.prescription != null">
                    <hr>
                    <h5 class="text-center">Prescription</h5>
                    <b-form-group
                      id="input-group-start-date"
                      label="Start Date:"
                      label-for="input-start-date"
                    >
                      <b-form-input
                        id="input-start-date"
                        :value="formatDate(data.item.prescription.start_date)"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      id="input-group-end-date"
                      label="End Date:"
                      label-for="input-end-date"
                    >
                      <b-form-input
                        id="input-end-date"
                        :value="formatDate(data.item.prescription.end_date)"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      id="input-group-notes-prescription"
                      label="Notes:"
                      label-for="input-notes-prescription"
                    >
                      <b-form-input
                        id="input-notes-prescription"
                        :value="data.item.prescription.notes"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>

                </b-card>
              </template>
            </b-table>
            <b-pagination
              v-if="form.observations.length > perPage"
              v-model="currentPageObservations"
              :total-rows="dataRowsObservations"
              :per-page="perPage"
              aria-controls="observations-table"
              align="center"
            ></b-pagination>
          </b-tab>
        </b-tabs>

        <b-button type="submit" variant="primary">{{this.method === 'create' ? 'Create' : 'Save'}}</b-button>
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
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  data() {
    return {
      form: {
        id: null,
        email: null,
        password: null,
        name: null,
        gender: null,
        biometricDatas: [],
        observations: [],
        created_by: null,
        healthNo: null,
        birthDate: null
      },
      isSubmitting: false,

      healthNoError: '',
      genderError: '',
      nameError: '',
      passwordError: '',
      emailError: '',
      birthdateErr: '',

      show: false,
      fieldsBiometricData: [
        {key: "value", sortable: true},
        {key: "valueUnit", sortable: true},
        {key: "biometricDataTypeName", sortable: true},
        {key: "created_at", sortable: true},
      ],
      fieldsObservations: [
        {key: "healthcareProfessionalName", sortable: true},
        {key: "created_at", sortable: true},
        {key: "Documents", sortable: true},
        {key: "Details", sortable: true},
      ],
      genderValues: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Other' }
      ],

      currentPageBiometricDatas: 1,
      currentPageObservations: 1,
      perPage: 4,
      clone: {},

      filterObservations: null,
      filterBioData: null
    }
  },
  computed: {
    dataRowsBiometricDatas() {
      return this.form.biometricDatas.length
    },
    dataRowsObservations() {
      return this.form.observations
    },
    emailState(){
      if (this.form.email === "" || this.form.email == null) {
        this.emailError = "Email is required"
        return this.isSubmitting ? false : null
      }
      var re = /\S+@\S+\.\S+/;
      if (!re.test(this.form.email)) {
        this.emailError = "Invalid email!"
        return false
      }
      return true
    },
    nameState(){
      if (this.form.name === "" || this.form.name == null) {
        this.nameError = "Name is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.name.length > 5)) {
        this.nameError = "Name need to contains at least 6 characters!"
        return false
      }
      return true
    },
    genderState(){
      if (this.form.gender === "" || this.form.gender == null) {
        this.genderError = "Gender is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.gender === 'Male' || this.form.gender === 'Female' || this.form.gender === 'Other')) {
        this.genderError = "Invalid gender!"
        return false
      }
      return true
    },
    passwordState(){
      if (this.method === 'edit')
        return true
      if (this.form.password === "" || this.form.password == null) {
        this.passwordError = "Password is required"
        return this.isSubmitting ? false : null
      }
      if (this.form.password.length < 4) {
        this.passwordError = "Password need to contains at least 4 characters!"
        return false
      }
      return true
    },
    healthNoState(){
      if (this.form.healthNo === "" || this.form.healthNo == null) {
        this.healthNoError = "Health number is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.healthNo.length === 9)) {
        this.healthNoError = "Health number need to contains 9 numbers!"
        return false
      }
      return true
    },
    birthdateState() {
      if (this.form.birthDate == null) {
        this.birthdateErr = "Day of Birth is required"
        return this.isSubmitting ? false : null
      }
      if (new Date(this.form.birthDate) > new Date()) {
        this.birthdateErr = "Day of Birth should be lower than current day"
        return false
      }
      return true
    },
    isFormValid() {
      return this.emailState && this.nameState && this.genderState && this.passwordState && this.healthNoState && this.birthdateState
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
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return date.toLocaleString('pt-PT')
    },
    resetBtnPressed() {
      this.isSubmitting = false
      this.form = Object.assign({}, this.clone)
    },
    onReset() {
      this.$emit("onReset")
    },
    onSubmit() {
      this.isSubmitting = true
      if (!this.isFormValid) {
        this.showErrorMessage("Fix the errors before submitting")
        return;
      }
      this.form.birthDate = new Date(this.form.birthDate)

      this.$emit("onSubmit", this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'id') return { visible: false, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'password') return { visible: false, editable: false }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'biometricDataHistory') return { visible: true, editable: false }
          if (fieldName === 'observations') return { visible: true, editable: false }
          if (fieldName === 'createdBy') return { visible: true, editable: false }
          if (fieldName === 'healthNo') return { visible: true, editable: true }
          if (fieldName === 'birthdate') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'id') return { visible: false, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'password') return { visible: true, editable: true }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'biometricDataHistory') return { visible: false, editable: false }
          if (fieldName === 'observations') return { visible: false, editable: false }
          if (fieldName === 'createdBy') return { visible: false, editable: false }
          if (fieldName === 'healthNo') return { visible: true, editable: true }
          if (fieldName === 'birthdate') return { visible: true, editable: true }
          break;
        default: return { visible: true, editable: true }
      }
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
    entity(newEntity) {
      if (newEntity != null) {
        this.isSubmitting = false
        this.show = false
        if (this.method === 'edit') {
          this.$axios
            .$get('/api/patients/' + this.entity.id)
            .then(patient => {
              this.form.id = patient.id;
              this.form.email = patient.email;
              this.form.name = patient.name;
              this.form.gender = patient.gender;
              this.form.biometricDatas = patient.biometricDatas;
              this.form.observations = patient.observations;
              this.form.created_by = patient.created_by;
              this.form.healthNo = patient.healthNo+"";
              this.form.birthDate = patient.birthDate;
              this.clone = Object.assign({}, this.form)
              this.show = true
            })
            .catch((err) => {
              this.showErrorMessage(err);
              this.$refs.bvEntity.hide()
              this.show = true
            })
        } else {
          this.form.id = 0
          this.form.email = ""
          this.form.name = ""
          this.form.gender = "Male"
          this.form.password = ""
          this.form.biometricDatas = ""
          this.form.observations = ""
          this.form.created_by = 0
          this.form.healthNo = ""
          this.form.password = ""
          this.form.birthDate = null
          this.clone = Object.assign({}, this.form)
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
