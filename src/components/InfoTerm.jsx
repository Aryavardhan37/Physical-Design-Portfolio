import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function InfoTerm({ term, definition }) {
  const [show, setShow] = useState(false);
  const { isDark } = useTheme();

  return (
    <span
      className="relative cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)} // mobile
      style={{
        color: "#00f0ff",
        borderBottom: "1px dashed #00f0ff66",
        fontWeight: 500,
      }}
    >
      {term}

      {show && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-8 w-64 p-3 rounded-lg text-xs font-mono z-50"
          style={{
            background: isDark ? "rgba(10,10,20,0.95)" : "white",
            border: "1px solid rgba(0,240,255,0.2)",
            color: isDark ? "white" : "#111",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          {definition}
        </div>
      )}
    </span>
  );
}