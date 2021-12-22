<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdata" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteAdmin"></entities-table>
  </b-container>
  <modalCRU :entity="oneBiometricData" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" :modalShow="modalShow"/>
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import modalCRU from '~/components/BiometricData/ModalCRU.vue'
import navbar from "../../components/NavBar.vue"
export default {
  components: {
    navbar,
    EntitiesTable,
    modalCRU,
  },
  data() {
    return {
      fields: [],
      biometricdata: [],
      oneBiometricData: {},
      method: '',
      modalShow: false,
    }
  },
  methods: {
    modalCRU(item, method){
      this.modalShow = true
      this.oneBiometricData = item;
      this.method = method;
    },
    onSubmit(form, method){
      console.log(form, method)
      if (method == 'create') {
        this.$axios
          .$post('/api/biometricdata', form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data '+form.username+' created').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            console.log(err);
          });
      } else {
        this.$axios
          .$put('/api/biometricdata/'+this.oneBiometricData.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data '+form.username+' updated').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            console.log(err);
          });
      }
      this.oneBiometricData = null;
    },
    resetEntity(){
      this.oneBiometricData = null;
    },
    list() {
      this.$axios
        .$get('/api/biometricdata')
        .then(biometricdata => {
          this.biometricdata=biometricdata.entities
          this.fields=biometricdata.columns

          this.fields.push("update")
          this.fields.push("delete")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteAdmin(username){
      this.$axios
        .$delete('/api/biometricdata/'+username)
          .then(() => {
            this.list()
            this.$toast.success('Biometric Data '+username+' deleted').goAway(3000);
          })
          .catch((err) => {
            console.log(err)
          })
    }
  },
  created(){
    this.list()
  }
}
</script>

<style>
</style>
