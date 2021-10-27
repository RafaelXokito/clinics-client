<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="prescriptions" :fields="fields"></entities-table>
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
      prescriptions: []
    }
  },
  created(){
    this.$axios
      .$get('/api/prescriptions')
      .then(prescriptions => {
        this.prescriptions = prescriptions;
        for(var k in prescriptions[0])
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
