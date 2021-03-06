<template>
<div>
  <navbar />
  <b-container>
    <entities-table :items="prescriptions" :fields="fields" :ownModalCRU="true" :showCreate="showCreate" :showUpdateAndWatch="showUpdateAndWatch" :showDelete="showDelete" :showRestore="true" :showWatch="showWatch" :busyTable="busyTable" @modal="modalCRU" @restoreEntity="restorePrescription" @deleteEntity="deleteEntity" />
  </b-container>
  <modalCRU :entity="prescription" :method="method" :modalShow="modalShow" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
import modalCRU from "~/components/Prescription/ModalCRU";

export default {
  middleware: ('auth', 'prescriptions'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU,
  },
  data() {
    return {
      fields: [],
      prescriptions: [],
      prescription: {},
      method: '',
      modalShow: false,
      busyTable: false
    }
  },
  computed: {
    showCreate(){
      return this.$auth.user.scope == 'HealthcareProfessional'
    },
    showUpdateAndWatch(){
      return this.$auth.user.scope == 'HealthcareProfessional'
    },
    showWatch(){
      return this.$auth.user.scope == 'Patient'
    },
    showDelete(){
      return this.$auth.user.scope == 'HealthcareProfessional'
    }
  },
  created(){
    this.busyTable = true
    this.list();
  },
  mounted() {
    this.fields =
      [
        {key: "healthcareProfessionalName", sortable: true},
        {key: "start_date", sortable: true},
        {key: "end_date", sortable: true},
        {key: "isGlobal", sortable: true}
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
      this.prescription = item;
      this.method = method;
    },
    getFormatedDate(dateString) {
      let date = new Date(dateString)
      return (date.toISOString().split('.')[0]).slice(0, -3).replace('T', ' ')
    },
    onSubmit(form, method){
      if (method === 'create') {
        form.start_date = this.getFormatedDate(form.start_date)
        form.end_date = this.getFormatedDate(form.end_date)
        form.healthcareProfessionalId = this.$auth.user.id
        this.$axios
          .$post('/api/prescriptions', form)
          .then(() => {
            this.list();
            this.$toast.success('Prescription created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        form.start_date = this.getFormatedDate(form.start_date)
        form.end_date = this.getFormatedDate(form.end_date)
        this.$axios
          .$put('/api/prescriptions/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Prescription updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
      this.prescription = null;
    },
    resetEntity(){
      this.prescription = null;
    },
    list() {
      this.$axios
        .$get('/api/prescriptions')
        .then(prescriptions => {
          this.prescriptions=prescriptions

          if (this.showWatch)
            this.fields.push("watch")
          if (this.showUpdateAndWatch)
            this.fields.push("actions")
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
        .$delete('/api/prescriptions/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Prescription deleted').goAway(3000);
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    },
    restorePrescription(item){
      this.$axios
        .$post('/api/prescriptions/'+item.id+'/restore')
          .then(() => {
            this.list()
            this.$toast.success('Prescription restored').goAway(3000);
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
