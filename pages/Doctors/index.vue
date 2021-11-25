<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="doctors" :fields="fields"></entities-table>
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
      doctors: []
    }
  },
  created(){
    this.$axios
      .$get('/api/doctors')
      .then(doctors => {
        this.doctors = doctors.entities
        this.fields = doctors.columns

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
