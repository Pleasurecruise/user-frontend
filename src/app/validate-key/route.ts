export async function POST(request: Request) {
  const formData = await request.formData()
  const key = formData.get('key')
  if (key === '123456') {
    return Response.redirect(new URL('/dashboard', request.url))
  } else {
    return Response.redirect(new URL('/login?has_error=1', request.url))
  }
}
