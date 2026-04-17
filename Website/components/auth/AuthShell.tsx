import { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  sideTitle: string;
  sideLabel: string;
  sidePoints: string[];
  children: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  sideTitle,
  sideLabel,
  sidePoints,
  children
}: AuthShellProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-slate-200 shadow-float bg-white">
        <aside className="hidden md:flex flex-col justify-between bg-slate-900 p-8 text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-300">{sideLabel}</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">{sideTitle}</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-200">
            {sidePoints.map((point) => (
              <div key={point} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5">
                {point}
              </div>
            ))}
          </div>
        </aside>

        <section className="p-6 md:p-8">
          <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          {children}
        </section>
      </div>
    </div>
  );
}
