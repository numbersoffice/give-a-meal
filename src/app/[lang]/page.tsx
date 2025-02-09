"use client";

export default function Page() {
  return (
    <div>
      <h1>Cookie Test</h1>
      <p>This is a test page to set a cookie</p>
      <button onClick={() => fetch("/api/auth/test")}>Set Cookie</button>
    </div>
  );
}
