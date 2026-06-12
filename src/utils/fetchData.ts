export async function fetchData<T>(path: string): Promise<T> {
  const url = `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json()
}
