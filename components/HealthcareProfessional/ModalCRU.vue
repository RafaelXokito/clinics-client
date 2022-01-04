<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Healthcare Professional'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-tabs content-class="p-2 pt-3">
          <b-tab title="Healthcare Professional" active>
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
                trim
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
              id="input-group-specialty"
              label="Specialty:"
              label-for="input-specialty"
              label-class="font-weight-bold"
              v-if="fieldProperties('specialty').visible"
            >
              <b-form-input
                id="input-specialty"
                aria-describedby="input-specialty-feedback"
                v-model="form.specialty"
                :state="specialtyState"
                :disabled="!fieldProperties('specialty').editable"
                trim
              ></b-form-input>
              <b-form-invalid-feedback id="input-specialty-feedback">
                {{specialtyError}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              id="input-group-createdBy"
              label="Created by:"
              label-for="input-createdBy"
              label-class="font-weight-bold"
              v-if="fieldProperties('createdBy').visible"
            >
              <b-form-input
                id="input-createdBy"
                :value="form.created_by"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-tab>

          <b-tab v-if="form.prescriptions && form.prescriptions.length > 0" title="Prescriptions">
            <b-form-group label-for="filter-prescriptions" class="mb-0">
              <b-input-group size="sm">
                <b-form-input
                  id="filter-prescriptions"
                  v-model="filterPrescriptions"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filterPrescriptions" @click="filterPrescriptions = ''">Clear</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-table striped hover responsive :items="form.prescriptions" :fields="fieldsPrescriptions" :filter="filterPrescriptions" show-empty>
              <template #empty="scope">
                <h6 class="text-center">{{ scope.emptyText }}</h6>
              </template>
              <template #emptyfiltered="scope">
                <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
              </template>
              <template #cell(start_date)="data">
                {{formatDate(data.item.start_date, false)}}
              </template>
              <template #cell(end_date)="data">
                {{formatDate(data.item.end_date, false)}}
              </template>
              <template #cell(isGlobal)="data">
                <div class="text-center">
                  <b-icon-people-fill v-if="data.item.isGlobal" scale="1.75" title="Yes"></b-icon-people-fill>
                  <b-icon-person-fill v-else scale="1.75" title="No"></b-icon-person-fill>
                </div>
              </template>
            </b-table>
          </b-tab>

          <b-tab v-if="form.observations && form.observations.length > 0" title="Observations">
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
                {{formatDate(data.item.created_at, true)}}
              </template>
            </b-table>
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
        specialty: null,
        prescriptions: [],
        observations: [],
        created_by: null,
        birthDate: null
      },

      emailError: '',
      passwordError: '',
      nameError: '',
      genderError: '',
      specialtyError: '',
      birthdateErr: '',

      isSubmitting: false,

      show: false,
      fieldsPrescriptions: [
        {key: "healthcareProfessionalName", sortable: true},
        {key: "start_date", sortable: true},
        {key: "end_date", sortable: true},
        {key: "isGlobal", sortable: true},
      ],
      fieldsObservations: [
        {key: "healthcareProfessionalName", sortable: true},
        {key: "patientName", sortable: true},
        {key: "created_at", sortable: true},
      ],
      genderValues: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Other' }
      ],
      clone: {},

      filterObservations: null,
      filterPrescriptions: null
    }
  },
  computed: {
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
      if (!(this.form.password.length > 3)) {
        this.passwordError = "Password need to contains at least 4 characters!"
        return false
      }
      return true
    },
    specialtyState(){
      if (this.form.specialty === "" || this.form.specialty == null) {
        this.specialtyError = "Specialty is required"
        return this.isSubmitting ? false : null
      }
      if (!(this.form.specialty.length > 3)) {
        this.specialtyError = "Specialty need to contains at least 4 characters!"
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
      return this.emailState && this.nameState && this.genderState && this.passwordState && this.specialtyState && this.birthdateState
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
    formatDate(dateStr, isFull) {
      let date = new Date(dateStr)
      if (isFull)
        return date.toLocaleString('pt-PT')

      return date.toLocaleDateString('pt-PT')
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
          if (fieldName === 'specialty') return { visible: true, editable: true }
          if (fieldName === 'prescriptions') return { visible: true, editable: false }
          if (fieldName === 'observations') return { visible: true, editable: false }
          if (fieldName === 'patients') return { visible: true, editable: false }
          if (fieldName === 'createdBy') return { visible: false, editable: false }
          if (fieldName === 'birthdate') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'id') return { visible: false, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'password') return { visible: true, editable: true }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'specialty') return { visible: true, editable: true }
          if (fieldName === 'prescriptions') return { visible: false, editable: false }
          if (fieldName === 'observations') return { visible: false, editable: false }
          if (fieldName === 'patients') return { visible: false, editable: false }
          if (fieldName === 'createdBy') return { visible: false, editable: false }
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
    entity(newEntity){
      if (newEntity != null) {
        this.show = false
        this.isSubmitting = false
        if (this.method === 'edit') {
          this.$axios
            .$get('/api/healthcareprofessionals/' + this.entity.id)
            .then(healthcareProfessional => {
              this.form.id = healthcareProfessional.id;
              this.form.email = healthcareProfessional.email;
              this.form.name = healthcareProfessional.name;
              this.form.gender = healthcareProfessional.gender;
              this.form.specialty = healthcareProfessional.specialty;
              this.form.prescriptions = healthcareProfessional.prescriptions;
              this.form.observations = healthcareProfessional.observations;
              this.form.created_by = healthcareProfessional.created_by;
              this.form.birthDate = healthcareProfessional.birthDate;
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
          this.form.gender = ""
          this.form.specialty = ""
          this.form.prescriptions = ""
          this.form.observations = ""
          this.form.created_by = ""
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
