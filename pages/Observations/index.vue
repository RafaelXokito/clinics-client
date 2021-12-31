<template>
<div>
  <navbar />
  <b-container>
    <entities-table :items="observations" :fields="fields" :ownModalCRU="true" :showCreate="showCreate" :showEdit="showEdit" :showDelete="showDelete" :showWatch="showWatch" :busyTable="busyTable" @modal="modalCRU" @deleteEntity="deleteEntity" />
  </b-container>
  <modalCRU :entity="observation" :method="method" :modalShow="modalShow" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
import modalCRU from "~/components/Observation/ModalCRU";

export default {
  middleware: ('auth', 'observations'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU,
  },
  data() {
    return {
      fields: [],
      observations: [],
      observation: {},
      method: '',
      modalShow: false,
      busyTable: false
    }
  },
  created(){
    this.busyTable = true
    this.list();
  },
  computed: {
    showCreate() {
      return this.$auth.user.scope == 'HealthcareProfessional'
    },
    showEdit(){
      return this.$auth.user.scope == 'HealthcareProfessional'
    },
    showWatch(){
      return this.$auth.user.scope == 'Patient'
    },
    showDelete(){
      return this.$auth.user.scope == 'HealthcareProfessional'
    }
  },
  mounted() {
    this.fields =
      [
        {key: "healthcareProfessionalName", sortable: true},
        {key: "patientName", sortable: true},
        {key: "created_at", sortable: true},
      ]
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
      this.observation = item;
      this.method = method;
    },
    getFormatedDate(dateString) {
      let date = new Date(dateString)
      return (date.toISOString().split('.')[0]).slice(0, -3).replace('T', ' ')
    },
    onSubmit(form, method){
      if (method === 'create') {
        form.prescription.start_date = this.getFormatedDate(form.prescription.start_date)
        form.prescription.end_date = this.getFormatedDate(form.prescription.end_date)
        this.$axios
          .$post('/api/observations', form)
          .then((e) => {
            this.list();
            this.$toast.success('Observation created').goAway(3000);
            this.modalShow = false;
            form.documents.forEach(file => {

              let formData = new FormData()

              formData.append('id', e.id)

              if (file) {
                formData.append('file', file)
              }

              let promisse = this.$axios.$post('/api/documents/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              promisse.then(() => {
                this.$toast.success('File uploaded!').goAway(3000)
              })
              promisse.catch(() => {
                this.$toast.error('Sorry, could no upload file!').goAway(3000)
              })
            });
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        form.prescription.start_date = this.getFormatedDate(form.prescription.start_date)
        form.prescription.end_date = this.getFormatedDate(form.prescription.end_date)
        this.$axios
          .$put('/api/observations/'+form.id, form)
          .then((e) => {
            this.list();
            this.$toast.success('Observation updated').goAway(3000);
            this.modalShow = false;
            form.documents.forEach(file => {

              let formData = new FormData()

              formData.append('id', e.id)

              if (file) {
                formData.append('file', file)
              }

              let promisse = this.$axios.$post('/api/documents/upload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              promisse.then(() => {
                this.$toast.success('File uploaded!').goAway(3000)
              })
              promisse.catch(() => {
                this.$toast.error('Sorry, could no upload file!').goAway(3000)
              })
            });
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
      this.observation = null;
    },
    resetEntity(){
      this.observation = null;
    },
    list() {
      this.$axios
        .$get('/api/observations')
        .then(observations => {
          this.observations=observations

          if (this.showWatch)
            this.fields.push("watch")
          if (this.showEdit)
            this.fields.push("update")
          if (this.showDelete)
            this.fields.push("delete")

          this.busyTable = false
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    },
    deleteEntity(entity){
      this.$axios
        .$delete('/api/observations/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Observation deleted').goAway(3000);
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    }
  }
}
</script>

<style>
</style>
