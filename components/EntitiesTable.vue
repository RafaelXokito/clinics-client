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
      <b-button
        v-if="true"
        variant="warning"
        @click="download_table_as_csv('entityTable')"
        class="float-right"
        >
        <b-icon-download scale="0.75"></b-icon-download>
        Download table
        </b-button
      >
    </b-form-group>
    <b-input-group>
      <b-input-group-prepend is-text>
        <b-icon icon="search"></b-icon>
      </b-input-group-prepend>
      <b-form-input v-model="searchIssue" />
    </b-input-group>
    <b-table id="entityTable" striped hover responsive :items="items" :fields="fields" :filter="searchIssue" :busy="busyTable"  :tbody-tr-class="rowClass" show-empty :current-page="currentPage" :per-page="perPage">
      <template #table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template #empty="scope">
        <h6 class="text-center">{{ scope.emptyText }}</h6>
      </template>
      <template #emptyfiltered="scope">
        <h6 class="text-center">{{ scope.emptyFilteredText }}</h6>
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
      <template #cell(isGlobal)="data">
        <div class="text-center">
          <b-icon-people-fill v-if="data.item.isGlobal" scale="1.75" title="Yes"></b-icon-people-fill>
          <b-icon-person-fill v-else scale="1.75" title="No"></b-icon-person-fill>
        </div>
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
          v-if="showEdit && !(data.item.deleted_at && data.item.deleted_at !== null)"
        >
          <b-icon-pencil-fill></b-icon-pencil-fill>
        </b-button>
      </template>
      <template #cell(actions)="data">
        <b-button
          variant="primary"
          @click="showEntity(data.item, 'edit')"
          size="sm"
          class="mr-2"
          v-if="showUpdateAndWatch && !(data.item.deleted_at && data.item.deleted_at !== null) && (data.item.created_by && data.item.created_by === $auth.user.id)"
        >
          <b-icon-pencil-fill></b-icon-pencil-fill>
        </b-button>
        <b-button
          variant="primary"
          @click="showEntity(data.item, 'watch')"
          size="sm"
          class="mr-2"
          v-else-if="showUpdateAndWatch && !(data.item.deleted_at && data.item.deleted_at !== null)"
        >
          <b-icon-eyeglasses></b-icon-eyeglasses>
        </b-button>
      </template>
      <template #cell(delete)="data">
        <b-button
          variant="danger"
          @click="deleteEntity(data.item)"
          size="sm"
          class="mr-2"
          v-if="showDelete && !(data.item.deleted_at && data.item.deleted_at !== null) && !(showUpdateAndWatch && data.item.created_by && data.item.created_by !== $auth.user.id)"
        >
          <b-icon-trash-fill></b-icon-trash-fill>
        </b-button>
        <b-button
          variant="success"
          @click="restoreEntity(data.item)"
          size="sm"
          class="mr-2"
          v-else-if="showRestore && (data.item.deleted_at && data.item.deleted_at !== null) && !(showUpdateAndWatch && data.item.created_by && data.item.created_by !== $auth.user.id)"
        >
          <b-icon-shield-plus></b-icon-shield-plus>
        </b-button>
      </template>
    </b-table>
    <div class="row">
      <b-col md="4" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="4" class="my-1">
      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        class="my-0"
        ></b-pagination>
      </b-col>
      <b-col md="4" class="my-1 text-right">
        <h6>Total Rows: {{totalRows}}</h6>
      </b-col>
      </div>
    <modalCru :entity="entity" :method="method" @resetModal="resetEntity" />
    <footer class="myFooter" style="height: 150px">
      <div class="mt-5 text-center">
        <p class="align-middle">Clinics designed and developed for school propose</p>
        <p class="align-middle">
          <a href="https://www.linkedin.com/in/rafaelmendespereira/">Rafael Pereira</a>,
          <a href="https://www.linkedin.com/in/bruna-leit%C3%A3o-13891a217/">Bruna Leitão</a>,
          <a href="https://www.linkedin.com/in/danielcarreira/">Daniel Carreira</a>,
        </p>
      </div>
    </footer>
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
      default: false
    },
    showDelete: {
      type: Boolean,
      default: true
    },
    showRestore: {
      type: Boolean,
      default: true
    },
    showWatch: {
      type: Boolean,
      default: false
    },
    showUpdateAndWatch: { //Means the presence of created_by
      type: Boolean,
      default: false
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

      searchIssue: '',

      currentPage: 1,
      perPage: 15,
      pageOptions: [15, 30, 50]
    };
  },
  computed: {
    totalRows(){
      return this.items.length
    }
  },
  mounted() {
    this.pageOptions.push({ value: this.items.length, text: "Show all" })
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
    restoreEntity(item){
      this.$emit("restoreEntity", item);
    },
    resetEntity() {
      this.entity = null;
    },
    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (!item.deleted_at) return
      if (item.deleted_at !== null) return 'table-danger'
    },
    download_table_as_csv(table_id, separator = ';') {
      // Select rows from table_id
      var rows = document.querySelectorAll('table#' + table_id + ' tr');

      let sumIgnoredLastColumns = this.showDelete + this.showWatch + this.showEdit
      // Construct csv
      var csv = [];
      for (var i = 0; i < rows.length; i++) {
          var row = [], cols = rows[i].querySelectorAll('td, th');
          for (var j = 0; j < cols.length - sumIgnoredLastColumns; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
          }
          csv.push(row.join(separator));
      }
      var csv_string = csv.join('\n');
      // Download it
      var filename = 'export_' + this.$nuxt.$route.name + '_' + new Date().toLocaleDateString() + '.csv';
      var link = document.createElement('a');
      link.style.display = 'none';
      link.setAttribute('target', '_blank');
      link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
  },
};
</script>

<style>
footer {
  flex-shrink: 0;
	height: 50px;
  text-align: center;
}
</style>
