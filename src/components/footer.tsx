import { Versions } from "./version";

export function Footer() {
  const dateNow = new Date().getFullYear();

  return (
    <footer className="shadow-md w-full flex-shrink-0">
      <div className="grid grid-cols-2 items-center w-full mx-auto py-1.5 px-1 lg:px-6">
        <div />

        <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2">
          <p className="text-sm text-center">
            <strong>Check Operadora</strong> © {dateNow} Todos os direitos
            reservados
          </p>
        </div>

        <div className="flex ml-auto">
          <Versions />
        </div>
      </div>
    </footer>
  );
}
