<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Prescription '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-issues"
          label="Issues:"
          label-for="input-issues"
          v-if="fieldProperties('issues').visible"
        >
          <b-table striped hover responsive :items="issues" :fields="fields" />
        </b-form-group>
        <b-form-group
          id="input-group-healthProfessionalUsername"
          label="Healthcare Professional Username:"
          label-for="input-healthProfessionalUsername"
          v-if="fieldProperties('healthProfessionalUsername').visible"
        >
          <b-form-input
            id="input-healthProfessionalUsername"
            v-model="form.healthProfessionalUsername"
            :disabled="!fieldProperties('healthProfessionalUsername').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-healthProfessionalName"
          label="Healthcare Professional Name:"
          label-for="input-healthProfessionalName"
          v-if="fieldProperties('healthProfessionalName').visible"
          disabled
        >
          <b-form-input
            id="input-healthProfessionalName"
            v-model="form.healthProfessionalName"
            :disabled="!fieldProperties('healthProfessionalName').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-startDate"
          label="Start Date:"
          label-for="input-startDate"
          v-if="fieldProperties('startDate').visible"
        >
          <b-form-datepicker
            id="input-startDate"
            v-model="form.startDate" class="mb-2"
            :disabled="!fieldProperties('startDate').editable"
          >
          </b-form-datepicker>
        </b-form-group>
        <b-form-group
          id="input-group-endDate"
          label="End Date:"
          label-for="input-endDate"
          v-if="fieldProperties('endDate').visible"
        >
          <b-form-datepicker
            id="input-endDate"
            v-model="form.endDate" class="mb-2"
            :disabled="!fieldProperties('endDate').editable"
          >
          </b-form-datepicker>
        </b-form-group>

        <b-form-group
          id="input-group-notes"
          label="Notes:"
          label-for="input-notes"
          v-if="fieldProperties('notes').visible"
        >
          <b-form-input
            id="input-notes"
            v-model="form.notes"
            placeholder="Enter notes"
            :disabled="!fieldProperties('notes').editable"
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
        id: null,
        issues: null,
        healthProfessionalUsername: null,
        healthProfessionalName: null,
        startDate: null,
        endDate: null,
        notes: '',
      },
      issues: [],
      show: true,
      fields: ["name", "biometricDataTypeName"],
    }
  },
  methods: {
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      this.$emit("onSubmit", this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'issues') return { visible: true, editable: true }
          if (fieldName === 'healthProfessionalUsername') return { visible: true, editable: false }
          if (fieldName === 'healthProfessionalName') return { visible: true, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: true }
          if (fieldName === 'endDate') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'issues') return { visible: true, editable: true }
          if (fieldName === 'healthProfessionalUsername') return { visible: false, editable: false }
          if (fieldName === 'healthProfessionalName') return { visible: false, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: true }
          if (fieldName === 'endDate') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
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
        if (this.method === 'edit') {
          this.$axios
            .$get('/api/prescriptions/' + this.entity.id)
            .then(prescription => {
              this.form.issues = prescription.issues;
              this.form.healthProfessionalUsername = prescription.healthProfessionalUsername;
              this.form.healthProfessionalName = prescription.healthProfessionalName;
              this.form.startDate = prescription.startDate;
              this.form.endDate = prescription.endDate;
              this.form.notes = prescription.notes;
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.form = {}
          this.form.healthProfessionalUsername = "bruna.leitao" //substituir quando estiver a buscar o user logado
        }

        this.$axios
          .$get('/api/biometricdataissues')
          .then(biometricdataissues => {
            this.issues = biometricdataissues.entities;
          });

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
