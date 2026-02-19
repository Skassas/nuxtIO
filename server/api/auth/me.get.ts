export default defineEventHandler(async (event) => {
  const user = event.context.user
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  }
})
