export default function ({ $auth, redirect }) {
  if (!($auth.user.scope === 'HealthcareProfessional')) {
    return redirect('/dashboard')
  }
}
