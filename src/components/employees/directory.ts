export type Employee = {
  name: string;
  role: string;
  department: string;
  status: "Active" | "On leave" | "Onboarding";
  statusTag: string;
  start: string;
  location: string;
};

export const employees: Employee[] = [
  { name: "Amara Osei", role: "CEO & Founder", department: "Leadership", status: "Active", statusTag: "tag-neutral", start: "Jan 4, 2023", location: "New York, NY" },
  { name: "Priya Nair", role: "Head of Product", department: "Product", status: "Active", statusTag: "tag-neutral", start: "Mar 12, 2023", location: "Remote" },
  { name: "Diego Fuentes", role: "Head of Engineering", department: "Engineering", status: "Active", statusTag: "tag-neutral", start: "Feb 20, 2023", location: "Austin, TX" },
  { name: "Wei Zhang", role: "Head of Design", department: "Design", status: "Active", statusTag: "tag-neutral", start: "May 8, 2023", location: "Remote" },
  { name: "Sade Bello", role: "Head of Finance", department: "Finance & Ops", status: "Active", statusTag: "tag-neutral", start: "Apr 1, 2023", location: "Chicago, IL" },
  { name: "Jonas Weber", role: "Senior Engineer", department: "Engineering", status: "Active", statusTag: "tag-neutral", start: "Jun 15, 2023", location: "Remote" },
  { name: "Fatima Rahman", role: "Product Designer", department: "Design", status: "On leave", statusTag: "tag-outline", start: "Aug 3, 2023", location: "Remote" },
  { name: "Ola Martins", role: "Product Manager", department: "Product", status: "Active", statusTag: "tag-neutral", start: "Sep 18, 2023", location: "Lagos, NG" },
  { name: "Grace Liu", role: "Payroll Specialist", department: "Finance & Ops", status: "Active", statusTag: "tag-neutral", start: "Nov 2, 2023", location: "Remote" },
  { name: "D. Osei", role: "Senior Product Manager", department: "Product", status: "Onboarding", statusTag: "tag-accent", start: "Jul 21, 2026", location: "Remote" },
];

export const departments = [
  { name: "Product", head: "Priya Nair", initial: "P", count: 6 },
  { name: "Engineering", head: "Diego Fuentes", initial: "D", count: 9 },
  { name: "Design", head: "Wei Zhang", initial: "W", count: 4 },
  { name: "Finance & Ops", head: "Sade Bello", initial: "S", count: 3 },
];
