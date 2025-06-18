import { H1, P } from "@/components/typography";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Github, Home } from "lucide-react";
import Link from "next/link";

// Types
interface CreditItem {
  title: string;
  link: string;
}

// Individual Credit Card Component
function CreditCard({ credit }: { credit: CreditItem }) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl mb-2">{credit.title}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button variant="link" className="pt-2">
          <Link
            href={credit.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <P>View Source Repository</P>
            <Github className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Main Credits Page Component
export default function CreditsPage() {
  const credits: CreditItem[] = [
    {
      title: "AWS Certified Cloud Practitioner Practice Quizzes",
      link: "https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/tree/master/practice-exam",
    },
  ];

  return (
    <div className="px-16 py-8 space-y-8 max-w-7xl mx-auto">
      <H1>CREDITS</H1>

      {/* Credits List */}
      <div className="space-y-8">
        {credits.map((credit, index) => (
          <CreditCard key={index} credit={credit} />
        ))}
      </div>

      <Button variant="link" className="text-center mt-12">
        <Link href="/" className="flex items-center gap-2">
          ← Back to <Home className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
