export default function ({ $auth, redirect }) {
  if (!($auth.user.scope === 'Administrator')) {
    return redirect('/dashboard')
  }
}
