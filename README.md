<p align="center">
  <img src="public/logo.png" alt="AWS Prep Help Logo" width="120" />
</p>

<h1 align="center">AWS Prep Help</h1>

<p align="center">
  <b>Master AWS Certifications with AI-Powered Practice Quizzes</b>
</p>

## 🚀 Overview

AWS Prep Help is a modern web app designed to help you ace your AWS certifications. Practice with real exam-style questions and get instant, AI-powered explanations for every answer. Built for students, professionals, and anyone looking to level up their AWS skills.

## ✨ Features

- **AI-Powered Explanations:** Get detailed, context-aware explanations for every question using advanced AI (Google Gemini).
- **Instant Feedback:** See immediately if your answer is correct and understand why.
- **Flexible Learning:** Study at your own pace, anytime, anywhere.
- **Beautiful UI:** Responsive, animated, and easy to use.
- **Performance Tracking:** Identify strengths and areas for improvement.

## 📚 Supported Certifications

- **AWS Certified Cloud Practitioner**  
  23 full-length practice exams, hundreds of questions!

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Frontend:** [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **AI:** [Google Gemini](https://ai.google.dev/) via [ai-sdk](https://www.npmjs.com/package/ai)
- **Backend:** [Supabase](https://supabase.com/), [Redis](https://upstash.com/)
- **Type Checking:** [TypeScript](https://www.typescriptlang.org/)

## 🧠 How It Works

1. **Choose a Certification:** Start with AWS Certified Cloud Practitioner.
2. **Pick a Quiz:** Select from 23 practice exams.
3. **Answer Questions:** Get instant feedback after each question.
4. **AI Explanations:** Click "Get AI Explanation" to receive:
   - Why the answer is correct
   - Why other options are wrong
   - Additional AWS concepts
   - Best practices and recommendations
5. **Track Progress:** See your performance and focus on areas to improve.

## 🖥️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
npm start
```

## 📂 Project Structure

- `src/app/` — Next.js app directory (pages, API routes, UI)
- `src/data/` — Certification configs and quiz data
- `src/components/` — Reusable UI components
- `public/` — Static assets (logo, certification images)

## 🤖 AI Explanations

- Powered by Google Gemini (via API)
- Cached with Redis for speed and efficiency
- Explanations are concise, thorough, and focused on AWS best practices

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License.

<p align="center">
  Built with ❤️ by <a href="https://www.linkedin.com/in/akkilesh-a-620561275/">Akkilesh A</a>
</p>
