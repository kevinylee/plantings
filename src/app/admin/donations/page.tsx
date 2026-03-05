import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// ensures fresh data in dev/prod
export const dynamic = "force-dynamic";

type DonationRow = Prisma.DonationGetPayload<{}>;

export default async function DonationsPage() {
  const donations: DonationRow[] = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Donations</h1>
        <p className="text-sm text-zinc-600">
          Showing the most recent {Math.min(donations.length, 5)} donation(s).
        </p>
      </header>

      {donations.length === 0 ? (
        <div className="rounded border p-4">
          <p>No donations yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Date</th>
                <th className="p-3 text-left text-sm font-semibold">Amount</th>
                <th className="p-3 text-left text-sm font-semibold">Email</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Session</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3 text-sm">
                    {new Date(d.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ${(d.amountTotal / 100).toFixed(2)} {d.currency.toUpperCase()}
                  </td>
                  <td className="p-3 text-sm">{d.donorEmail ?? "-"}</td>
                  <td className="p-3 text-sm">{d.status}</td>
                  <td className="p-3 text-sm font-mono text-xs">
                    {d.stripeCheckoutSessionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
