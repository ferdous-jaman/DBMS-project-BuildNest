export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "৳0";
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Active: "bg-green-500/20 text-green-400 border border-green-500/30",
    "On Leave": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Present: "bg-green-500/20 text-green-400 border border-green-500/30",
    Absent: "bg-red-500/20 text-red-400 border border-red-500/30",
    Available: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    Sold: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    "Under Construction":
      "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    Paid: "bg-green-500/20 text-green-400 border border-green-500/30",
    Unpaid: "bg-red-500/20 text-red-400 border border-red-500/30",
    Resolved: "bg-green-500/20 text-green-400 border border-green-500/30",
    Unresolved: "bg-red-500/20 text-red-400 border border-red-500/30",
    Passed: "bg-green-500/20 text-green-400 border border-green-500/30",
    Failed: "bg-red-500/20 text-red-400 border border-red-500/30",
    Completed: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Terminated: "bg-red-500/20 text-red-400 border border-red-500/30",
    "In Use": "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    "Under Maintenance":
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    New: "bg-green-500/20 text-green-400 border border-green-500/30",
    Used: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };
  return (
    colors[status] || "bg-gray-500/20 text-gray-400 border border-gray-500/30"
  );
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
