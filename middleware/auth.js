export default function({ store, error, redirect }) {
  if (!store.state.user.token) {
    return redirect('/')
  }
}
