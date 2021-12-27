export default function ({ $auth, redirect }) {
  if (!($auth.user.scope === 'HealthcareProfessional' || $auth.user.scope === 'Administrator')) {
    return redirect('/dashboard')
  }
}
