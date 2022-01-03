<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdatatype" :fields="fields" :ownModalCRU="true" :busyTable="busyTable" :showRestore="true" @modal="modalCRU" @deleteEntity="deleteBioDataType" @restoreEntity="restoreBioDataType"></entities-table>
  </b-container>
  <modalCRU :entity="oneBiometricdatatype" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" :modalShow="modalShow"/>
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import modalCRU from '~/components/BiometricDataType/ModalCRU.vue'
import navbar from "../../components/NavBar.vue"
export default {
  middleware: ('auth','administrator'),
  components: {
    navbar,
    EntitiesTable,
    modalCRU
  },
  data() {
    return {
      fields: [],
      biometricdatatype: [],
      oneBiometricdatatype: {},
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
        {key: "unit", sortable: true},
        {key: "unit_name", sortable: true}
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
      this.oneBiometricdatatype = item;
      this.method = method;
    },
    onSubmit(form, method){
      if (method === 'create') {
        this.$axios
          .$post('/api/biometricdatatypes', form)
          .then((e) => {
            this.list();
            this.$toast.success('Biometric Data Type '+e.id+' created').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        this.$axios
          .$put('/api/biometricdatatypes/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data Type '+form.name+' updated').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
      this.oneBiometricdatatype = null;
    },
    resetEntity(){
      this.oneBiometricdatatype = null;
    },
    list() {
      this.$axios
      .$get('/api/biometricdatatypes')
      .then(biometricdatatype => {
        this.biometricdatatype = biometricdatatype

        this.fields.push("update");
        this.fields.push("delete");
        this.busyTable = false
      })
      .catch((err)=>{
        this.showErrorMessage(err);
      });
    },
    deleteBioDataType(item){
      this.$axios
        .$delete('/api/biometricdatatypes/'+item.id)
          .then(() => {
            this.list()
            this.$toast.success('Biometric Data Type '+item.name+' deleted').goAway(3000);
          })
          .catch((err) => {
            this.showErrorMessage(err);
          })
    },
    restoreBioDataType(item){
      this.$axios
        .$post('/api/biometricdatatypes/'+item.id+'/restore')
          .then(() => {
            this.list()
            this.$toast.success('Biometric Data '+item.name+' restored').goAway(3000);
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
