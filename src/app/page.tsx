import { H1, H2, P } from "@/components/typography";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import AnimatedText from "@/components/ui/animated-text";
import { getCertifications } from "@/lib";
import { CertificationConfig } from "@/types";
import { Brain, Zap, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Hero Section Component
function HeroSection({
  certifications,
  totalQuizzes,
}: {
  certifications: CertificationConfig[];
  totalQuizzes: number;
}) {
  return (
    <section className="relative flex flex-col justify-center items-center overflow-hidden dark:bg-black bg-white min-h-screen py-20 px-4">
      {/* Radial Rings Background */}
      {/* Orange Bubble 1 - Top Left */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-orange-400/40 to-orange-600/40 dark:from-orange-300/30 dark:to-orange-500/30 blur-3xl animate-float-slow top-0 left-0"></div>
      </div>

      {/* Blue Bubble - Top Right */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-600/30 to-blue-800/30 dark:from-blue-500/25 dark:to-blue-700/25 blur-3xl animate-float-medium top-0 right-0"></div>
      </div>

      {/* Orange Bubble 2 - Bottom Right */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-orange-500/35 to-orange-700/35 dark:from-orange-400/25 dark:to-orange-600/25 blur-3xl animate-float-medium bottom-0 right-0"></div>
      </div>

      {/* Orange Bubble 4 - Bottom Left */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-blue-600/30 to-blue-800/30 dark:from-blue-500/25 dark:to-blue-700/25 blur-3xl animate-float-slow bottom-0 left-0"></div>
      </div>

      {/* Orange Bubble 5 - Top Center */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-r from-orange-500/20 to-orange-700/20 dark:from-orange-400/10 dark:to-orange-600/10 blur-3xl animate-float-medium top-0 left-1/2"></div>
      </div>

      {/* Orange Bubble 6 - Center Right */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-r from-orange-400/30 to-orange-600/30 dark:from-orange-300/20 dark:to-orange-500/20 blur-3xl animate-float-fast top-1/2 right-0"></div>
      </div>

      {/* Orange Bubble 7 - Bottom Center */}
      <div className="absolute inset-0 flex">
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-orange-300/25 to-orange-500/25 dark:from-orange-200/15 dark:to-orange-400/15 blur-3xl animate-float-medium bottom-0 left-1/2"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto text-center relative ">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Image
            src="/logo.png"
            alt="AWS Prep Help"
            width={60}
            height={60}
            className="rounded-lg"
          />
          <H1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AWS Prep Help
          </H1>
        </div>

        <H2 className="text-2xl md:text-3xl font-semibold mb-6">
          Master AWS Certifications with AI-Powered Practice Quizzes
        </H2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" asChild className="text-lg px-8 py-3">
            <Link href="/certifications">
              Start Practicing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {certifications.length}
            </div>
            <P variant="muted">Certifications</P>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {totalQuizzes}
            </div>
            <P variant="muted">Practice Quizzes</P>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              AI-Powered
            </div>
            <P variant="muted">Explanations</P>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Explanations",
      description:
        "Get detailed explanations for every question using advanced AI technology. Understand not just what's correct, but why it's correct.",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description:
        "Receive immediate feedback on your answers with detailed explanations and performance tracking to identify areas for improvement.",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },

    {
      icon: Clock,
      title: "Flexible Learning",
      description:
        "Study at your own pace with 24/7 access to practice quizzes. Perfect for busy professionals and students.",
      bgColor: "bg-red-100 dark:bg-red-900",
      iconColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <section className="py-20 px-4 dark:bg-black bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <H2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose AWS Prep Help?
          </H2>
          <P className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform combines the best of traditional study methods with
            cutting-edge AI technology
          </P>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <P className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </P>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section className="flex flex-col gap-2 py-8 dark:bg-black bg-white  justify-center items-center text-center px-4 mx-auto">
      <AnimatedText className="!font-extrabold " text="AWSPREPHELP" />
      <div className="text-sm text-gray-500">
        Built with ❤️ by{" "}
        <Link
          href="https://www.linkedin.com/in/akkilesh-a-620561275/"
          className="text-blue-500"
        >
          Akkilesh A
        </Link>
      </div>
    </section>
  );
}

// Main Home Component
export default async function Home() {
  const certifications = await getCertifications();
  const totalQuizzes = certifications.reduce(
    (sum, cert) => sum + cert.quizes,
    0
  );

  return (
    <div className="min-h-screen">
      <HeroSection
        certifications={certifications}
        totalQuizzes={totalQuizzes}
      />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
