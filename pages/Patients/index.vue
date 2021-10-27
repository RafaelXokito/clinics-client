<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="patients" :fields="fields"></entities-table>
  </b-container>
</div>
</template>

<script>
import EntitiesTable from '~/components/EntitiesTable.vue'
import navbar from "../../components/NavBar.vue"
export default {
  components: {
    navbar,
    EntitiesTable
  },
  data() {
    return {
      fields: [],
      patients: []
    }
  },
  created(){
    this.$axios
      .$get('/api/patients')
      .then(patients => {
        this.patients = patients;
        for(var k in patients[0])
          this.fields.push(k);

        this.fields.push("update");
        this.fields.push("delete");
      })
      .catch((err)=>{
        console.log(err);
      });
  }
}
</script>

<style>
</style>
