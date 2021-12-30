<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + (show ? (form.isGlobal ? ' Global' : ' Particular') : '') + ' Prescription '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-form-group
          id="input-group-healthProfessionalName"
          label="Healthcare Professional:"
          label-for="input-healthProfessionalName"
          label-class="font-weight-bold"
          v-if="fieldProperties('healthProfessional').visible"
        >
          <b-form-input
            id="input-healthProfessionalName"
            v-model="form.healthcareProfessionalName"
            :disabled="!fieldProperties('healthProfessional').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-patientName"
          label="Patient:"
          label-for="input-patientName"
          label-class="font-weight-bold"
          v-if="fieldProperties('patient').visible"
        >
          <b-form-input
            id="input-patientName"
            :value="patientName"
            :disabled="!fieldProperties('patient').editable"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-start-date" label="Start Date:" label-for="input-start-date" label-class="font-weight-bold">
          <div class="d-flex flex-row flex-wrap">
            <div class="flex-grow-1 px-1 mb-2">
              <b-form-datepicker
                id="input-start-date"
                v-model="form.start_date"
                :disabled="!fieldProperties('startDate').editable"
                :state="start_dateState"
                aria-describedby="input-startdate-feedback"
                required
              />
              <b-form-invalid-feedback id="input-startdate-feedback">
                {{form.start_dateError}}
              </b-form-invalid-feedback>
            </div>
            <div class="flex-grow-1 px-1 mb-2">
              <b-form-timepicker
                id="timepicker-start-date"
                v-model="start_date_time"
                :disabled="!fieldProperties('startDate').editable"
                :state="start_dateState"
                required
              />
            </div>
          </div>
        </b-form-group>
        <b-form-group id="input-group-end-date" label="End Date:" label-for="input-end-date" label-class="font-weight-bold">
          <div class="d-flex flex-row flex-wrap">
            <div class="flex-grow-1 px-1 mb-2">
              <b-form-datepicker
                id="input-end-date"
                v-model="form.end_date"
                :disabled="!fieldProperties('endDate').editable"
                :state="end_dateState"
                aria-describedby="input-enddate-feedback"
                required
              />
              <b-form-invalid-feedback id="input-enddate-feedback">
                {{form.end_dateError}}
              </b-form-invalid-feedback>
            </div>
            <div class="flex-grow-1 px-1 mb-2">
              <b-form-timepicker
                id="timepicker-end-date"
                v-model="end_date_time"
                :disabled="!fieldProperties('endDate').editable"
                :state="end_dateState"
                required
              />
            </div>
          </div>
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
          <b-input-group>
            <b-form-input
              id="input-issues"
              :value="issuesSelectedString"
              :class="issuesSelectedString === '' ? 'border border-danger text-danger' : ''"
              type="text"
              placeholder="Select at least one item"
              required
              disabled
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="outline-info" @click="selectIssues"><b-icon icon="search"></b-icon></b-button>
            </b-input-group-append>
            <b-input-group-append v-if="fieldProperties('issues').editable">
              <b-button variant="outline-danger" @click="unselectIssues"><b-icon icon="backspace"></b-icon></b-button>
            </b-input-group-append>
          </b-input-group>
          <div v-show="toggleISelect" class="pt-3 mx-2">
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-prepend>
              <b-form-input v-model="searchIssue" />
            </b-input-group>
            <b-table id="issues-table" :items="issues" :fields="fields" small hover responsive :current-page="currentPage" :per-page="perPage" :filter="searchIssue" @filtered="onFiltered">
              <template #cell(selected)="data">
                  <b-form-checkbox @change="issueClicked(data.item)" :checked="data.item.selected" />
              </template>
            </b-table>
            <b-pagination
              v-if="issues.length > perPage"
              v-model="currentPage"
              :total-rows="dataRows"
              :per-page="perPage"
              aria-controls="issues-table"
              align="center"
            ></b-pagination>
          </div>
        </b-form-group>
        <div v-if="this.method === 'edit' || this.method === 'create'">
          <b-button type="submit" variant="primary">{{this.method === 'create' ? 'Create' : 'Save'}}</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </div>
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
        issues: null,
        issuesError: '',
        issuesState: false,
        healthcareProfessionalId: null,
        healthcareProfessionalName: null,
        patients: [],
        start_date: null,
        start_dateError: '',
        end_date: null,
        end_dateError: '',
        notes: '',
        isGlobal: false
      },
      issues: [],
      show: false,
      fields: [{key: 'selected', label: 'Selected',sortable: true}, {key: 'name', label: 'Name',sortable: true}, {key: 'biometricDataTypeName', label: 'Biometric Data Type',sortable: true}],
      dataRows: 0,
      currentPage: 1,
      perPage: 4,

      toggleISelect: false,
      clone: {},

      start_date_time: null,
      end_date_time: null,

      searchIssue: ''
    }
  },
  computed: {
    issuesSelectedString() {
      if (this.issues == null || this.issues.length === 0) return '';

      let str = '';
      this.issues.forEach((issue) => {
        if (issue.selected || this.method === 'watch')
          str += ', ' + issue.name;
      })
      return str.slice(2);
    },
    start_dateState(){
      if (this.form.start_date > this.form.end_date) {
        this.form.start_dateError = "End date should be lower then start date"
        return false
      }
      return true
    },
    end_dateState(){
      if (this.form.end_date < this.form.start_date) {
        this.form.end_dateError = "End date should be higher then start date"
        return false
      }
      return true
    },
    issuesState(){
      if ((this.form.issues == null || this.form.issues.length == 0)) {
        this.form.issuesError = "Issues is required"
        return true
      }
      return false
    },
    patientName() {
      if (this.form.patients == null || this.form.patients.length === 0) return ''

      return this.form.patients[0].name
    }
  },
  methods: {
    onFiltered(filteredItems) {
      this.dataRows = filteredItems.length
      this.currentPage = 1
    },
    showErrorMessage(err) {
      if (err.response) {
        this.$toast.error('ERROR: ' + err.response.data).goAway(3000);
      }
      else {
        this.$toast.error(err).goAway(3000);
      }
    },
    formatTime(dateStr) {
      if (dateStr == null || dateStr === '') return ''
      let date = new Date(dateStr)
      return date.toTimeString().split(' ')[0]
    },
    getDateAndTimeSum(date, timeString) {
      if (date == null || timeString == null || timeString === '') return ''
      let timePieces = timeString.split(':');

      if (timePieces.length !== 3) return ''

      date.setHours(timePieces[0], timePieces[1], timePieces[2])

      return date
    },
    issueClicked(item) {
      item.selected = !item.selected
      this.issues = [...this.issues]
    },
    resetBtnPressed() {
      this.form = Object.assign({}, this.clone)
    },
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      if (!this.start_dateState) {
        this.showErrorMessage("Check start date errors!")
        return
      }
      if (!this.end_dateState) {
        this.showErrorMessage("Check end date errors!")
        return
      }
      if (this.issues == null)
        return;

      this.form.issues = this.issues.filter(issue => issue.selected)
      if (this.form.issues == null) {
        return
      }

      this.form.start_date = this.getDateAndTimeSum(new Date(this.form.start_date), this.start_date_time)
      this.form.end_date = this.getDateAndTimeSum(new Date(this.form.end_date), this.end_date_time)

      this.$emit("onSubmit", this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'watch':
          if (fieldName === 'issues') return { visible: this.form.isGlobal, editable: false }
          if (fieldName === 'healthProfessional') return { visible: true, editable: false }
          if (fieldName === 'patient') return { visible: !this.form.isGlobal, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: false }
          if (fieldName === 'endDate') return { visible: true, editable: false }
          if (fieldName === 'notes') return { visible: true, editable: false }
          break;
        case 'edit':
          if (fieldName === 'issues') return { visible: this.form.isGlobal, editable: true }
          if (fieldName === 'healthProfessional') return { visible: true, editable: false }
          if (fieldName === 'patient') return { visible: !this.form.isGlobal, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: true }
          if (fieldName === 'endDate') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          break;
        case 'create':
          if (fieldName === 'issues') return { visible: true, editable: true }
          if (fieldName === 'healthProfessional') return { visible: false, editable: false }
          if (fieldName === 'patient') return { visible: false, editable: false }
          if (fieldName === 'startDate') return { visible: true, editable: true }
          if (fieldName === 'endDate') return { visible: true, editable: true }
          if (fieldName === 'notes') return { visible: true, editable: true }
          break;
        default: return { visible: true, editable: false }
      }
    },
    selectIssues() {
      this.toggleISelect = !this.toggleISelect;
    },
    unselectIssues() {
      this.form.issues = []
      this.issues.forEach(issue => {
        issue.selected = false
      })
    },
  },
  watch: {
    start_date_time(newTime) {
      this.form.start_date = this.getDateAndTimeSum(new Date(this.form.start_date), newTime)
    },
    end_date_time(newTime) {
      this.form.end_date = this.getDateAndTimeSum(new Date(this.form.end_date), newTime)
    },
    modalShow(newVal){
      if (newVal === true) {
        this.$refs.bvEntity.show()
      }else{
        this.$refs.bvEntity.hide()
      }
    },
    entity(newEntity){
      if (newEntity != null) {
        this.toggleISelect = false;
        this.show = false
        this.currentPage = 1
        this.searchIssue = ''
        if (this.method === 'edit' || this.method === 'watch') {
          this.$axios
            .$get('/api/prescriptions/' + this.entity.id)
            .then(prescription => {
              this.form.id = prescription.id;
              this.form.issues = prescription.issues;
              this.form.isGlobal = prescription.issues != null && prescription.issues.length > 0
              this.form.healthcareProfessionalId = prescription.healthcareProfessionalId;
              this.form.healthcareProfessionalName = prescription.healthcareProfessionalName;
              this.form.patients = prescription.patients;
              this.form.start_date = prescription.start_date;
              this.start_date_time = this.formatTime(prescription.start_date);
              this.form.end_date = prescription.end_date;
              this.end_date_time = this.formatTime(prescription.end_date);
              this.form.notes = prescription.notes;

              this.show = true
              if (this.method === 'watch') {
                this.fields = [{key: 'name', label: 'Name',sortable: true}, {key: 'biometricDataTypeName', label: 'Biometric Data Type',sortable: true}]
                this.issues = this.form.issues;
              }else
              if (prescription.issues != null && prescription.issues.length > 0) {
                this.$axios
                  .$get('/api/biometricdataissues')
                  .then(biometricdataissues => {
                    this.issues = biometricdataissues;

                    this.issues.forEach(issue => {
                      issue.selected = false;

                      for (let i = 0; i < this.form.issues.length; i++) {
                        if (this.form.issues[i].id === issue.id) {
                          issue.selected = true;
                          break;
                        }
                      }
                    });
                    this.dataRows = this.issues.length
                  })
                  .catch((err) => {
                    this.showErrorMessage(err);
                  })
              }

              this.clone = Object.assign({}, this.form)
            })
            .catch((err) => {
              this.show = true
              this.showErrorMessage(err);
              this.$refs.bvEntity.hide()
            })
        } else {
          this.form.id = ""
          this.form.issues = []
          this.form.healthcareProfessionalId = ""
          this.form.healthcareProfessionalName = ""
          this.form.patientId = ""
          this.form.patientName = ""
          this.form.start_date = new Date().toISOString().slice(0,10)
          this.form.end_date = new Date().toISOString().slice(0,10)
          this.form.notes = ""
          this.form.isGlobal = true

          this.show = true

          this.clone = Object.assign({}, this.form)
          this.$axios
            .$get('/api/biometricdataissues')
            .then(biometricdataissues => {
              this.issues = biometricdataissues;
            })
            .catch((err) => {
              this.showErrorMessage(err);
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
