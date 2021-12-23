<template>
<div class="mt-5">
  <b-form-group>
    <b-button variant="success" @click="showEntity(Object.assign({},fields), 'create')">Create {{ this.$route.name.replace(/([A-Z])/g, ' $1').trim() }}</b-button>
  </b-form-group>
  <b-table striped hover responsive :items="items" :fields="fields" >
    <template #cell(created_at)="data">
      {{ data.item.deleted_at != null ? (new Date(data.item.created_at).getDate()) + "/" + (new Date(data.item.created_at).getMonth() + 1) + "/" + (new Date(data.item.created_at).getFullYear()) : 'Not Shown' }}
    </template>
    <template #cell(updated_at)="data">
      {{ data.item.deleted_at != null ? (new Date(data.item.updated_at).getDate()) + "/" + (new Date(data.item.updated_at).getMonth() + 1) + "/" + (new Date(data.item.updated_at).getFullYear()) : 'Not Updated' }}
    </template>
    <template #cell(deleted_at)="data">
      {{ data.item.deleted_at != null ? ((new Date(data.item.deleted_at).getDate()) + "/" + (new Date(data.item.deleted_at).getMonth() + 1) + "/" + (new Date(data.item.deleted_at).getFullYear())) : 'Not Deleted' }}
    </template>
    <template #cell(start_date)="data">
      {{ data.item.start_date != null ? ((new Date(data.item.start_date).getDate()) + "/" + (new Date(data.item.start_date).getMonth() + 1) + "/" + (new Date(data.item.start_date).getFullYear())) : 'Not Deleted' }}
    </template>
    <template #cell(end_date)="data">
      {{ data.item.end_date != null ? ((new Date(data.item.end_date).getDate()) + "/" + (new Date(data.item.end_date).getMonth() + 1) + "/" + (new Date(data.item.end_date).getFullYear())) : 'Not Deleted' }}
    </template>
    <template #cell(update)="data">
      <b-button variant="info" @click="showEntity(data.item, 'edit')" size="sm" class="mr-2">
        Update
      </b-button>
    </template>
    <template #cell(delete)="data">
      <b-button variant="danger" @click="deleteEntity(data.item)" size="sm" class="mr-2">
        Delete
      </b-button>
    </template>
  </b-table>
  <modalCru :entity="entity" :method="method" @resetModal="resetEntity"/>
</div>
</template>

<script>
import modalCru from '~/components/ModalCRU.vue'
export default {
  components: {
    modalCru
  },
  props: {
    items:Array,
    fields:Array,
    ownModalCRU: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      entity: {},
      method: 'create'
    }
  },
  methods: {
    showEntity(item, method = 'create'){
      if (this.ownModalCRU) {
        this.$emit('modal',item,method)
        return;
      }
      this.entity = item;
      this.method = method;
    },
    deleteEntity(item){
      this.$emit('deleteEntity',item)
    },
    resetEntity(){
      this.entity = null;
    }
  },
}
</script>

<style>

</style>
