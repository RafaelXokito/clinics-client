<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Observation '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-tabs content-class="p-2 pt-3">
          <b-tab title="Observation" active>
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
              id="input-group-healthProfessionalId"
              label="Healthcare Professional Id:"
              label-for="input-healthProfessionalId"
              label-class="font-weight-bold"
              v-if="fieldProperties('healthcareProfessionalId').visible"
            >
              <b-form-input
                id="input-healthProfessionalId"
                v-model="form.healthcareProfessionalId"
                :disabled="!fieldProperties('healthcareProfessionalId').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-healthProfessionalName"
              label="Healthcare Professional Name:"
              label-for="input-healthProfessionalName"
              label-class="font-weight-bold"
              v-if="fieldProperties('healthcareProfessionalName').visible"
            >
              <b-form-input
                id="input-healthProfessionalName"
                v-model="form.healthcareProfessionalName"
                :disabled="!fieldProperties('healthcareProfessionalName').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-patientId"
              label="Patient Id:"
              label-for="input-patientId"
              label-class="font-weight-bold"
              v-if="fieldProperties('patientId').visible"
            >
              <b-form-input
                id="input-patientId"
                v-model="form.patientId"
                :disabled="!fieldProperties('patientId').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-patientName"
              label="Patient Name:"
              label-for="input-patientName"
              label-class="font-weight-bold"
              v-if="fieldProperties('patientName').visible"
            >
              <b-form-input
                id="input-patientName"
                v-model="form.patientName"
                :disabled="!fieldProperties('patientName').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-notes"
              label="Notes:"
              label-for="input-notes"
              label-class="font-weight-bold"
              v-if="fieldProperties('notes').visible"
            >
              <b-form-input
                id="input-notes"
                v-model="form.notes"
                :disabled="!fieldProperties('notes').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-createdAt"
              label="Created At:"
              label-for="input-createdAt"
              label-class="font-weight-bold"
              v-if="fieldProperties('createdAt').visible"
            >
              <b-form-input
                id="input-createdAt"
                v-model="form.created_at"
                :disabled="!fieldProperties('createdAt').editable"
              ></b-form-input>
            </b-form-group>
          </b-tab>

          <b-tab title="Prescription">
            <b-form-group
              id="input-group-prescriptionId"
              label="Id:"
              label-for="input-prescriptionId"
              label-class="font-weight-bold"
              v-if="fieldProperties('prescriptionId').visible"
            >
              <b-form-input
                id="input-createdAt"
                v-model="form.prescription.id"
                :disabled="!fieldProperties('prescriptionId').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-prescriptionStartDate"
              label="Start Date:"
              label-for="input-prescriptionStartDate"
              label-class="font-weight-bold"
              v-if="fieldProperties('prescriptionStartDate').visible"
            >
              <b-form-datepicker
                id="input-prescriptionStartDate"
                v-model="form.prescription.start_date" class="mb-2"
                :disabled="!fieldProperties('prescriptionStartDate').editable"
              >
              </b-form-datepicker>
            </b-form-group>
            <b-form-group
              id="input-group-prescriptionEndDate"
              label="End Date:"
              label-for="input-prescriptionEndDate"
              label-class="font-weight-bold"
              v-if="fieldProperties('prescriptionEndDate').visible"
            >
              <b-form-datepicker
                id="input-prescriptionEndDate"
                v-model="form.prescription.end_date" class="mb-2"
                :disabled="!fieldProperties('prescriptionEndDate').editable"
              >
              </b-form-datepicker>
            </b-form-group>

            <b-form-group
              id="input-group-prescriptionNotes"
              label="Notes:"
              label-for="input-prescriptionNotes"
              label-class="font-weight-bold"
              v-if="fieldProperties('prescriptionNotes').visible"
            >
              <b-form-input
                id="input-prescriptionNotes"
                v-model="form.prescription.notes"
                placeholder="Enter notes"
                :disabled="!fieldProperties('prescriptionNotes').editable"
              ></b-form-input>
            </b-form-group>
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
        healthcareProfessionalId: null,
        healthcareProfessionalName: null,
        patientId: null,
        patientName: null,
        notes: null,
        created_at: null,
        prescription: {
          id: null,
          start_date: null,
          end_date: null,
          notes: null
        },
      },
      show: true,
    }
  },
  methods: {
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      this.$emit("onSubmit", this.form, this.method)
    },
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return date.toLocaleString('pt-PT')
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'id') return { visible: true, editable: false }
          if (fieldName === 'healthcareProfessionalId') return { visible: true, editable: false }
          if (fieldName === 'healthcareProfessionalName') return { visible: true, editable: false }
          if (fieldName === 'patientId') return { visible: true, editable: false }
          if (fieldName === 'patientName') return { visible: true, editable: false }
          if (fieldName === 'createdAt') return { visible: true, editable: false }
          if (fieldName === 'prescriptionId') return { visible: true, editable: false }
          if (fieldName === 'prescriptionStartDate') return { visible: true, editable: true }
          if (fieldName === 'prescriptionEndDate') return { visible: true, editable: true }
          if (fieldName === 'prescriptionNotes') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'id') return { visible: false, editable: false }
          if (fieldName === 'healthcareProfessionalId') return { visible: false, editable: false }
          if (fieldName === 'healthcareProfessionalName') return { visible: false, editable: false }
          if (fieldName === 'patientId') return { visible: true, editable: true }
          if (fieldName === 'patientName') return { visible: false, editable: false }
          if (fieldName === 'createdAt') return { visible: false, editable: false }
          if (fieldName === 'prescriptionId') return { visible: false, editable: false }
          if (fieldName === 'prescriptionStartDate') return { visible: true, editable: true }
          if (fieldName === 'prescriptionEndDate') return { visible: true, editable: true }
          if (fieldName === 'prescriptionNotes') return { visible: true, editable: true }
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
            .$get('/api/observations/' + this.entity.id)
            .then(observation => {
              this.form.id = observation.id;
              this.form.healthcareProfessionalId = observation.healthcareProfessionalId;
              this.form.healthcareProfessionalName = observation.healthcareProfessionalName;
              this.form.patientId = observation.patientId;
              this.form.patientName = observation.patientName;
              this.form.notes = observation.notes;
              this.form.created_at = this.formatDate(observation.created_at);
              this.form.prescription.id = observation.prescription.id;
              this.form.prescription.start_date = observation.prescription.start_date;
              this.form.prescription.end_date = observation.prescription.end_date;
              this.form.prescription.notes = observation.prescription.notes;
            })
            .catch((err) => {
              this.$toast.error(err).goAway(3000);
            })
        } else {
          this.form = {}
          this.form.prescription = {}
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
