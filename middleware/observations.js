export default function ({ $auth, redirect }) {
  if (!($auth.user.scope === 'HealthcareProfessional' || $auth.user.scope === 'Patient')) {
    return redirect('/dashboard')
  }
}
