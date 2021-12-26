<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="dashboard">
      <img src="https://www.sns.gov.pt/wp-content/uploads/2016/08/CHLeiria_logo.jpg" class="img-nav-brand" alt="Kitten">
      Clinics
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto text-center">
        <b-nav-item :class="this.$route.name == 'BiometricData' ? 'active' : ''" to="BiometricData">Biometric Data</b-nav-item>
        <b-nav-item :class="this.$route.name == 'BiometricDataIssues' ? 'active' : ''" to="BiometricDataIssues">Biometric Data Issues</b-nav-item>
        <b-nav-item :class="this.$route.name == 'BiometricDataTypes' ? 'active' : ''" to="BiometricDataTypes">Biometric Data Types</b-nav-item>
        <b-nav-item :class="this.$route.name == 'Prescriptions' ? 'active' : ''" to="Prescriptions">Prescriptions</b-nav-item>
        <b-nav-item :class="this.$route.name == 'Patients' ? 'active' : ''" to="Patients">Patients</b-nav-item>
        <b-nav-item :class="this.$route.name == 'Doctors' ? 'active' : ''" to="Doctors">Doctors</b-nav-item>
        <b-nav-item :class="this.$route.name == 'Administrators' ? 'active' : ''" to="Administrators">Administrators</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>{{currentUser.name}}</em>
          </template>
          <b-dropdown-item :class="this.$route.name == 'Profile' ? 'active' : ''" to="Profile">Profile</b-dropdown-item>
          <b-dropdown-item href="#" @click="logout">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
export default {
  computed: {
    currentUser(){
      return this.$auth.user
    }
  },
  methods: {
    async logout(){
      //this.$router.push({ name: 'index' })
      await this.$auth.logout()
      //this.$router.push('/')
      //await this.$auth.logout()

    }
  }
}
</script>

<style>
.img-nav-brand {
  height: 40px;
  width: 40px;
}
</style>
