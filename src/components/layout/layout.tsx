import { useLocation } from "react-router-dom";
import {Header} from "./header";
import {Footer} from "./footer";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
      <>
        {!isLanding && <Header />}
        {children}
        {!isLanding && <Footer />}
      </>
  );
};
