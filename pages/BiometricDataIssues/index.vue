<template>
<div>
  <navbar/>
  <b-container>
    <entities-table :items="biometricdataissue" :fields="fields"></entities-table>
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
      biometricdataissue: []
    }
  },
  created(){
    this.$axios
      .$get('/api/biometricdataissues')
      .then(biometricdataissue => {
        this.biometricdataissue = biometricdataissue;
        for(var k in biometricdataissue[0])
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
