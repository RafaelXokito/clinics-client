<template>
  <div class="mt-3">
    <b-form-group>
      <b-button
        v-if="showCreate"
        variant="success"
        @click="showEntity(Object.assign({}, fields), 'create')"
        >Create
        {{ this.$route.name.replace(/([A-Z])/g, " $1").trim() }}</b-button
      >
    </b-form-group>
    <b-input-group>
      <b-input-group-prepend is-text>
        <b-icon icon="search"></b-icon>
      </b-input-group-prepend>
      <b-form-input v-model="searchIssue" />
    </b-input-group>
    <b-table striped hover responsive :items="items" :fields="fields" :filter="searchIssue" :busy="busyTable">
      <template #table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template #cell(created_at)="data">
        {{
          data.item.created_at != null
            ? new Date(data.item.created_at).toLocaleString('pt-PT')
            : "Not Shown"
        }}
      </template>
      <template #cell(updated_at)="data">
        {{
          data.item.updated_at != null
            ? new Date(data.item.updated_at).toLocaleString('pt-PT')
            : "Not Updated"
        }}
      </template>
      <template #cell(deleted_at)="data">
        {{
          data.item.deleted_at != null
            ? new Date(data.item.deleted_at).toLocaleString('pt-PT')
            : "Not Deleted"
        }}
      </template>
      <template #cell(start_date)="data">
        {{
          data.item.start_date != null
            ? new Date(data.item.start_date).toLocaleDateString("pt-PT")
            : "No Start"
        }}
      </template>
      <template #cell(end_date)="data">
        {{
          data.item.end_date != null
            ? new Date(data.item.end_date).toLocaleDateString("pt-PT")
            : "No End"
        }}
      </template>
      <template #cell(watch)="data">
        <b-button
          variant="primary"
          @click="showEntity(data.item, 'watch')"
          size="sm"
          class="mr-2"
          v-if="showWatch"
        >
          <b-icon-eyeglasses></b-icon-eyeglasses>
        </b-button>
      </template>
      <template #cell(update)="data">
        <b-button
          variant="primary"
          @click="showEntity(data.item, 'edit')"
          size="sm"
          class="mr-2"
          v-if="showEdit"
        >
          <b-icon-pencil-fill></b-icon-pencil-fill>
        </b-button>
      </template>
      <template #cell(delete)="data">
        <b-button
          variant="danger"
          @click="deleteEntity(data.item)"
          size="sm"
          class="mr-2"
          v-if="showDelete"
        >
          <b-icon-trash-fill></b-icon-trash-fill>
        </b-button>
      </template>
    </b-table>
    <modalCru :entity="entity" :method="method" @resetModal="resetEntity" />
  </div>
</template>

<script>
import modalCru from "~/components/ModalCRU.vue";
export default {
  components: {
    modalCru,
  },
  props: {
    items: Array,
    fields: Array,
    ownModalCRU: {
      type: Boolean,
      default: false,
    },
    showCreate: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showWatch: {
      type: Boolean,
      default: true
    },
    busyTable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      entity: {},
      method: "create",

      searchIssue: ''
    };
  },
  methods: {
    showEntity(item, method = "create") {
      if (this.ownModalCRU) {
        this.$emit("modal", item, method);
        return;
      }
      this.entity = item;
      this.method = method;
    },
    deleteEntity(item) {
      this.$emit("deleteEntity", item);
    },
    resetEntity() {
      this.entity = null;
    },
  },
};
</script>

<style></style>
