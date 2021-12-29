<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="healthcareProfessionals" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteEntity" />
  </b-container>
  <modalCRU :entity="healthcareProfessional" :method="method" :modalShow="modalShow" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
import modalCRU from "~/components/HealthcareProfessional/ModalCRU";

export default {
  middleware: ('auth','administrator'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU,
  },
  data() {
    return {
      fields: [],
      healthcareProfessionals: [],
      healthcareProfessional: {},
      method: '',
      modalShow: false,
    }
  },
  created(){
    this.list();
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
      this.healthcareProfessional = item;
      this.method = method;
    },
    getFormatedDate(dateString) {
      let date = new Date(dateString)
      return (date.toISOString().split('.')[0]).slice(0, -3).replace('T', ' ')
    },
    onSubmit(form, method){
      if (method === 'create') {
        form.created_by = 1
        this.$axios
          .$post('/api/healthcareprofessionals', form)
          .then(() => {
            this.list();
            this.$toast.success('Healthcare Professional '+form.name+' created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        this.$axios
          .$put('/api/healthcareprofessionals/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Healthcare Professional '+form.name+' updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
      this.healthcareProfessional = null;
    },
    resetEntity(){
      this.healthcareProfessional = null;
    },
    list() {
      this.$axios
        .$get('/api/healthcareprofessionals')
        .then(healthcareprofessionals => {
          this.healthcareProfessionals=healthcareprofessionals.entities
          this.fields=healthcareprofessionals.columns

          this.fields.push("update")
          this.fields.push("delete")
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    },
    deleteEntity(entity){
      this.$axios
        .$delete('/api/healthcareprofessionals/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Healthcare Professional '+entity.name+' deleted').goAway(3000);
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
