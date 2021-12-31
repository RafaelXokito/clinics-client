<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricDatas" :fields="fields" :ownModalCRU="true" :busyTable="busyTable" @modal="modalCRU" @deleteEntity="deleteAdmin" />
  </b-container>
  <modalCRU :entity="biometricData" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" :modalShow="modalShow" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import modalCRU from '~/components/BiometricData/ModalCRU.vue'
import navbar from "../../components/NavBar.vue"

export default {
  middleware: ('auth', 'biometricdata'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU,
  },
  data() {
    return {
      fields: [],
      biometricDatas: [],
      biometricData: {},
      method: '',
      modalShow: false,
      busyTable: false
    }
  },
  mounted() {
    this.fields =
      [
        {key: "healthNo", sortable: true},
        {key: "biometricDataTypeName", sortable: true},
        {key: "value", sortable: true},
        {key: "valueUnit", sortable: true},
        {key: "created_at", sortable: true}
      ]

    if (this.$auth.user.scope !== 'HealthcareProfessional')
      this.fields = this.fields.slice(1)
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
    modalCRU(item, method){
      this.modalShow = true;
      this.biometricData = item;
      this.method = method;
    },
    getDateAndTimeSum(date, timeString) {
      if (date == null || timeString == null || timeString === '') return ''
      let timePieces = timeString.split(':');

      if (timePieces.length !== 3) return ''

      date.setHours(timePieces[0], timePieces[1], timePieces[2])

      return date
    },
    onSubmit(form, method){
      form.created_at = this.getDateAndTimeSum(new Date(form.created_at), form.created_at_time)

      if (method === 'importFile'){
        let formData = new FormData()

        if (form.file) {
          formData.append('file', form.file)
        }

        let promisse = this.$axios.$post('/api/biometricdata/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        promisse.then(() => {
          this.list();
          this.$toast.success('File imported!').goAway(3000)
        })
        promisse.catch(() => {
          this.$toast.error('Sorry, could no import that file!').goAway(3000)
        })

        this.modalShow = false
        this.biometricData = null;
      } else if (method === 'create') {
        this.$axios
          .$post('/api/biometricdata', form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data created').goAway(3000);
            this.modalShow = false
            this.biometricData = null;
          })
          .catch((err)=>{
            this.showErrorMessage(err)
          });
      } else {
        this.$axios
          .$put('/api/biometricdata/'+this.biometricData.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data updated').goAway(3000);
            this.modalShow = false
            this.biometricData = null;
          })
          .catch((err)=>{
            this.showErrorMessage(err)
          });
      }
    },
    resetEntity() {
      this.biometricData = null;
    },
    list() {
      this.$axios
        .$get('/api/biometricdata')
        .then(biometricDatas => {
          this.biometricDatas = biometricDatas

          this.fields.push("update")
          this.fields.push("delete")

          this.modalShow = false
          this.busyTable = false
        })
        .catch((err) => {
          this.showErrorMessage(err)
        })
    },
    deleteAdmin(item){
      this.$axios
        .$delete('/api/biometricdata/'+item.id)
          .then(() => {
            this.list()
            this.$toast.success('Biometric Data deleted').goAway(3000);
          })
          .catch((err) => {
            this.showErrorMessage(err)
          })
    }
  },
  created(){
    this.busyTable = true
    this.list()
  }
}
</script>

<style>
</style>
