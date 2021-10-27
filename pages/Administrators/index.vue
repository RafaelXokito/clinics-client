<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="administrators" :fields="fields"></entities-table>
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
      administrators: []
    }
  },
  created(){
    this.$axios
      .$get('/api/administrators')
      .then(administrators => {
        this.administrators = administrators;
        for(var k in administrators[0])
          this.fields.push(k);

        this.fields.push("update");
        this.fields.push("delete");

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
