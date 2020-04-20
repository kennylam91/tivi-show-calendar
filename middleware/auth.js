export default function({ store, error }) {
  if (!store.state.user.token) {
    error({
      message: 'You are not connected',
      statusCode: 403
    })
  }
}
