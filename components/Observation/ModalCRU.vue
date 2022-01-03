<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Observation '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset.prevent="resetBtnPressed" v-if="show">
        <b-tabs content-class="p-2 pt-3">
          <b-tab title="Observation" active>
            <b-form-group
              id="input-group-healthProfessionalName"
              label="Healthcare Professional:"
              label-for="input-healthProfessionalName"
              label-class="font-weight-bold"
              v-if="fieldProperties('healthcareProfessionalName').visible"
            >
              <b-form-input
                id="input-healthProfessionalName"
                v-model="form.healthcareProfessionalName"
                :disabled="!fieldProperties('healthcareProfessionalName').editable"
                trim
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-patient"
              label-for="input-patient"
              label="Patient:"
              label-class="font-weight-bold"
            >
              <b-input-group>
                <b-form-input
                  id="input-patient"
                  v-model="form.patientName"
                  type="text"
                  placeholder="Select a patient"
                  disabled
                  :class="submitting && !patientState ? 'border border-danger text-danger' : ''"
                ></b-form-input>
                <b-input-group-append v-if="method === 'create'">
                  <b-button variant="outline-info" @click="selectPatient"><b-icon icon="search"></b-icon></b-button>
                </b-input-group-append>
                <b-input-group-append v-if="method === 'create'">
                  <b-button variant="outline-danger" @click="unselectPatient"><b-icon icon="backspace"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <b-card v-if="togglePSelect && method === 'create'" class="mt-2">
                <b-form-group
                  label-for="filter-patients"
                  class="mb-0"
                >
                  <b-input-group size="sm">
                    <b-form-input
                      id="filter-patients"
                      v-model="filterPatient"
                      type="search"
                      placeholder="Type to Search"
                    ></b-form-input>

                    <b-input-group-append>
                      <b-button :disabled="!filterPatient" @click="filterPatient = ''">Clear</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
                <b-table id="my-patients-table" :items="selectablePEntity" :fields="selectablePFields" small hover responsive selectable select-mode="single" @row-selected="selectableEntityPClicked" :current-page="currentPatientPage" :per-page="perPage" :filter="filterPatient" show-empty>
                  <template #empty="scope">
                    <h6 class="text-center">{{ scope.emptyText }}</h6>
                  </template>
                  <template #emptyfiltered="scope">
                    <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
                  </template>
                  <template #cell(selected)="data">
                    <template v-if="data.item.id == form.patientId">
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
                  v-model="currentPatientPage"
                  :total-rows="patientRows"
                  :per-page="perPage"
                  aria-controls="my-patients-table"
                  align="center"
                ></b-pagination>
              </b-card>
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
                :disabled="!fieldProperties('notes').editable"
                rows="3"
                max-rows="6"
                :state="observationNotesState"
                aria-describedby="input-ob-notes-feedback"
                placeholder="Enter notes"
              ></b-form-textarea>
              <b-form-invalid-feedback id="input-ob-notes-feedback">
                {{observationNotesErr}}
              </b-form-invalid-feedback>
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

          <b-tab title="Prescription" v-if="hasPrescription">
            <b-form-group id="input-group-start-date" label="Start Date:" label-for="input-start-date" label-class="font-weight-bold">
              <div class="d-flex flex-row flex-wrap">
                <div class="flex-grow-1 px-1 mb-2">
                  <b-form-datepicker
                    id="input-start-date"
                    v-model="form.prescription.start_date"
                    :disabled="!fieldProperties('prescriptionStartDate').editable"
                    :state="start_dateState"
                    hide-header
                    aria-describedby="input-startdate-feedback"
                  />
                  <b-form-invalid-feedback id="input-startdate-feedback">
                    {{startDateErr}}
                  </b-form-invalid-feedback>
                </div>
                <div class="flex-grow-1 px-1 mb-2">
                  <b-form-timepicker
                    id="timepicker-start-date"
                    v-model="start_date_time"
                    :disabled="!fieldProperties('prescriptionStartDate').editable"
                    :state="start_dateState"
                  />
                </div>
              </div>
            </b-form-group>
            <b-form-group id="input-group-end-date" label="End Date:" label-for="input-end-date" label-class="font-weight-bold">
              <div class="d-flex flex-row flex-wrap">
                <div class="flex-grow-1 px-1 mb-2">
                  <b-form-datepicker
                    id="input-end-date"
                    v-model="form.prescription.end_date"
                    :disabled="!fieldProperties('prescriptionEndDate').editable"
                    :state="end_dateState"
                    hide-header
                    aria-describedby="input-enddate-feedback"
                  />
                  <b-form-invalid-feedback id="input-enddate-feedback">
                    {{endDateErr}}
                  </b-form-invalid-feedback>
                </div>
                <div class="flex-grow-1 px-1 mb-2">
                  <b-form-timepicker
                    id="timepicker-end-date"
                    v-model="end_date_time"
                    :disabled="!fieldProperties('prescriptionEndDate').editable"
                    :state="end_dateState"
                  />
                </div>
              </div>
            </b-form-group>

            <b-form-group
              id="input-group-prescriptionNotes"
              label="Notes:"
              label-for="input-prescriptionNotes"
              label-class="font-weight-bold"
              v-if="fieldProperties('prescriptionNotes').visible"
            >
              <b-form-textarea
                id="input-prescriptionNotes"
                v-model="form.prescription.notes"
                placeholder="Enter notes"
                :disabled="!fieldProperties('prescriptionNotes').editable"
                :state="prescriptionNotesState"
                aria-describedby="input-presc-notes-feedback"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              <b-form-invalid-feedback id="input-presc-notes-feedback">
                {{prescriptionNotesErr}}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-tab>

          <b-tab title="Documents">
            <b-form-group
              id="input-group-files"
              label-for="input-files"
              label-class="font-weight-bold"
              v-if="fieldProperties('files').visible"
            >
              <b-form-file multiple v-model="form.documents">
              <template slot="file-name" slot-scope="{ names }">
                  <b-badge variant="dark">{{ names[0] }}</b-badge>
                  <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
                    + {{ names.length - 1 }} More files
                  </b-badge>
              </template>
              </b-form-file>
              <b-table
                v-if="documents.length && fieldProperties('filesTable').visible"
                striped
                over
                :items="documents"
                :fields="documentsFields"
                class="mt-3"
              >
                <template #cell(download)="row">
                  <b-btn
                    class="btn btn-outline-info"
                    variant="outline-info"
                    target="_blank"
                    @click.prevent="download(row.item)"
                    pill
                  >
                    <b-icon icon="download" />
                  </b-btn>
                </template>
                <template #cell(delete)="row">
                  <b-btn
                    class="btn btn-outline-danger"
                    variant="outline-danger"
                    target="_blank"
                    @click.prevent="deleteFile(row.item, row.index)"
                    pill
                  >
                    <b-icon icon="trash" />
                  </b-btn>
                </template>
              </b-table>
            </b-form-group>
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
  middleware: 'healthcareprofessional',
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
        documents: [],
        prescription: {
          id: null,
          start_date: null,
          end_date: null,
          notes: null
        },
      },

      startDateErr: '',
      endDateErr: '',
      prescriptionNotesErr: '',
      observationNotesErr: '',

      show: false,
      start_date_time: null,
      end_date_time: null,

      perPage: 4,

      currentPatientPage: 1,
      selectablePEntity: [],
      selectablePFields: [],
      togglePSelect: false,

      hasPrescription: false,

      documents: [],
      documentsFields: ['filename', 'download', 'delete'],
      clone: {},
      prescriptionClone: {},
      submitting: false,

      filterPatient: null
    }
  },
  computed: {
    patientRows() {
      return this.selectablePEntity.length
    },
    isPrescriptionFilled() {
      return this.form.prescription != null && this.form.prescription.notes != null && this.form.prescription.notes.trim().length > 0;
    },
    prescriptionNotesState() {
      if (this.method === 'create') return null
      if (this.form.prescription.notes == null || this.form.prescription.notes.trim().length === 0) {
        this.prescriptionNotesErr = "Prescription notes are required"
        return this.submitting ? false : null
      }
      return true
    },
    start_dateState(){
      if (this.isPrescriptionFilled && (this.form.prescription.start_date == null || this.form.prescription.start_date === '')) {
        this.startDateErr = "Start Date is required"
        return this.submitting ? false : null
      }
      if (this.getDateAndTimeSum(new Date(this.form.prescription.start_date), this.start_date_time) >= this.getDateAndTimeSum(new Date(this.form.prescription.end_date), this.end_date_time)) {
        this.startDateErr = "Start date should be lower then end date"
        return false
      }
      return true
    },
    end_dateState(){
      if (this.isPrescriptionFilled && (this.form.prescription.end_date == null || this.form.prescription.end_date === '')) {
        this.startDateErr = "End Date is required"
        return this.submitting ? false : null
      }
      if (this.getDateAndTimeSum(new Date(this.form.prescription.end_date), this.end_date_time) <= this.getDateAndTimeSum(new Date(this.form.prescription.start_date), this.start_date_time)) {
        this.endDateErr = "End date should be higher then start date"
        return false
      }
      return true
    },
    observationNotesState() {
      if (this.form.notes == null || this.form.notes.trim().length === 0) {
        this.observationNotesErr = "Observation notes are required"
        return this.submitting ? false : null
      }
      return true
    },
    patientState() {
      return this.form.patientId != null
    },
    isFormValid() {
      if (this.isPrescriptionFilled)
        return this.start_dateState && this.end_dateState && this.patientState && this.observationNotesState
      return this.patientState && this.observationNotesState
    }
  },
  mounted() {
    if (this.$auth.user.scope === 'HealthcareProfessional')
      this.$axios
        .$get('/api/patients')
        .then(patients => {
          this.selectablePEntity = patients
          this.selectablePFields = [
            {key: "selected", sortable: true},
            {key: "email", sortable: true},
            {key: "name", sortable: true},
            {key: "gender", sortable: true},
            {key: "healthNo", sortable: true},
          ]
          this.togglePSelect = false
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
    formatTime(dateStr) {
      if (dateStr == null || dateStr === '') return ''
      let date = new Date(dateStr)
      return date.toTimeString().split(' ')[0]
    },
    getDateAndTimeSum(date, timeString) {
      if (date == null || timeString == null || timeString === '' || date === '') return ''
      let timePieces = timeString.split(':');

      if (timePieces.length !== 3) return ''

      date.setHours(timePieces[0], timePieces[1], timePieces[2])

      return date
    },
    download (fileToDownload) {
      const documentId = fileToDownload.id
      this.$axios.$get('/api/documents/download/' + documentId, {
        responseType:
          'arraybuffer'
      })
        .then((file) => {
          const url = window.URL.createObjectURL(new Blob([file]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', fileToDownload.filename)
          document.body.appendChild(link)
          link.click()
        })
        .catch(() => {
          this.$toast.error('Sorry, could no download file!').goAway(3000)
        })
    },
    deleteFile (fileToDelete, index){
      const documentId = fileToDelete.id
      this.$axios.$delete('/api/documents/delete/' + documentId)
        .then(() => {
          if (index > -1)
            this.documents.splice(index, 1)
          this.$toast.success('File deleted!').goAway(3000)
        })
        .catch(() => {
          this.$toast.error('Sorry, could no delete file!').goAway(3000)
        })
    },
    selectableEntityPClicked(record){
      if (record[0]) {
        this.form.patientName = record[0].name
        this.form.patientId = record[0].id
        this.togglePSelect = false
      }
    },
    selectPatient(){
      this.togglePSelect = !this.togglePSelect;
    },
    unselectPatient(){
      this.form.patientName = null
      this.form.patientId = null
    },
    resetBtnPressed() {
      this.submitting = false
      this.form = Object.assign({}, this.clone)
      this.form.prescription = {...this.prescriptionClone}
    },
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      this.submitting = true
      if (!this.isFormValid) {
        this.showErrorMessage("Fix the errors before submitting")
        return;
      }

      if (this.isPrescriptionFilled) {
        this.form.prescription.start_date = this.getDateAndTimeSum(new Date(this.form.prescription.start_date), this.start_date_time)
        this.form.prescription.end_date = this.getDateAndTimeSum(new Date(this.form.prescription.end_date), this.end_date_time)
      }

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
          if (fieldName === 'patientId') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: false }
          if (fieldName === 'patientName') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: false }
          if (fieldName === 'files') return { visible: true, editable: false }
          if (fieldName === 'filesTable') return { visible: true, editable: false }
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
          if (fieldName === 'patientId') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: true }
          if (fieldName === 'patientName') return { visible: this.$auth.user.scope === 'HealthcareProfessional', editable: false }
          if (fieldName === 'files') return { visible: true, editable: false }
          if (fieldName === 'filesTable') return { visible: false, editable: false }
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
    start_date_time(newTime) {
      this.form.prescription.start_date = this.getDateAndTimeSum(new Date(this.form.prescription.start_date), newTime)
    },
    end_date_time(newTime) {
      this.form.prescription.end_date = this.getDateAndTimeSum(new Date(this.form.prescription.end_date), newTime)
    },
    entity(newEntity){
      if (newEntity != null) {
        this.submitting = false
        this.hasPrescription = false
        this.form.documents = []
        this.show = false
        if (this.method === 'edit') {
          this.$axios
            .$get('/api/observations/' + this.entity.id)
            .then(observation => {
              this.form.id = observation.id;
              this.form.healthcareProfessionalId = observation.healthcareProfessionalId;
              this.form.healthcareProfessionalName = observation.healthcareProfessionalName;
              this.form.patientId = observation.patientId;
              this.form.patientName = observation.patientName;
              this.documents = observation.documents || [];
              this.form.notes = observation.notes;
              this.form.created_at = this.formatDate(observation.created_at);
              this.show = true
              this.clone = Object.assign({}, this.form)

              if (observation.prescription == null)
                return;

              this.hasPrescription = true
              this.form.prescription.id = observation.prescription.id;
              this.form.prescription.start_date = observation.prescription.start_date;
              this.start_date_time = this.formatTime(observation.prescription.start_date);
              this.form.prescription.end_date = observation.prescription.end_date;
              this.end_date_time = this.formatTime(observation.prescription.end_date);
              this.form.prescription.notes = observation.prescription.notes;
              this.clone = Object.assign({}, this.form)
              this.prescriptionClone = {...this.form.prescription}
            })
            .catch((err) => {
              this.showErrorMessage(err);
              this.$refs.bvEntity.hide()
              this.show = true
            })
        } else {
          this.form.id = 0
          this.form.healthcareProfessionalId = 0
          this.form.healthcareProfessionalName = null
          this.form.patientId = null
          this.form.patientName = null
          this.form.notes = null
          this.form.created_at = null
          this.form.prescription.id = 0
          this.form.prescription.start_date = new Date()
          this.start_date_time = this.formatTime(this.form.prescription.start_date);
          this.form.prescription.end_date = new Date()
          this.form.prescription.end_date.setDate(this.form.prescription.end_date.getDate() + 1)
          this.form.prescription.notes = null
          this.end_date_time = this.formatTime(this.form.prescription.end_date)
          this.hasPrescription = true
          this.clone = Object.assign({}, this.form)
          this.prescriptionClone = {...this.form.prescription}
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
