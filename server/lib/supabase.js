import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export function createClient(context, supabase_url, supabase_anon_key) {
  return createServerClient(supabase_url, supabase_anon_key, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.req.headers.cookie ?? "");
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          context.res.appendHeader(
            "Set-Cookie",
            serializeCookieHeader(name, value, options)
          )
        );
      },
    },
  });
}
