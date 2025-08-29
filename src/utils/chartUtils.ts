export const computeWeeklyData = (transactions: any[], username: string) => {
  const data: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    if (!data[date]) data[date] = { income: 0, expense: 0 };

    const outgoingTypes = ["send_money", "withdraw", "cash_out"];
    const incomingTypes = ["cash_in", "add-money"];

    if (outgoingTypes.includes(tx.type)) {
      data[date].expense += tx.amount;
    } else if (incomingTypes.includes(tx.type)) {
      data[date].income += tx.amount;
    }
  });

  return Object.entries(data).map(([day, val]) => ({ name: day, ...val }));
};

export const computeExpenseData = (transactions: any[]) => {
  const categories: Record<string, number> = {};
  const outgoingTypes = ["send_money", "withdraw", "cash_out"];

  transactions.forEach((tx) => {
    if (outgoingTypes.includes(tx.type)) {
      const category = tx.type.replace("_", " ");
      categories[category] = (categories[category] || 0) + tx.amount;
    }
  });

  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};
