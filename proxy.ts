import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Role } from '@/src/lib/permissions'
import { decodeJwtPayload } from '@/src/utils/jwt'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // createServerClient ile getUser() arasına başka kod eklenmemeli —
  // aksi halde yenilenen cookie supabaseResponse'a doğru şekilde yansımayabilir.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const requiresSession = pathname.startsWith('/admin') || pathname.startsWith('/user')

  if (!user && requiresSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const claims = session
      ? decodeJwtPayload<{ user_role?: string }>(session.access_token)
      : null
    const role = (claims?.user_role?.trim().toLowerCase() as Role) ?? 'user'

    const allowed = pathname.startsWith('/admin/users')
      ? can(role, 'users.view')
      : pathname.startsWith('/admin/rooms')
      ? can(role, 'rooms.view')
      : pathname.startsWith('/admin/reports')
      ? can(role, 'reports.view')
      : role === 'superadmin' // /admin genel bakış — app/admin/page.tsx'teki mevcut kontrolle aynı

    if (!allowed) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Yenilenen auth cookie'lerini taşıdığı için burada supabaseResponse aynen dönülmeli.
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
