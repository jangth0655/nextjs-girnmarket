import useUser from "@libs/client/useUser";
import { Variants, motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import logo from "../public/image/logo.png";
import NavTitle from "./NavTitle";
import ProfileNav from "./ProfileNav";
import SearchIcon from "./SearchIcon";

interface LayoutProps {
  children: React.ReactNode;
  head?: string;
  title?: string;
}

const navItem = [
  { name: "product", path: "/" },
  { name: "community", path: "/community" },
];

const activeNavItem = ["product", "community", "profile", "favList", "upload"];

const Layout: React.FC<LayoutProps> = ({ children, head, title }) => {
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
      case "upload":
        onUpload();
        break;
      default:
        return;
    }
  };

  const onHome = () => {
    router.push("/");
  };

  const goBack = () => {
    router.back();
  };

  const onUpload = () => {
    const path = router.pathname;
    switch (path) {
      case "/":
        router.push("/uploads/newProduct");
        break;
      case "/community":
        router.push("/uploads/newCommunity");
        break;
      default:
        router.push("/");
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
      <Head>
        <title>{head}</title>
      </Head>
      <div className="p-4  mb-2">
        <nav className="fixed top-0 p-2 w-full right-0 flex justify-between items-center  bg-white border-b-2 z-20 border-gray-50 shadow-sm">
          {windowSize > 768 ? (
            <>
              <div className="flex items-center space-x-6">
                <div className="relative w-16 h-16 mr-8">
                  <Image
                    onClick={() => onHome()}
                    className="cursor-pointer"
                    src={logo}
                    layout="fill"
                    objectFit="cover"
                    alt="logo"
                  />
                </div>
                {navItem.map((nav, i) => (
                  <div key={i} className="relative">
                    <span
                      onClick={() => onNavigate(nav.name, user?.username)}
                      className="text-gray-400 cursor-pointer font-bold hover:text-gray-700 transition-all"
                    >
                      {nav.name}
                      {router.pathname === nav.path && (
                        <motion.span
                          className="w-2 h-2 rounded-full bg-red-500 absolute -bottom-2 left-0 right-0 m-auto"
                          layoutId="circle"
                        />
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <NavTitle title={title} />

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
                  <button
                    onClick={() => onUpload()}
                    className="p-2 bg-pink-400 rounded-md text-white transition-all hover:bg-pink-600"
                  >
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
                    onClick={() => onHome()}
                    src={logo}
                    layout="fill"
                    objectFit="cover"
                    alt="logo"
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <NavTitle title={title} />

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

        <div className="mb-32 w-12 border-2 rounded-md flex justify-center items-center border-slate-300">
          <svg
            onClick={() => goBack()}
            className="h-6 w-6 text-gray-400 hover:text-gray-700  transition-all cursor-pointer"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </div>
        <main
          onClick={() => {
            setActiveNav(false);
            setProfileNav(false);
          }}
          className="min-h-screen"
        >
          {children}
        </main>
      </div>
    </section>
  );
};

export default Layout;
