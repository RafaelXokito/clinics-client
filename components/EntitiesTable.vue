<template>
  <div class="mt-5">
    <b-form-group>
      <b-button
        variant="success"
        @click="showEntity(Object.assign({}, fields), 'create')"
        >Create
        {{ this.$route.name.replace(/([A-Z])/g, " $1").trim() }}</b-button
      >
    </b-form-group>
    <b-table striped hover responsive :items="items" :fields="fields">
      <template #cell(created_at)="data">
        {{
          data.item.created_at != null
            ? new Date(data.item.created_at).toLocaleDateString("pt-PT")
            : "Not Shown"
        }}
      </template>
      <template #cell(updated_at)="data">
        {{
          data.item.updated_at != null
            ? new Date(data.item.updated_at).toLocaleDateString("pt-PT")
            : "Not Updated"
        }}
      </template>
      <template #cell(deleted_at)="data">
        {{
          data.item.deleted_at != null
            ? new Date(data.item.deleted_at).toLocaleDateString("pt-PT")
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
      <template #cell(update)="data">
        <b-button
          variant="primary"
          @click="showEntity(data.item, 'edit')"
          size="sm"
          class="mr-2"
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
  },
  data() {
    return {
      entity: {},
      method: "create",
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
