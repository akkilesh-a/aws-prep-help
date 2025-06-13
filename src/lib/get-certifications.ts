import { CertificationConfig } from "@/types";
import { promises as fs } from "fs";
import path from "path";

export const getCertifications = async () => {
  const certificationsFolder = path.join(process.cwd(), "src/data");
  const certifications = await fs.readdir(certificationsFolder);

  const certificationsData = await Promise.all(
    certifications.map(async (certification) => {
      const configFile = path.join(
        certificationsFolder,
        certification,
        "config.json"
      );
      const config = await fs.readFile(configFile, "utf-8");
      const fileData: CertificationConfig = JSON.parse(config);
      return fileData;
    })
  );

  return certificationsData;
};
