<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdataissue" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteBioDataIssue"></entities-table>
  </b-container>
  <modalCRU :entity="oneBiometricdataissue" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" :modalShow="modalShow"/>
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
      biometricdataissue: [],
      oneBiometricdataissue: {},
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
      this.oneBiometricdataissue = item;
      this.method = method;
    },
    onSubmit(form, method){
      if (method == 'create') {
        this.$axios
          .$post('/api/biometricdataissues', form)
          .then((e) => {
            this.list();
            this.$toast.success('Biometric Data Issue "'+e.name+'" created').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            console.log(err);
          });
      } else {
        this.$axios
          .$put('/api/biometricdataissues/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Biometric Data Issue "'+form.name+'" updated').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            console.log(err);
          });
      }
      this.oneBiometricdataissue = null;
    },
    resetEntity(){
      this.oneBiometricdataissue = null;
    },
    list() {
      this.$axios
      .$get('/api/biometricdataissues')
      .then(biometricdataissue => {
        this.biometricdataissue = biometricdataissue.entities
        this.fields = biometricdataissue.columns

        this.fields.push("update");
        this.fields.push("delete");
      })
      .catch((err)=>{
        console.log(err);
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
            console.log(err)
          })
    }
  },
}
</script>

<style>
</style>
