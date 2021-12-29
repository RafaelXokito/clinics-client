<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdatatype" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteBioDataType"></entities-table>
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
      modalShow: false
    }
  },
  created(){
    this.list();
  },
  methods: {
    modalCRU(item, method){
      this.modalShow = true
      this.oneBiometricdatatype = item;
      this.method = method;
    },
    onSubmit(form, method){
      if (method == 'create') {
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
        this.biometricdatatype = biometricdatatype.entities
        this.fields = biometricdatatype.columns

        this.fields.push("update");
        this.fields.push("delete");
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
    }
  },

}
</script>

<style>
</style>
