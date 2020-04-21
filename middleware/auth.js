export default function({ store, error, redirect }) {
  if (!store.state.user.token) {
    // error({
    //   message: 'You are not connected',
    //   statusCode: 403
    // })
    return redirect('/')
  }
}
