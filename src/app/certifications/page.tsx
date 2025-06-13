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

const CertificationsPage = async () => {
  const certifications = await getCertifications();

  if (certifications.length === 0) {
    return <div>No certifications found</div>;
  }

  return (
    <div className="space-y-4">
      <H1>Certifications</H1>
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
    </div>
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
          <Button>View Quizes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CertificationsPage;
