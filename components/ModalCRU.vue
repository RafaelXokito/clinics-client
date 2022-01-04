<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="name" ref="bvEntity" @hide="resetModal">{{ entity }}</b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ""
    }
  },
  props:{
    entity:Object,
    method:String
  },
  methods: {
    resetModal(){
      this.$emit("resetModal")
    }
  },
  watch: {
    entity(newEntity, oldVar){
      if (newEntity != null) {

        if (newEntity["name"] != undefined) {
          this.name = newEntity["name"];
        }else{
          this.name = this.$route.name.replace(/([A-Z])/g, ' $1').trim()
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
