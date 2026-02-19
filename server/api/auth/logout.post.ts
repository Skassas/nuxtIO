export default defineEventHandler(async (event) => {
  deleteCookie(event, 'pb_token', { path: '/' })
  return { message: 'Basariyla cikis yapildi' }
})
