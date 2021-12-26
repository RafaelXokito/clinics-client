<template>
  <div>
    <b-modal id="bv-entity" size="lg" :title="method.charAt(0).toUpperCase() + method.slice(1) + ' Healthcare Professional'" ref="bvEntity" @hide="onReset" :hide-footer="true">
      <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show">
        <b-tabs content-class="p-2 pt-3">
          <b-tab title="Healthcare Professional" active>
            <b-form-group
              id="input-group-id"
              label="Id:"
              label-for="input-id"
              label-class="font-weight-bold"
              v-if="fieldProperties('id').visible"
            >
              <b-form-input
                id="input-id"
                v-model="form.id"
                :disabled="!fieldProperties('id').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-email"
              label="E-mail:"
              label-for="input-email"
              label-class="font-weight-bold"
              v-if="fieldProperties('email').visible"
            >
              <b-form-input
                id="input-email"
                v-model="form.email"
                :disabled="!fieldProperties('email').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-password"
              label="Password:"
              label-for="input-password"
              label-class="font-weight-bold"
              v-if="fieldProperties('password').visible"
            >
              <b-form-input
                id="input-password"
                v-model="form.password"
                type="password"
                :disabled="!fieldProperties('password').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-name"
              label="Name:"
              label-for="input-name"
              label-class="font-weight-bold"
              v-if="fieldProperties('name').visible"
            >
              <b-form-input
                id="input-name"
                v-model="form.name"
                :disabled="!fieldProperties('name').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-gender"
              label="Gender:"
              label-for="input-gender"
              label-class="font-weight-bold"
              v-if="fieldProperties('gender').visible"
            >
              <b-form-select
                id="input-gender"
                v-model="form.gender"
                :disabled="!fieldProperties('gender').editable"
                :options="genderValues"
                required
              />
            </b-form-group>
            <b-form-group
              id="input-group-specialty"
              label="Specialty:"
              label-for="input-specialty"
              label-class="font-weight-bold"
              v-if="fieldProperties('specialty').visible"
            >
              <b-form-input
                id="input-specialty"
                v-model="form.specialty"
                :disabled="!fieldProperties('specialty').editable"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-createdBy"
              label="Created by:"
              label-for="input-createdBy"
              label-class="font-weight-bold"
              v-if="fieldProperties('createdBy').visible"
            >
              <b-form-input
                id="input-createdBy"
                :value="form.created_by"
                disabled
              ></b-form-input>
            </b-form-group>
          </b-tab>

          <b-tab v-if="form.prescriptions && form.prescriptions.length > 0" title="Prescriptions">
            <b-table striped hover responsive :items="form.prescriptions" :fields="fieldsPrescriptions">
              <template #cell(start_date)="data">
                {{formatDate(data.item.start_date, false)}}
              </template>
              <template #cell(end_date)="data">
                {{formatDate(data.item.end_date, false)}}
              </template>
              <template #cell(isGlobal)="data">
                {{data.item.patientId === 0 ? 'Yes' : 'No'}}
              </template>
            </b-table>
          </b-tab>

          <b-tab v-if="form.observations && form.observations.length > 0" title="Observations">
            <b-table striped hover responsive :items="form.observations" :fields="fieldsObservations">
              <template #cell(created_at)="data">
                {{formatDate(data.item.created_at, true)}}
              </template>
            </b-table>
          </b-tab>

        </b-tabs>
        <b-button type="submit" variant="primary">{{this.method === 'create' ? 'Create' : 'Save'}}</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>

export default {
  props:{
    entity:Object,
    method:String,
    modalShow: Boolean,
  },
  data() {
    return {
      form: {
        id: null,
        email: null,
        password: null,
        name: null,
        gender: null,
        specialty: null,
        prescriptions: [],
        observations: [],
        createdBy: null,
      },
      show: true,
      fieldsPrescriptions: ["id", "healthcareProfessionalName", "start_date", "end_date", "isGlobal"],
      fieldsObservations: ["id", "healthcareProfessionalName", "patientName", "created_at"],
      genderValues: [
        { value: 'Male', text: 'Male' },
        { value: 'Female', text: 'Female' },
        { value: 'Other', text: 'Other' }
      ]
    }
  },
  methods: {
    formatDate(dateStr, isFull) {
      let date = new Date(dateStr)
      if (isFull)
        return date.toLocaleString('pt-PT')

      return date.toLocaleDateString('pt-PT')
    },
    onReset(){
      this.$emit("onReset")
    },
    onSubmit(){
      this.$emit("onSubmit", this.form, this.method)
    },
    fieldProperties(fieldName) {
      switch (this.method) {
        case 'edit':
          if (fieldName === 'id') return { visible: true, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'password') return { visible: false, editable: false }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'specialty') return { visible: true, editable: true }
          if (fieldName === 'prescriptions') return { visible: true, editable: false }
          if (fieldName === 'observations') return { visible: true, editable: false }
          if (fieldName === 'patients') return { visible: true, editable: false }
          if (fieldName === 'createdBy') return { visible: true, editable: false }
          break;
        case 'create':
          if (fieldName === 'id') return { visible: false, editable: false }
          if (fieldName === 'email') return { visible: true, editable: true }
          if (fieldName === 'password') return { visible: true, editable: true }
          if (fieldName === 'name') return { visible: true, editable: true }
          if (fieldName === 'gender') return { visible: true, editable: true }
          if (fieldName === 'specialty') return { visible: true, editable: true }
          if (fieldName === 'prescriptions') return { visible: false, editable: false }
          if (fieldName === 'observations') return { visible: false, editable: false }
          if (fieldName === 'patients') return { visible: false, editable: false }
          if (fieldName === 'createdBy') return { visible: false, editable: false }
          break;
        default: return { visible: true, editable: true }
      }
    },
  },
  watch: {
    modalShow(newVal){
      if (newVal === true) {
        this.$refs.bvEntity.show()
      }else{
        this.$refs.bvEntity.hide()
      }
    },
    entity(newEntity){
      if (newEntity != null) {
        if (this.method === 'edit') {
          this.$axios
            .$get('/api/healthcareprofessionals/' + this.entity.id)
            .then(healthcareProfessional => {
              this.form.id = healthcareProfessional.id;
              this.form.email = healthcareProfessional.email;
              this.form.name = healthcareProfessional.name;
              this.form.gender = healthcareProfessional.gender;
              this.form.specialty = healthcareProfessional.specialty;
              this.form.prescriptions = healthcareProfessional.prescriptions;
              this.form.observations = healthcareProfessional.observations;
              this.form.created_by = healthcareProfessional.created_by;
            })
            .catch((err) => {
              this.$toast.error(err).goAway(3000);
            })
        } else {
          this.form = {}
        }

        this.$refs.bvEntity.show()
      }
    }
  }
}
</script>

<style>

</style>
