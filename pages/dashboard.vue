<template>
<div>
<navbar/>
<b-container>
  <div class="row mt-3" v-if="$auth.user.scope === 'Administrator'">
    <div class="col-xl-6 col-lg-6 mt-3">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Administrators</h5>
              <span class="h2 font-weight-bold mb-0">{{statistics.totals.totalAdmin}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-danger text-white rounded-circle shadow">
                <b-icon icon="award"></b-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-lg-6 mt-3">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Healthcare Professionals</h5>
              <span class="h2 font-weight-bold mb-0">{{statistics.totals.totalHealthcareProfessionals}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-warning text-white rounded-circle shadow">
                <b-icon icon="shield-check"></b-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-lg-6 mt-3">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Patients</h5>
              <span class="h2 font-weight-bold mb-0">{{statistics.totals.totalPatients}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-success text-white rounded-circle shadow">
                <b-icon icon="people"></b-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-6 col-lg-6 mt-3">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Biometric Data Types</h5>
              <span class="h2 font-weight-bold mb-0">{{statistics.totals.totalBiometricDataTypes}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-info text-white rounded-circle shadow">
                <b-icon icon="box"></b-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row mt-3" v-if="$auth.user.scope === 'HealthcareProfessional'">
    <div class="col-xl-12">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Last Observation</h5>
              <span class="h3 font-weight-bold mb-0"><b-icon icon="person"></b-icon> {{statistics.observation.patientName}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-success text-white rounded-circle shadow" style="cursor: pointer;" v-b-modal.modalDocuments v-if="statistics.observation.nDocuments > 0">
                <b-icon icon="file-earmark-text"></b-icon>
              </div>
            </div>
          </div>
          <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" style="background-color: rgb(251, 251, 251);">
            <span class="text-success mr-2"><b-icon icon="book" /></span>
            <p class="mb-0">{{statistics.observation.notes}}</p>
          </div>
          <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" v-if="statistics.observation.hasPrescription" style="background-color: rgb(251, 251, 251);">
            <span class="text-success mr-2"><b-icon icon="shield-plus"></b-icon> Prescription</span>
            <p class="mt-3 text-center">
              {{formatDate(statistics.observation.prescription.start_date)}} to {{formatDate(statistics.observation.prescription.end_date)}}
            </p>
            <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" style="background-color: white">
              <span class="text-success mr-2"><b-icon icon="book" /></span>
              <p class="mb-0">{{statistics.observation.prescription.notes}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal id="modalDocuments" title="Documents" hide-footer>
      <b-table
        v-if="statistics.observation.nDocuments > 0"
        striped
        over
        :items="statistics.observation.documents"
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
    </b-modal>
  </div>
  <div class="row mt-3" v-if="$auth.user.scope === 'Patient'">
    <div class="col-xl-12" v-if="statistics.biometricData.id > 0">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body row">
          <div class="col-xl-6">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0">Last Biometric Data</h5>
                <span class="h3 font-weight-bold mb-0"><b-icon icon="tag"></b-icon> {{statistics.biometricData.biometricDataTypeName}}</span>
              </div>
            </div>
            <p class="mt-3 text-right">
              {{formatDate(statistics.biometricData.created_at)}}
            </p>
            <p class="mt-3 text-left mb-0">
              <span style="color: lightgrey">Value / Classification:</span>
            </p>
            <div class="row p-3" style="padding-top: 0px !important;">
              <div class="col-6 mt-3 mb-0 text-muted text-sm border rounded-left p-3 text-center" style="background-color: rgb(251, 251, 251);">
                <p class="mb-0">{{statistics.biometricData.value}} {{statistics.biometricData.valueUnit}}</p>
              </div>
              <div class="col-6 mt-3 mb-0 text-muted text-sm border rounded-right p-3 text-center" style="background-color: rgb(251, 251, 251);">
                <p class="mb-0">{{statistics.biometricData.biometricDataIssueName != null ? statistics.biometricData.biometricDataIssueName : 'N/A'}}</p>
              </div>
            </div>
            <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" style="background-color: rgb(251, 251, 251);">
              <span class="text-success mr-2"><b-icon icon="book" /></span>
              <p class="mb-0">{{statistics.biometricData.notes}}</p>
            </div>
            <p class="mt-3 text-right">
              <span style="color: lightgrey">Source:</span> {{statistics.biometricData.source}}
            </p>
          </div>
          <div class="col-xl-5">
            <line-chart :data="chartData" :options="options"></line-chart>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-12 mt-5" v-if="statistics.prescriptions.length > 0">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Active Prescriptions</h5>
            </div>
          </div>
          <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" v-for="prescription in statistics.prescriptions" :key="prescription.id" style="background-color: rgb(251, 251, 251);">
            <span class="text-success mr-2"><b-icon icon="shield-plus"></b-icon></span>
            Dr/Dra {{prescription.healthcareProfessionalName}}
            <p class="mt-3 text-center">
              {{formatDate(prescription.start_date)}} to {{formatDate(prescription.end_date)}}
            </p>
            <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" style="background-color: white">
              <span class="text-success mr-2"><b-icon icon="book" /></span>
              <p class="mb-0">{{prescription.notes}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-12 mt-5" v-if="statistics.healthcareProfessionals.length > 0">
      <div class="card card-stats mb-4 mb-xl-0">
        <div class="card-body">
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0">Your Healthcare Professionals</h5>
            </div>
          </div>
          <div class="mt-3 mb-0 text-muted text-sm border rounded p-3" v-for="healthcareProfessional in statistics.healthcareProfessionals" :key="healthcareProfessional.id" style="background-color: rgb(251, 251, 251);">
            <span><b-icon icon="shield-plus" class="text-success mr-2"></b-icon>Dr/Dra {{healthcareProfessional.name}}</span>
            <span class="float-right"><a :href="'mailto:'+healthcareProfessional.email">{{healthcareProfessional.email}}</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</b-container>
<footer style="height: 150px">
  <div class="mt-5 text-center">
    <p class="align-middle">Clinics designed and developed for school propose</p>
    <p class="align-middle">
      <a href="https://www.linkedin.com/in/rafaelmendespereira/">Rafael Pereira</a>,
      <a href="https://www.linkedin.com/in/bruna-leit%C3%A3o-13891a217/">Bruna Leitão</a>,
      <a href="https://www.linkedin.com/in/danielcarreira/">Daniel Carreira</a>,
    </p>
  </div>
</footer>
</div>
</template>

<script>
import navbar from '~/components/NavBar.vue'
import lineChart from '~/components/Charts/LineChart.vue'

export default {
  components: {
    navbar,
    lineChart
  },
  data() {
    return {
      statistics: {
        observation: {
          patientName: '',
          nDocuments: 0,
          hasPrescription: false,
          documents: [],
          created_at: '',
          prescription: {
            start_date: '',
            end_date: '',
            notes: ''
          },
        },
        prescription: {
          start_date: '',
          end_date: '',
          notes: ''
        },
        totals: {
          totalAdmin: 1,
          totalHealthcareProfessionals: 0,
          totalPatients: 0,
          totalBiometricDataTypes: 0
        },
        biometricData: {
          id: -1,
          biometricDataTypeId: '',
          value: '',
          notes: '',
          patientId: '',
          created_at: '',
          created_at_time: '',
          created_by: '',
          patientName: '',
          healthNo: '',
          biometricDataTypeName: '',
          valueUnit: '',
          source: '',
          biometricDataIssueId: '',
          biometricDataIssueName: '',
        },
        prescriptions: [],
        healthcareProfessionals: []
      },
      documentsFields: ['filename', 'download', 'delete'],

      chartData: {
        datasets: [{
          label: 'Title',
          data: [45, 55, 48, 35, 12]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart'
          }
        }
      },
    }
  },
  mounted(){
    this.$axios
      .$get('/api/statistics')
      .then((e) => {
        if (this.$auth.user.scope === 'HealthcareProfessional') {
          this.statistics.observation = e.observation
          this.statistics.observation.hasPrescription = e.observation.prescription.id > 0
          this.statistics.prescription = e.prescription
        }
        if (this.$auth.user.scope === 'Administrator') {
          this.statistics.totals = e;
        }
        if (this.$auth.user.scope === 'Patient') {

          this.statistics.biometricData = e.biometricData
          this.chartData.datasets = []

          this.statistics.prescriptions = e.prescriptions
          this.statistics.healthcareProfessionals = e.healthcareProfessionals

          let auxBioDataArray = e.biometricDatas.filter((aux) => aux.biometricDataTypeName == e.biometricData.biometricDataTypeName)
          let auxData = auxBioDataArray.map(function (obj) {
                    return obj.value;
                  })
          this.chartData.labels = auxBioDataArray.map(function (obj) {
                    return new Date(obj.created_at).toLocaleString('pt-PT')
                  })
          this.chartData.datasets.push({
            borderColor: 'rgb(75, 192, 192)',
            label: e.biometricData.biometricDataTypeName,
            data: auxData
          })
        }
      })
      .catch(()=>{
        this.$toast.error('Error loading statistics!').goAway(3000);
      });
  },
  methods: {
    formatDate(dateStr) {
      let date = new Date(dateStr)
      return date.toLocaleString('pt-PT')
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
            this.statistics.observation.documents.splice(index, 1)
          this.$toast.success('File deleted!').goAway(3000)
        })
        .catch(() => {
          this.$toast.error('Sorry, could no delete file!').goAway(3000)
        })
    },
  }
}
</script>

<style scoped>

h2,
h5,
.h2,
.h5 {
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: .5rem;
  color: #32325d;
}

h5,
.h5 {
  font-size: .8125rem;
}

@media (min-width: 992px) {

  .col-lg-6 {
    max-width: 50%;
    flex: 0 0 50%;
  }
}

@media (min-width: 1200px) {

  .col-xl-3 {
    max-width: 25%;
    flex: 0 0 25%;
  }

  .col-xl-6 {
    max-width: 50%;
    flex: 0 0 50%;
  }
}


.bg-danger {
  background-color: #f5365c !important;
}



@media (min-width: 1200px) {

  .justify-content-xl-between {
    justify-content: space-between !important;
  }
}


.pt-5 {
  padding-top: 3rem !important;
}

.pb-8 {
  padding-bottom: 8rem !important;
}

@media (min-width: 768px) {

  .pt-md-8 {
    padding-top: 8rem !important;
  }
}

@media (min-width: 1200px) {

  .mb-xl-0 {
    margin-bottom: 0 !important;
  }
}




.font-weight-bold {
  font-weight: 600 !important;
}


a.text-success:hover,
a.text-success:focus {
  color: #24a46d !important;
}

.text-warning {
  color: #fb6340 !important;
}

a.text-warning:hover,
a.text-warning:focus {
  color: #fa3a0e !important;
}

.text-danger {
  color: #f5365c !important;
}

a.text-danger:hover,
a.text-danger:focus {
  color: #ec0c38 !important;
}

.text-white {
  color: #fff !important;
}

a.text-white:hover,
a.text-white:focus {
  color: #e6e6e6 !important;
}

.text-muted {
  color: #8898aa !important;
}

@media print {
  *,
  *::before,
  *::after {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  a:not(.btn) {
    text-decoration: underline;
  }

  p,
  h2 {
    orphans: 3;
    widows: 3;
  }

  h2 {
    page-break-after: avoid;
  }

  @page {
    size: a3;
  }

  body {
    min-width: 992px !important;
  }
}

figcaption,
main {
  display: block;
}

main {
  overflow: hidden;
}

.bg-yellow {
  background-color: #ffd600 !important;
}

.icon {
  width: 3rem;
  height: 3rem;
}

.icon i {
  font-size: 2.25rem;
}

.icon-shape {
  display: inline-flex;
  padding: 12px;
  text-align: center;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}

footer {
  flex-shrink: 0;
	height: 50px;
  text-align: center;
}
</style>
