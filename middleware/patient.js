export default function ({ $auth, redirect }) {
  if (!($auth.user.scope === 'Patient')) {
    return redirect('/dashboard')
  }
}
