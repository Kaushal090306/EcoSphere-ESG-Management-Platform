import { getCarbonTransactions } from "@/actions/carbon-transactions";
import { getDepartments } from "@/actions/departments";
import { getEmissionFactors } from "@/actions/emission-factors";
import { TransactionsClient } from "./transactions-client";

export default async function CarbonTransactionsPage() {
  const [transactions, departments, emissionFactors] = await Promise.all([
    getCarbonTransactions(),
    getDepartments(),
    getEmissionFactors(),
  ]);

  return (
    <TransactionsClient
      transactions={transactions}
      departments={departments}
      emissionFactors={emissionFactors}
    />
  );
}
