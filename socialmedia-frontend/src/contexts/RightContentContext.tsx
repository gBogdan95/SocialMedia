import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ReactElement,
  useEffect,
} from "react";
import Home from "../pages/Home";
import Notifications from "../pages/Notifications";
import Messages from "../pages/Messages";

interface RightContentContextType {
  content: ReactElement | null;
  setContent: (component: ReactElement, identifier: string) => void;
}

const RightContentContext = createContext<RightContentContextType>({
  content: null,
  setContent: () => {},
});

export const useRightContent = () => useContext(RightContentContext);

interface RightContentProviderProps {
  children: ReactNode;
}

const defaultContentMap: { [key: string]: ReactElement } = {
  home: <Home />,
  notifications: <Notifications />,
  messages: <Messages />,
};

export const RightContentProvider: React.FC<RightContentProviderProps> = ({
  children,
}) => {
  const [content, setContent] = useState<ReactElement | null>(null);

  useEffect(() => {
    const defaultContentId =
      localStorage.getItem("defaultRightContent") || "home";
    const defaultContent =
      defaultContentMap[defaultContentId as keyof typeof defaultContentMap];
    if (defaultContent) {
      setContent(defaultContent);
    }
  }, []);

  const setAndPersistContent = (
    component: ReactElement,
    identifier: string
  ) => {
    setContent(component);
    localStorage.setItem("defaultRightContent", identifier);
  };

  return (
    <RightContentContext.Provider
      value={{ content, setContent: setAndPersistContent }}
    >
      {children}
    </RightContentContext.Provider>
  );
};
