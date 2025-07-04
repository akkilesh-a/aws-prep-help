import { H1, P } from "@/components/typography";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getCertifications } from "@/lib";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/layout";

const CertificationsPage = async () => {
  const certifications = await getCertifications();

  if (certifications.length === 0) {
    return <div>No certifications found</div>;
  }

  return (
    <PageWrapper>
      <H1>CERTIFICATIONS</H1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((certification) => (
          <CertificationCard
            key={certification.name}
            name={certification.name}
            logo={certification.logo}
            quizes={certification.quizes}
          />
        ))}
      </div>
    </PageWrapper>
  );
};

const CertificationCard = ({
  name,
  logo,
  quizes,
}: {
  name: string;
  logo: string;
  quizes: number;
}) => {
  const imgURL = "/certifications/" + logo;
  const regex = / /g;
  const quizURL = `/${name.toLowerCase().replace(regex, "-")}/quizzes`;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Image
            src={imgURL}
            className="w-64"
            alt={name}
            width={100}
            height={100}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <P>Quizes: {quizes.toString()}</P>
          <Button asChild>
            <Link href={quizURL}>
              View Quizes
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CertificationsPage;
