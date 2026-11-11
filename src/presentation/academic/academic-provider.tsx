import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import {
  createAcademicDependencies,
  type AcademicDependencies,
} from "@/core/di/academic-dependencies";

interface AcademicContextValue {
  dependencies: AcademicDependencies | null;
  configurationError: string | null;
}

const AcademicContext = createContext<AcademicContextValue | null>(null);

function initializeAcademic(): AcademicContextValue {
  try {
    return {
      dependencies: createAcademicDependencies(),
      configurationError: null,
    };
  } catch (error) {
    return {
      dependencies: null,
      configurationError:
        error instanceof Error ? error.message : "No se pudo inicializar el CRUD.",
    };
  }
}

export function AcademicProvider({ children }: PropsWithChildren) {
  const [value] = useState(initializeAcademic);
  return (
    <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>
  );
}

export function useAcademic(): AcademicContextValue {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademic debe utilizarse dentro de AcademicProvider.");
  }
  return context;
}
