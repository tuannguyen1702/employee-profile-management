import { environments } from "@/config";

const apiURL = environments.apiURL

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug
  const res = await fetch(`${apiURL}/${slug}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })
  const data = await res.json()
 
  return Response.json(data)
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug
  console.log(`slug`, slug);
  const { searchParams, pathname } = new URL(request.url)
  console.log(`searchParams`, searchParams, pathname)
  const res = await fetch(`${apiURL}/${slug}?_page=1&_per_page=2`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  console.log(`res`, res.status)
  const data = await res.json()
 
  return Response.json(data)
}
