export default function NavBar() {
  return (
    <nav className="bg-black text-white p-3 text-center space-x-6">
      <a href="/dashboard" className="font-bold">📊 Dashboard</a>
      <a href="/rapport" className="font-bold">📄 Dagrapport</a>
    </nav>
  );
}
