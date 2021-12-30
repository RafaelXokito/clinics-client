<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="administrators" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteAdmin"></entities-table>
  </b-container>
  <modalCRU :entity="administrator" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" :modalShow="modalShow"/>
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import modalCRU from '~/components/Administrator/ModalCRU.vue'
import navbar from "../../components/NavBar.vue"

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
      administrators: [],
      administrator: {},
      method: '',
      modalShow: false,
    }
  },
  created(){
    this.list()
  },
  methods: {
    modalCRU(item, method){
      this.modalShow = true
      this.administrator = item;
      this.method = method;
    },
    onSubmit(form, method){
      if (method == 'create') {
        this.$axios
          .$post('/api/administrators', form)
          .then(() => {
            this.list();
            this.$toast.success('Administrator '+form.name+' created').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      } else {
        this.$axios
          .$put('/api/administrators/'+form.id, form)
          .then(() => {
            this.list();
            this.$toast.success('Administrator '+form.name+' updated').goAway(3000);
            this.modalShow = false
          })
          .catch((err)=>{
            this.showErrorMessage(err);
          });
      }
      this.administrator = null;
    },
    resetEntity(){
      this.administrator = null;
    },
    list() {
      this.$axios
        .$get('/api/administrators')
        .then(administrators => {
          this.administrators=administrators.entities
          //this.fields=administrators.columns
          for (let index = 0; index < administrators.columns.length; index++) {
            this.fields.push({key: administrators.columns[index], sortable: true})
          }
          this.fields.push("update")
          this.fields.push("delete")
        })
        .catch((err) => {
          this.showErrorMessage(err);
        })
    },
    deleteAdmin(item){
      this.$axios
        .$delete('/api/administrators/'+item.id)
          .then(() => {
            this.list()
            this.$toast.success('Administrator '+item.name+' deleted').goAway(3000);
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
