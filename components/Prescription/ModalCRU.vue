<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Global Prescription '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-healthProfessionalId"
          label="Healthcare Professional Id:"
          label-for="input-healthProfessionalId"
          label-class="font-weight-bold"
          v-if="fieldProperties('healthProfessionalUsername').visible"
        >
          <b-form-input
            id="input-healthProfessionalId"
            v-model="form.healthcareProfessionalId"
            :disabled="!fieldProperties('healthProfessionalUsername').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-healthProfessionalName"
          label="Healthcare Professional Name:"
          label-for="input-healthProfessionalName"
          label-class="font-weight-bold"
          v-if="fieldProperties('healthProfessionalName').visible"
        >
          <b-form-input
            id="input-healthProfessionalName"
            v-model="form.healthcareProfessionalName"
            :disabled="!fieldProperties('healthProfessionalName').editable"
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
          id="input-group-startDate"
          label="Start Date:"
          label-for="input-startDate"
          label-class="font-weight-bold"
          v-if="fieldProperties('startDate').visible"
        >
          <b-form-datepicker
            id="input-startDate"
            v-model="form.start_date" class="mb-2"
            :disabled="!fieldProperties('startDate').editable"
            required
          >
          </b-form-datepicker>
        </b-form-group>
        <b-form-group
          id="input-group-endDate"
          label="End Date:"
          label-for="input-endDate"
          label-class="font-weight-bold"
          v-if="fieldProperties('endDate').visible"
        >
          <b-form-datepicker
            id="input-endDate"
            v-model="form.end_date" class="mb-2"
            :disabled="!fieldProperties('endDate').editable"
            required
          >
          </b-form-datepicker>
        </b-form-group>

        <b-form-group
          id="input-group-notes"
          label="Notes:"
          label-for="input-notes"
          label-class="font-weight-bold"
          v-if="fieldProperties('notes').visible"
        >
          <b-form-textarea
            id="input-notes"
            v-model="form.notes"
            placeholder="Enter notes"
            :disabled="!fieldProperties('notes').editable"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group
          id="input-group-issues"
          label="Issues:"
          label-for="issues-table"
          label-class="font-weight-bold"
          v-if="fieldProperties('issues').visible"
        >
          <div class="pt-3">
            <b-table  id="issues-table" :items="issues" :fields="fields" small hover responsive selectable select-mode="multi" @row-selected="onRowSelected" :current-page="currentPage" :per-page="perPage">
              <template #cell(selected)="data">
                <template v-if="containsIssue(data.item.id)">
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
              v-if="issues.length > 4"
              v-model="currentPage"
              :total-rows="dataRows"
              :per-page="perPage"
              aria-controls="issues-table"
              align="center"
            ></b-pagination>
          </div>
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
        healthcareProfessionalId: null,
        healthcareProfessionalName: null,
        patientId: null,
        patientName: null,
        start_date: null,
        end_date: null,
        notes: '',
      },
      issues: [],
      show: true,
      fields: ["selected", "name", "biometricDataTypeName"],
      currentPage: 1,
      perPage: 4
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
          if (fieldName === 'issues') return { visible: this.form.patientId === 0, editable: true }
          if (fieldName === 'healthProfessionalUsername') return { visible: true, editable: false }
          if (fieldName === 'healthProfessionalName') return { visible: true, editable: false }
          if (fieldName === 'patientId') return { visible: this.form.patientId !== 0, editable: false }
          if (fieldName === 'patientName') return { visible: this.form.patientId !== 0, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: true }
          if (fieldName === 'endDate') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'issues') return { visible: true, editable: true }
          if (fieldName === 'healthProfessionalUsername') return { visible: false, editable: false }
          if (fieldName === 'healthProfessionalName') return { visible: false, editable: false }
          if (fieldName === 'patientId') return { visible: false, editable: false }
          if (fieldName === 'patientName') return { visible: false, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: true }
          if (fieldName === 'endDate') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          break;
        default: return { visible: true, editable: true }
      }
    },
    onRowSelected(items) {
      this.form.issues = items;
    },
    containsIssue(id) {
      if (this.form.issues == null) return false

      for (let i = 0; i < this.form.issues.length; i++) {
        if (this.form.issues[i].id === id) return true
      }

      return false
    }
  },
  computed: {
    dataRows() {
      return this.issues.length
    }
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
              this.form.id = prescription.id;
              this.form.issues = prescription.issues;
              this.form.healthcareProfessionalId = prescription.healthcareProfessionalId;
              this.form.healthcareProfessionalName = prescription.healthcareProfessionalName;
              this.form.patientId = prescription.patientId;
              this.form.patientName = prescription.patientName;
              this.form.start_date = prescription.start_date;
              this.form.end_date = prescription.end_date;
              this.form.notes = prescription.notes;

              if (prescription.patientId === 0) {
                this.$axios
                  .$get('/api/biometricdataissues')
                  .then(biometricdataissues => {
                    this.issues = biometricdataissues.entities;
                  })
                  .catch((err) => {
                    this.$toast.error(err).goAway(3000);
                  })
              }
            })
            .catch((err) => {
              this.$toast.error(err).goAway(3000);
            })
        } else {
          this.form.id = ""
          this.form.issues = ""
          this.form.healthcareProfessionalId = ""
          this.form.healthcareProfessionalName = ""
          this.form.patientId = ""
          this.form.patientName = ""
          this.form.start_date = ""
          this.form.end_date = ""
          this.form.notes = ""
          this.$axios
            .$get('/api/biometricdataissues')
            .then(biometricdataissues => {
              this.issues = biometricdataissues.entities;
            })
            .catch((err) => {
              this.$toast.error(err).goAway(3000);
            })
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
