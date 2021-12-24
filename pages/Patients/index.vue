<template>
<div>
  <navbar />
  <b-container>
    <entities-table :items="patients" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteEntity" />
  </b-container>
  <modalCRU :entity="patient" :method="method" :modalShow="modalShow" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
import modalCRU from "~/components/Patient/ModalCRU";

export default {
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
    }
  },
  created(){
    this.list();
  },
  methods: {
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
            this.$toast.success('Patient created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.$toast.error(err).goAway(3000);
          });
      } else {
        this.$axios
          .$put('/api/patients/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Patient '+form.id+' updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.$toast.error(err).goAway(3000);
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
          this.patients=patients.entities
          this.fields=patients.columns

          this.fields.push("update")
          this.fields.push("delete")
        })
        .catch((err) => {
          this.$toast.error(err).goAway(3000);
        })
    },
    deleteEntity(entity){
      this.$axios
        .$delete('/api/patients/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Patient '+entity.id+' deleted').goAway(3000);
        })
        .catch((err) => {
          this.$toast.error(err).goAway(3000);
        })
    }
  }
}
</script>

<style>
</style>
