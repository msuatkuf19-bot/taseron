import "./auth.css";
import { CheckCircle2 } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  aside,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  aside: { heading: string; points: string[] };
  children: React.ReactNode;
}) {
  return (
    <div className="auth">
      <div className="auth-grid">
        <aside className="auth-aside">
          <div className="auth-aside-inner">
            <img src="/logo-mark-light.png" alt="" width="64" height="74" className="auth-mark" />
            <p className="auth-aside-heading">{aside.heading}</p>
            <ul>
              {aside.points.map((p) => (
                <li key={p}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="auth-aside-foot">
              Kişisel verileriniz 6698 sayılı KVKK kapsamında işlenir ve korunur.
            </p>
          </div>
        </aside>
        <div className="auth-main">
          <div className="auth-card">
            <h1>{title}</h1>
            <p className="auth-sub">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
