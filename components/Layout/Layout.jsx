import Head from "next/head";
import Sidebar from "./Sidebar";

export default function Layout({ title, eyebrow, actions, children }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} — Shama Fireworks Cash Portal` : "Shama Fireworks Cash Portal"}</title>
      </Head>
      <div className="sf-shell">
        <Sidebar />
        <main className="sf-main">
          <div className="sf-topbar">
            <div>
              <div className="sf-eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
            </div>
            {actions && <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
