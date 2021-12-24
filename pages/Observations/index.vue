<template>
<div>
  <navbar />
  <b-container>
    <entities-table :items="observations" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteEntity" />
  </b-container>
  <modalCRU :entity="observation" :method="method" :modalShow="modalShow" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
import modalCRU from "~/components/Observation/ModalCRU";

export default {
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
    }
  },
  created(){
    this.list();
  },
  methods: {
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
        form.healthcareProfessionalId = 4
        form.prescription.start_date = this.getFormatedDate(form.prescription.start_date)
        form.prescription.end_date = this.getFormatedDate(form.prescription.end_date)
        this.$axios
          .$post('/api/observations', form)
          .then(() => {
            this.list();
            this.$toast.success('Observation created').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.$toast.error(err).goAway(3000);
          });
      } else {
        form.prescription.start_date = this.getFormatedDate(form.prescription.start_date)
        form.prescription.end_date = this.getFormatedDate(form.prescription.end_date)
        this.$axios
          .$put('/api/observations/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Observation '+form.id+' updated').goAway(3000);
            this.modalShow = false;
          })
          .catch((err)=>{
            this.$toast.error(err).goAway(3000);
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
          this.observations=observations.entities
          this.fields=observations.columns

          this.fields.push("update")
          this.fields.push("delete")
        })
        .catch((err) => {
          this.$toast.error(err).goAway(3000);
        })
    },
    deleteEntity(entity){
      this.$axios
        .$delete('/api/observations/'+entity.id)
        .then(() => {
          this.list()
          this.$toast.success('Observation '+entity.id+' deleted').goAway(3000);
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
