<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Observation '" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
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
                  placeholder="Enter Patient"
                  disabled
                  required
                ></b-form-input>
                <b-input-group-append v-if="method === 'create'">
                  <b-button variant="outline-info" @click="selectPatient"><b-icon icon="search"></b-icon></b-button>
                </b-input-group-append>
                <b-input-group-append v-if="method === 'create'">
                  <b-button variant="outline-danger" @click="unselectPatient"><b-icon icon="backspace"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <div v-if="togglePSelect && method === 'create'" class="pt-3">
                <b-table id="my-patients-table" :items="selectablePEntity" :fields="selectablePFields" small hover responsive selectable select-mode="single" @row-selected="selectableEntityPClicked" :current-page="currentPatientPage" :per-page="perPage">
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
                :disabled="!fieldProperties('notes').editable"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
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
              <b-form-textarea
                id="input-prescriptionNotes"
                v-model="form.prescription.notes"
                placeholder="Enter notes"
                :disabled="!fieldProperties('prescriptionNotes').editable"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
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
              <p v-else-if="fieldProperties('filesTable').visible" class="mt-2 ml-1">
                No documents.
              </p>
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
      show: true,

      perPage: 4,

      currentPatientPage: 1,
      selectablePEntity: [],
      selectablePFields: [],
      togglePSelect: false,

      hasPrescription: false,

      documents: [],
      documentsFields: ['filename', 'download', 'delete']
    }
  },
  computed: {
    patientRows() {
      return this.selectablePEntity.length
    },
  },
  mounted() {
    this.$axios
      .$get('/api/patients')
      .then(patients => {
        this.selectablePEntity = patients.entities
        this.selectablePFields = patients.columns
        this.toggleSelect = true
        this.selectablePFields.unshift("selected")
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
      }
    },
    selectPatient(){
      this.togglePSelect = !this.togglePSelect;
    },
    unselectPatient(){
      this.form.patientName = null
      this.form.patientId = null
    },
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
          if (fieldName === 'patientId') return { visible: true, editable: true }
          if (fieldName === 'patientName') return { visible: false, editable: false }
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
    entity(newEntity){
      if (newEntity != null) {
        this.hasPrescription = false
        this.form.documents = []
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
              if (observation.prescription == null) return; else this.hasPrescription = true
              this.form.prescription.id = observation.prescription.id;
              this.form.prescription.start_date = observation.prescription.start_date;
              this.form.prescription.end_date = observation.prescription.end_date;
              this.form.prescription.notes = observation.prescription.notes;
            })
            .catch((err) => {
              this.showErrorMessage(err);
            })
        } else {
          this.form.id = -1
          this.form.healthcareProfessionalId = -1
          this.form.healthcareProfessionalName = null
          this.form.patientId = null
          this.form.patientName = null
          this.form.notes = null
          this.form.created_at = null
          this.form.prescription.id = -1
          this.form.prescription.start_date = null
          this.form.prescription.end_date = null
          this.form.prescription.notes = null
          this.hasPrescription = true
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
