import { H1 } from "@/components/typography";
import { getCertifications } from "@/lib";
import React from "react";
import { PageWrapper } from "@/components/layout";
import { CertificationCard } from "./_components/certification-card";

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

export default CertificationsPage;
