<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="patients" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteEntity"></entities-table>
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
        form.createdByUsername = 'bruna.leitao'
        this.$axios
          .$post('/api/patients', form)
          .then(() => {
            this.list();
            this.$toast.success('Patient created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            console.log(err);
          });
      } else {
        this.$axios
          .$put('/api/patients/'+form.username, form)
          .then(() => {
            this.list();
            this.$toast.success('Patient '+form.username+' updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            console.log(err);
          });
      }
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
          console.log(err)
        })
    },
    deleteEntity(username){
      this.$axios
        .$delete('/api/patients/'+username)
        .then(() => {
          this.list()
          this.$toast.success('Patient '+username+' deleted').goAway(3000);
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
</style>
