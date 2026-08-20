import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminForm from "./AdminForm";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();

  // Redirect to sign in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="max-w-3xl mx-auto p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prepsact Admin CMS</h1>
          <p className="text-sm text-gray-500">Logged in as {session.user?.email || 'Admin'}</p>
        </div>
        <Link href="/" className="text-sm bg-gray-100 px-4 py-2 rounded font-medium hover:bg-gray-200">
          ← Back to Simulator
        </Link>
      </div>

      <AdminForm />
    </main>
  );
}
