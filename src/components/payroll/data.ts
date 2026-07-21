export type PayrollRow = {
  name: string;
  role: string;
  gross: number;
  deductions: number;
  status: "Pending" | "Paid";
};

export const initialRun: PayrollRow[] = [
  { name: "Amara Osei", role: "CEO & Founder", gross: 12500, deductions: 3125, status: "Pending" },
  { name: "Priya Nair", role: "Head of Product", gross: 9800, deductions: 2450, status: "Pending" },
  { name: "Diego Fuentes", role: "Head of Engineering", gross: 10200, deductions: 2550, status: "Pending" },
  { name: "Wei Zhang", role: "Head of Design", gross: 8900, deductions: 2225, status: "Pending" },
  { name: "Sade Bello", role: "Head of Finance", gross: 8600, deductions: 2150, status: "Pending" },
  { name: "Jonas Weber", role: "Senior Engineer", gross: 7400, deductions: 1850, status: "Pending" },
];

export const payslipHistory = [
  { period: "July 2026", employees: 22, total: "$198,400.00", date: "Paid Jul 18, 2026" },
  { period: "June 2026", employees: 21, total: "$189,200.00", date: "Paid Jun 18, 2026" },
  { period: "May 2026", employees: 20, total: "$181,900.00", date: "Paid May 18, 2026" },
];
