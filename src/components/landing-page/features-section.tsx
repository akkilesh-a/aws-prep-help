"use client";

import { Brain, Clock, Zap } from "lucide-react";
import React from "react";
import { H2, P } from "../typography";
import { Card3DList, Card3DListProps } from "../ui";

function FeaturesSection() {
  const features: Card3DListProps["cards"] = [
    {
      id: "ai-powered-explanations",
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "AI-Powered Explanations",
      description:
        "Get detailed explanations for every question using advanced AI technology. Understand not just what's correct, but why it's correct.",
      theme: "warning",
    },
    {
      id: "instant-feedback",
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Instant Feedback",
      description:
        "Receive immediate feedback on your answers with detailed explanations and performance tracking to identify areas for improvement.",
      theme: "secondary",
    },
    {
      id: "flexible-learning",
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Flexible Learning",
      description:
        "Study at your own pace with 24/7 access to practice quizzes. Perfect for busy professionals and students.",
      theme: "neutral",
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

        <Card3DList
          cards={features.map((feature, index) => ({
            id: `feature-${index}`,
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            theme: feature.theme,
          }))}
          columns={3}
          variant="premium"
          animated={true}
        />
      </div>
    </section>
  );
}

export default FeaturesSection;
