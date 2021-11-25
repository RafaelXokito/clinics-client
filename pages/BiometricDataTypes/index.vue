<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdatatype" :fields="fields"></entities-table>
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
      biometricdatatype: []
    }
  },
  created(){
    this.$axios
      .$get('/api/biometricdatatypes')
      .then(biometricdatatype => {
        this.biometricdatatype = biometricdatatype.entities
        this.fields = biometricdatatype.columns

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
