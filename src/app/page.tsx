import DifficultySelector from "@/components/DifficultySelector";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-gray-100">
          Memory Game
        </h1>
        <p className="text-xl text-gray-400">
          パネルが光る順番を覚えて、同じ順番でクリックしよう！
        </p>
      </div>
      <DifficultySelector />
    </div>
  );
}
