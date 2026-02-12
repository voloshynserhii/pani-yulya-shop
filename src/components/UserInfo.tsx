export default function UserInfo({ email }: { email?: string }) {
  return (
    <div className="p-6 rounded-xl shadow-sm border border-zinc-200" style={{ backgroundColor: "var(--secondary)" }}>
      <h2 className="text-xl font-semibold mb-4">Мої дані</h2>
      <p className="text-zinc-600">Email: <span className="text-zinc-900 font-medium">{email}</span></p>
    </div>
  )
}
