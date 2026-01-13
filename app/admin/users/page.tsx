import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { getAdminUsers } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate, getRoleLabel } from "@/lib/utils";
import { UserStatusToggle } from "@/components/admin/user-status-toggle";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { users, error } = await getAdminUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Admin Panel
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Kullanıcı Yönetimi</h1>
        <p className="text-muted">{users?.length || 0} kullanıcı bulundu</p>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">E-posta</th>
                    <th className="text-left p-4 font-medium">İsim/Firma</th>
                    <th className="text-left p-4 font-medium">Rol</th>
                    <th className="text-left p-4 font-medium">Durum</th>
                    <th className="text-left p-4 font-medium">Kayıt Tarihi</th>
                    <th className="text-left p-4 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        {user.companyProfile?.companyName ||
                          user.contractorProfile?.displayName ||
                          "-"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            user.role === "ADMIN"
                              ? "default"
                              : user.role === "FIRMA"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {getRoleLabel(user.role)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.isActive ? "success" : "destructive"}>
                          {user.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-4">
                        {user.role !== "ADMIN" && (
                          <UserStatusToggle
                            userId={user.id}
                            isActive={user.isActive}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
