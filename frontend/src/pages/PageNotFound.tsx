import { useMoveBack } from "../hooks/useMoveBack.tsx";

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-12">
      <div className="w-full max-w-384 rounded-xl border border-border bg-surface p-12 text-center">
        <h1 className="mb-8 text-2xl font-bold leading-tight text-text-primary">
          The page you are looking for could not be found 😢
        </h1>

        <button
          onClick={moveBack}
          className="
            rounded-lg
            bg-primary
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-primary/90
            focus:outline-none
            focus:ring-2
            focus:ring-primary/30
          "
        >
          &larr; Go back
        </button>
      </div>
    </main>
  );
}

export default PageNotFound;
