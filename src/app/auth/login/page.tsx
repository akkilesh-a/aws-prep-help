import { LoginForm } from "@/components/auth";

export default function Page() {
  return (
    <div className="relative h-[calc(100vh-4.5rem)]">
      <RadialBackground />
      <div className="absolute inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

function RadialBackground() {
  return (
    <section className="relative flex flex-col justify-center items-center overflow-hidden dark:bg-black bg-white h-[calc(100vh-4.5rem)] py-20 px-4">
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
    </section>
  );
}
