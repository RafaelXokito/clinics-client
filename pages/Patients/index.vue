<template>
<div>
  <navbar />
  <b-container>
    <entities-table :items="patients" :fields="fields" :ownModalCRU="true" :busyTable="busyTable" :showRestore="true" :showEdit="showEdit" @restoreEntity="restorePatient" @modal="modalCRU" @deleteEntity="deleteEntity" />
  </b-container>
  <modalCRU :entity="patient" :method="method" :modalShow="modalShow" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
import modalCRU from "~/components/Patient/ModalCRU";

export default {
  middleware: ('auth', 'patients'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU,
  },
  data() {
    return {
      fields: [],
      patients: [],
      patient: {},
      method: '',
      modalShow: false,
      busyTable: false
    }
  },
  computed: {
    showEdit(){
      return this.$auth.user.scope == 'Administrator' || this.$auth.user.scope == 'HealthcareProfessional'
    },
  },
  created(){
    this.busyTable = true
    this.list();
  },
  mounted() {
    this.fields =
      [
        {key: "email", sortable: true},
        {key: "name", sortable: true},
        {key: "gender", sortable: true},
        {key: "healthNo", sortable: true},
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
      this.patient = item;
      this.method = method;
    },
    getFormatedDate(dateString) {
      let date = new Date(dateString)
      return (date.toISOString().split('.')[0]).slice(0, -3).replace('T', ' ')
    },
    onSubmit(form, method){
      if (method === 'create') {
        form.created_by = 4 //substituir quando login nice
        this.$axios
          .$post('/api/patients', form)
          .then(() => {
            this.list();
            this.$toast.success('Patient '+form.name+' created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        this.$axios
          .$put('/api/patients/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Patient '+form.name+' updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
      this.patient = null;
    },
    resetEntity() {
      this.patient = null;
    },
    list() {
      this.$axios
        .$get('/api/patients')
        .then(patients => {
          this.patients=patients

          this.fields.push("update")
          if (this.$auth.user.scope === 'Administrator')
            this.fields.push("delete")

          this.busyTable = false
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    },
    deleteEntity(entity){
      this.$axios
        .$delete('/api/patients/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Patient '+entity.name+' deleted').goAway(3000);
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    },
    restorePatient(item){
      this.$axios
        .$post('/api/patients/'+item.id+'/restore')
          .then(() => {
            this.list()
            this.$toast.success('Patient '+item.name+' restored').goAway(3000);
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
