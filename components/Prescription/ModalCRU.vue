<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Prescription '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-form-group
          id="input-group-healthProfessionalUsername"
          label="Healthcare Professional Id:"
          label-for="input-healthProfessionalUsername"
          v-if="fieldProperties('healthProfessionalUsername').visible"
        >
          <b-form-input
            id="input-healthProfessionalUsername"
            v-model="form.healthcareProfessionalId"
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
            v-model="form.healthcareProfessionalName"
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
            v-model="form.start_date" class="mb-2"
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
            v-model="form.end_date" class="mb-2"
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

        <b-form-group
          id="input-group-issues"
          label="Issues:"
          label-for="issues-table"
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
              v-model="currentPage"
              :total-rows="dataRows"
              :per-page="perPage"
              aria-controls="issues-table"
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
        start_date: null,
        end_date: null,
        notes: '',
      },
      issues: [],
      show: true,
      fields: ["selected", "name", "biometricDataTypeName"],
      currentPage: 1,
      dataRows: 0,
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
              this.form.id = this.entity.id;
              this.form.issues = prescription.issues;
              this.form.healthcareProfessionalId = prescription.healthcareProfessionalId;
              this.form.healthcareProfessionalName = prescription.healthcareProfessionalName;
              this.form.start_date = prescription.start_date;
              this.form.end_date = prescription.end_date;
              this.form.notes = prescription.notes;
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.form = {}
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
