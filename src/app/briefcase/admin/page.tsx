import type { Metadata } from "next";
import BriefcaseAdmin from "@/components/briefcase/BriefcaseAdmin";

export const metadata: Metadata = {
  title: "Portfolio Briefcase — owner",
  robots: { index: false, follow: false },
};

export default function BriefcaseAdminPage() {
  return <BriefcaseAdmin />;
}
