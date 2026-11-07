export function BrandLogo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className={`brand-logo${tone === "dark" ? " is-dark" : ""}`}>
      <img
        src={tone === "dark" ? "/logo-mark-light.png" : "/logo-mark.png"}
        alt=""
        width="245"
        height="285"
      />
      <span className="brand-word">
        Taşeroncum<small>.com</small>
      </span>
    </span>
  );
}
