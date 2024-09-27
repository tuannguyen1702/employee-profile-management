export async function GET(request: Request) {
  const res = await fetch('http://localhost:3001/users', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  console.log(`request url`, request.headers.get('authorization'));
 
  return Response.json({ data })
}