import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 md:pt-10">
        <div className="rounded-3xl border border-blue-100 bg-blue-50/70 px-5 md:px-7 py-6 md:py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Citizen Powered Platform</p>
            <h3 className="mt-1 text-xl md:text-2xl font-bold text-slate-900">Build stronger neighborhoods with verified local reporting.</h3>
          </div>
          <Link href="/create" className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700">
            Create a Civic Post
          </Link>
        </div>

        <div className="py-8 md:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold text-slate-900">CivicLens</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Local civic intelligence for citizens, journalists, and city teams.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">CL</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">CI</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">CV</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Platform</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="text-slate-600 hover:text-blue-700">Home</Link></li>
              <li><Link href="/explore" className="text-slate-600 hover:text-blue-700">Explore Feed</Link></li>
              <li><Link href="/create" className="text-slate-600 hover:text-blue-700">Create Post</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Account</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/login" className="text-slate-600 hover:text-blue-700">Login</Link></li>
              <li><Link href="/signup" className="text-slate-600 hover:text-blue-700">Sign Up</Link></li>
              <li><Link href="/profile" className="text-slate-600 hover:text-blue-700">Profile</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">Support</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Response tracking and visibility</li>
              <li>AI-assisted credibility indicators</li>
              <li>Clear escalation workflows</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CivicLens. All rights reserved.</p>
          <p>Built for transparent civic action.</p>
        </div>
      </div>
    </footer>
  );
}
