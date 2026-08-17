import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { can, type Role } from '@/src/lib/permissions'

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

  // createServerClient ile getClaims() arasına başka kod eklenmemeli —
  // aksi halde yenilenen cookie supabaseResponse'a doğru şekilde yansımayabilir.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims ?? null

  const { pathname } = request.nextUrl
  const requiresSession = pathname.startsWith('/admin') || pathname.startsWith('/user')

  if (!claims && requiresSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  if (claims && pathname.startsWith('/admin')) {
    const role = (
      typeof claims.user_role === 'string' ? claims.user_role.trim().toLowerCase() : 'user'
    ) as Role

    const allowed = pathname.startsWith('/admin/users')
      ? can(role, 'users.view')
      : pathname.startsWith('/admin/rooms')
      ? can(role, 'rooms.view')
      : pathname.startsWith('/admin/reports')
      ? can(role, 'reports.view')
      : (role === 'superadmin' || role === 'manager') // /admin genel bakış

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
