import useUser from "@libs/client/useUser";
import { Variants, motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import logo from "../public/image/logo.png";
import ProfileNav from "./ProfileNav";
import SearchIcon from "./SearchIcon";

interface LayoutProps {
  children: React.ReactNode;
}

const navItem = ["product", "community"];

const activeNavItem = ["product", "community", "profile", "favList"];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState(0);
  const [activeNav, setActiveNav] = useState(false);
  const [profileNav, setProfileNav] = useState(false);
  const { user } = useUser({ isPrivate: false });

  const handleSize = useCallback(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [handleSize]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  const onActive = () => {
    setActiveNav((prev) => !prev);
  };

  const onNavigate = (nav: string, username?: string) => {
    switch (nav) {
      case "product":
        router.push("/");
        break;
      case "community":
        router.push("/community");
        break;
      case "profile":
        router.push(`/users/${username}/profile`);
        break;
      case "favList":
        router.push(`/users/${username}/favList`);
      default:
        return;
    }
  };

  const navVariant: Variants = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        type: "linear",
      },
    },
    exit: {
      scaleY: 0,
    },
  };

  return (
    <section>
      <div className="p-4 m-auto">
        <nav className="fixed px-4 w-full right-0 flex justify-between items-center  bg-white">
          {windowSize > 768 ? (
            <>
              <div className="flex items-center space-x-6">
                <div className="relative w-20 h-20 mr-8">
                  <Image
                    src={logo}
                    layout="fill"
                    objectFit="cover"
                    alt="logo"
                  />
                </div>
                {navItem.map((nav, i) => (
                  <div key={i}>
                    <span
                      onClick={() => onNavigate(nav, user?.username)}
                      className="text-gray-400 cursor-pointer font-bold hover:text-gray-700 transition-all"
                    >
                      {nav}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <SearchIcon />

                <div className="w-8 h-8 relative">
                  <div
                    onClick={() => setProfileNav((prev) => !prev)}
                    className="w-full h-full rounded-full bg-slate-300 cursor-pointer"
                  />
                  <ProfileNav
                    profileNav={profileNav}
                    username={user?.username}
                  />
                </div>

                <div>
                  <button className="p-2 bg-pink-400 rounded-md text-white transition-all hover:bg-pink-600">
                    Upload
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-6 relative">
                <div className="relative w-20 h-20 mr-8">
                  <Image
                    src={logo}
                    layout="fill"
                    objectFit="cover"
                    alt="logo"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <SearchIcon />

                <div>
                  <svg
                    onClick={() => onActive()}
                    className="h-6 w-6 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <AnimatePresence>
                  {activeNav ? (
                    <motion.div
                      className="absolute flex flex-col justify-center w-full bg-gray-100 right-0 top-20 origin-top"
                      variants={navVariant}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {activeNavItem.map((nav, i) => (
                        <div className="flex items-center p-4" key={i}>
                          <span
                            className="cursor-pointer"
                            onClick={() => onNavigate(nav, user?.username)}
                          >
                            {nav}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </>
          )}
        </nav>

        <div className="mt-24 mb-20 w-full h-[1px] bg-gray-300" />
        <main
          onClick={() => {
            setActiveNav(false);
            setProfileNav(false);
          }}
          className="max-w-2xl m-auto min-h-screen"
        >
          {children}
        </main>
      </div>
    </section>
  );
};

export default Layout;
