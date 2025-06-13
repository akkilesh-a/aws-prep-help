import { ModeToggle } from "@/components/theme";
import { H1 } from "@/components/typography";
import { redirect, RedirectType } from "next/navigation";

export default function Home() {
  redirect("/certifications", RedirectType.replace);
  return (
    <div>
      <H1>AWS Prep Help</H1>
      <ModeToggle />
    </div>
  );
}
