<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdata" :fields="fields"></entities-table>
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
      biometricdata: []
    }
  },
  created(){
    this.$axios
      .$get('/api/biometricdata')
      .then(biometricdata => {
        this.biometricdata = biometricdata;
        for(var k in biometricdata[0])
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
