<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Patient '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-username"
          label="Username:"
          label-for="input-username"
          v-if="fieldProperties('username').visible"
        >
          <b-form-input
            id="input-username"
            v-model="form.username"
            :disabled="!fieldProperties('username').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-email"
          label="E-mail:"
          label-for="input-email"
          v-if="fieldProperties('email').visible"
        >
          <b-form-input
            id="input-email"
            v-model="form.email"
            :disabled="!fieldProperties('email').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-name"
          label="Name:"
          label-for="input-name"
          v-if="fieldProperties('name').visible"
        >
          <b-form-input
            id="input-name"
            v-model="form.name"
            :disabled="!fieldProperties('name').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-gender"
          label="Gender:"
          label-for="input-gender"
          v-if="fieldProperties('gender').visible"
        >
          <b-form-select
            id="input-gender"
            v-model="form.gender"
            :disabled="!fieldProperties('gender').editable"
            :options="genderValues"
            required
          />
        </b-form-group>
        <b-form-group
          id="input-group-healthNo"
          label="Health Number:"
          label-for="input-healthNo"
          v-if="fieldProperties('healthNo').visible"
        >
          <b-form-input
            id="input-healthNo"
            v-model="form.healthNo"
            :disabled="!fieldProperties('healthNo').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-biometricDataHistory"
          label="Biometric Data History:"
          label-for="input-biometricDataHistory"
          v-if="fieldProperties('biometricDataHistory').visible"
        >
          <b-table v-if="form.biometricDataHistory && form.biometricDataHistory.length > 0" striped hover responsive :items="form.biometricDataHistory" :fields="fieldsBiometricData" />
          <b-card-text v-else>No Data</b-card-text>
        </b-form-group>
        <b-form-group
          id="input-group-healthProfessionals"
          label="Healthcare Professionals Responsible:"
          label-for="input-healthProfessionals"
          v-if="fieldProperties('healthProfessionals').visible"
        >
          <b-table v-if="form.biometricDataHistory && form.healthProfessionals.length > 0" striped hover responsive :items="form.healthProfessionals" :fields="fieldsHealthProfessionals" />
          <b-card-text v-else>No Data</b-card-text>
        </b-form-group>
        <b-form-group
          id="input-group-createdBy"
          label="Created by:"
          label-for="input-createdBy"
          v-if="fieldProperties('createdBy').visible"
        >
          <b-form-input
            id="input-createdBy"
            :value="'['+form.createdByUsername+'] '+form.createdByName"
            disabled
          ></b-form-input>
        </b-form-group>

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
        username: null,
        email: null,
        name: null,
        gender: null,
        biometricDataHistory: [],
        healthProfessionals: [],
        createdBy: null,
        healthNo: null
      },
      show: true,
      fieldsBiometricData: ["value", "valueUnit", "biometricDataTypeName", "createdAt"],
      fieldsHealthProfessionals: ["email", "name", "specialty", "gender"],
      genderValues: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Other' }
      ]
    }
  },
  methods: {
    onReset() {
      this.$emit("onReset")
    },
    onSubmit() {
      this.$emit("onSubmit", this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'username') return { visible: true, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'biometricDataHistory') return { visible: true, editable: false }
          if (fieldName === 'healthProfessionals') return { visible: true, editable: false }
          if (fieldName === 'createdBy') return { visible: true, editable: false }
          if (fieldName === 'healthNo') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'username') return { visible: true, editable: true }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'biometricDataHistory') return { visible: false, editable: false }
          if (fieldName === 'healthProfessionals') return { visible: false, editable: false }
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
            .$get('/api/patients/' + this.entity.username)
            .then(patient => {
              this.form.username = patient.username;
              this.form.email = patient.email;
              this.form.name = patient.name;
              this.form.gender = patient.gender;
              this.form.biometricDataHistory = patient.biometricDatas;
              this.form.healthProfessionals = patient.healthcareProfessionals;
              this.form.createdByUsername = patient.createdByUsername;
              this.form.createdByName = patient.createdByName;
              this.form.healthNo = patient.healthNo;
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.form = {}
          this.form.createdBy = "bruna.leitao" //substituir pelo responsavel logado que criou este paciente
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
