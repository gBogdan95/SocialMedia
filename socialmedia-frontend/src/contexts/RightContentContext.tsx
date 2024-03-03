import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
} from "react";

interface RightContentContextType {
  content: ReactElement | null;
  setContent: (component: ReactElement) => void;
}

const RightContentContext = createContext<RightContentContextType>({
  content: null,
  setContent: () => {},
});

export const useRightContent = () => useContext(RightContentContext);

interface RightContentProviderProps {
  children: ReactNode;
}

export const RightContentProvider: React.FC<RightContentProviderProps> = ({
  children,
}) => {
  const [content, setContent] = useState<ReactElement | null>(null);

  return (
    <RightContentContext.Provider value={{ content, setContent }}>
      {children}
    </RightContentContext.Provider>
  );
};
