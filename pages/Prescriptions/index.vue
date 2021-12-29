<template>
<div>
  <navbar />
  <b-container>
    <entities-table :items="prescriptions" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteEntity" />
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
      this.prescription = item;
      this.method = method;
    },
    getFormatedDate(dateString) {
      let date = new Date(dateString)
      return (date.toISOString().split('.')[0]).slice(0, -3).replace('T', ' ')
    },
    onSubmit(form, method){
      if (method === 'create') {
        form.healthcareProfessionalId = 4
        form.start_date = this.getFormatedDate(form.start_date)
        form.end_date = this.getFormatedDate(form.end_date)
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
          this.prescriptions=prescriptions.entities
          this.fields=prescriptions.columns

          this.fields.push("update")
          this.fields.push("delete")
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
    }
  }
}
</script>

<style>
</style>
