import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

type Translate = (key: string) => string;

type UiConfig = {
  translate: Translate;
};

const identity: Translate = (key) => key;

const UiConfigContext = createContext<UiConfig>({ translate: identity });

type UiConfigProviderProps = {
  translate?: Translate;
  children: ReactNode;
};

export const UiConfigProvider = ({
  translate = identity,
  children,
}: UiConfigProviderProps) => {
  const value = useMemo(() => ({ translate }), [translate]);

  return <UiConfigContext value={value}>{children}</UiConfigContext>;
};

export const useUiConfig = () => useContext(UiConfigContext);
export type { Translate, UiConfig };
