import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      gap: "1.2rem",
    }}>
      <div style={{
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        fontSize: "clamp(4rem,14vw,9rem)",
        color: "var(--orange)",
        lineHeight: 1,
      }}>
        404
      </div>
      <p style={{ color: "var(--text-dim)", maxWidth: "40ch" }}>
        This circuit isn&apos;t connected. The page you&apos;re looking for
        doesn&apos;t exist.
      </p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
