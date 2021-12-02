<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="administrators" :fields="fields" :ownModalCRU="true" @modal="modalCRU" @deleteEntity="deleteAdmin"></entities-table>
  </b-container>
  <modalCRU :entity="administrator" :method="method" @onReset="resetEntity" @onSubmit="onSubmit" />
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import modalCRU from '~/components/Administrator/ModalCRU.vue'
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
      administrators: [],
      administrator: {},
      method: '',
    }
  },
  created(){
    this.list()
  },
  methods: {
    modalCRU(item, method){
      this.administrator = item;
      this.method = method;
    },
    onSubmit(form, method){
      if (method == 'create') {
        this.$axios
          .$post('/api/administrators', form)
          .then(() => {
            this.list();
          })
          .catch((err)=>{
            console.log(err);
          });
      } else {
        this.$axios
          .$put('/api/administrators/'+form.username, form)
          .then(() => {
            this.list();
          })
          .catch((err)=>{
            console.log(err);
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
          this.fields=administrators.columns

          this.fields.push("update")
          this.fields.push("delete")
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteAdmin(username){
      this.$axios
        .$delete('/api/administrators/'+username)
          .then(() => {
            this.list()
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
