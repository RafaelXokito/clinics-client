<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Patient '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
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
                required
              ></b-form-input>
              <b-form-invalid-feedback id="input-email-feedback">
                {{form.emailError}}
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
                :state="passwordState"
                :disabled="!fieldProperties('password').editable"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback id="input-password-feedback">
                {{form.passwordError}}
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
                required
              ></b-form-input>
              <b-form-invalid-feedback id="input-name-feedback">
                {{form.nameError}}
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
                required
              />
              <b-form-invalid-feedback id="input-gender-feedback">
                {{form.genderError}}
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
                required
              ></b-form-input>
              <b-form-invalid-feedback id="input-healthNo-feedback">
                {{form.healthNoError}}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-tab>

          <b-tab v-if="form.biometricDatas && form.biometricDatas.length > 0" title="Biometric Data">
            <b-table striped hover responsive :items="form.biometricDatas" :fields="fieldsBiometricData">
              <template #cell(created_at)="data">
                {{formatDate(data.item.created_at)}}
              </template>
            </b-table>
          </b-tab>

          <b-tab title="Observations" v-if="form.observations && form.observations.length > 0">
            <b-table striped hover responsive :items="form.observations" :fields="fieldsObservations">
              <template #cell(created_at)="data">
                {{formatDate(data.item.created_at)}}
              </template>
            </b-table>
          </b-tab>
        </b-tabs>

        <b-button type="submit" variant="primary">{{this.method === 'create' ? 'Create' : 'Save'}}</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
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
        emailError: '',
        password: null,
        passwordError: '',
        name: null,
        nameError: '',
        gender: null,
        genderError: '',
        biometricDatas: [],
        observations: [],
        created_by: null,
        healthNo: null,
        healthNoError: ''
      },
      show: true,
      fieldsBiometricData: ["value", "valueUnit", "biometricDataTypeName", "created_at"],
      fieldsObservations: ["id", "healthcareProfessionalName", "created_at", "prescription"],
      genderValues: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Other' }
      ]
    }
  },
  computed: {
    emailState(){
      if (this.form.email == "" || this.form.email == null) {
        return null
      }
      var re = /\S+@\S+\.\S+/;
      if (!re.test(this.form.email)) {
        this.form.emailError = "Invalid email!"
        return false
      }
      return true
    },
    nameState(){
      if (this.form.name == "" || this.form.name == null) {
        return null
      }
      if (!(this.form.name.length > 5)) {
        this.form.nameError = "Name need to contains at least 6 characters!"
        return false
      }
      return true
    },
    genderState(){
      if (this.form.gender == "" || this.form.gender == null) {
        return null
      }
      if (!(this.form.gender === 'Male' || this.form.gender === 'Female' || this.form.gender === 'Other')) {
        this.form.genderError = "Invalid gender!"
        return false
      }
      return true
    },
    passwordState(){
      if (this.form.password == "" || this.form.password == null) {
        return null
      }
      if (!(this.form.password.length > 3)) {
        this.form.passwordError = "Password need to contains at least 4 characters!"
        return false
      }
      return true
    },
    healthNoState(){
      if (this.form.healthNo == "" || this.form.healthNo == null) {
        return null
      }
      if (!(this.form.healthNo.length === 9)) {
        this.form.healthNoError = "Health number need to contains 9 numbers!"
        return false
      }
      return true
    }
  },
  methods: {
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return date.toLocaleString('pt-PT')
    },
    onReset() {
      this.$emit("onReset")
    },
    onSubmit() {
      this.$emit("onSubmit", this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'id') return { visible: true, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'password') return { visible: false, editable: false }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'biometricDataHistory') return { visible: true, editable: false }
          if (fieldName === 'observations') return { visible: true, editable: false }
          if (fieldName === 'createdBy') return { visible: true, editable: false }
          if (fieldName === 'healthNo') return { visible: true, editable: true }
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
              this.form.healthNo = patient.healthNo;
            })
            .catch((err) => {
              this.$toast.error(err).goAway(3000);
            })
        } else {
          this.form.id = ""
          this.form.email = ""
          this.form.name = ""
          this.form.gender = "Male"
          this.form.password = ""
          this.form.biometricDatas = ""
          this.form.observations = ""
          this.form.created_by = ""
          this.form.healthNo = ""
        }
        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
