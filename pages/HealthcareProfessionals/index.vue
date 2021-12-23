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
            this.$toast.success('Healthcare Professional created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.$toast.error(err).goAway(3000);
          });
      } else {
        this.$axios
          .$put('/api/healthcareprofessionals/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Healthcare Professional '+form.id+' updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.$toast.error(err).goAway(3000);
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
          this.$toast.error(err).goAway(3000);
        })
    },
    deleteEntity(entity){
      this.$axios
        .$delete('/api/healthcareprofessionals/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Healthcare Professional '+entity.id+' deleted').goAway(3000);
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
