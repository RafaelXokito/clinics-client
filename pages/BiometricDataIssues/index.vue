<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricDataIssues" :fields="fields" :ownModalCRU="true" :showEdit="true"  :busyTable="busyTable" :showRestore="true" @modal="modalCRU" @deleteEntity="deleteBioDataIssue" @restoreEntity="restoreBioDataIssue"></entities-table>
  </b-container>
  <modalCRU :entity="biometricDataIssue" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" :modalShow="modalShow"/>
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import modalCRU from '~/components/BiometricDataIssue/ModalCRU.vue'
import navbar from "../../components/NavBar.vue"
export default {
  middleware: ('auth','healthcareprofessional'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU
  },
  data() {
    return {
      fields: [],
      biometricDataIssues: [],
      biometricDataIssue: {},
      method: '',
      modalShow: false,
      busyTable: false
    }
  },
  created(){
    this.busyTable = true
    this.list();
  },
  mounted() {
    this.fields =
      [
        {key: "name", sortable: true},
        {key: "biometricDataTypeName", sortable: true}
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
      this.modalShow = true
      this.biometricDataIssue = item;
      this.method = method;
    },
    onSubmit(form, method){
      if (method === 'create') {
        this.$axios
          .$post('/api/biometricdataissues', form)
          .then((biometricDataIssue) => {
            this.list();
            this.$toast.success('Biometric Data Issue "'+biometricDataIssue.name+'" created').goAway(3000);
            this.modalShow = false
            this.biometricDataIssue = null;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        this.$axios
          .$put('/api/biometricdataissues/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data Issue "'+form.name+'" updated').goAway(3000);
            this.modalShow = false
            this.biometricDataIssue = null;
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
    },
    resetEntity(){
      this.biometricDataIssue = null;
    },
    list() {
      this.$axios
      .$get('/api/biometricdataissues?trashed=true')
      .then(biometricDataIssues => {
        this.biometricDataIssues = biometricDataIssues

        this.fields.push("update");
        this.fields.push("delete");
        this.busyTable = false
      })
      .catch((err)=>{
        this.showErrorMessage(err);
      });
    },
    deleteBioDataIssue(item){
      this.$axios
        .$delete('/api/biometricdataissues/'+item.id)
          .then(() => {
            this.list()
            this.$toast.success('Biometric Data Issue "'+item.name+'" deleted').goAway(3000);
          })
          .catch((err) => {
            this.showErrorMessage(err);
          })
    },
    restoreBioDataIssue(item){
      this.$axios
        .$post('/api/biometricdataissues/'+item.id+'/restore')
          .then(() => {
            this.list()
            this.$toast.success('Biometric Data Issue restored').goAway(3000);
          })
          .catch((err) => {
            this.showErrorMessage(err);
          })
    }
  },
}
</script>

<style>
</style>
