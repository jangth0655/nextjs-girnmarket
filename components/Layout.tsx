import { deliveryFile } from "@libs/client/deliveryImage";
import useUser from "@libs/client/useUser";
import {
  Variants,
  motion,
  AnimatePresence,
  useViewportScroll,
  useAnimation,
} from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../public/image/logo.png";
import NavTitle from "./NavTitle";
import ProfileNav from "./ProfileNav";
import SearchIcon from "./SearchIcon";

interface LayoutProps {
  children: React.ReactNode;
  head?: string;
  title?: string;
  showingSearchIcon?: boolean;
}

const navItem = [
  { name: "product", path: "/" },
  { name: "community", path: "/community" },
];

const scrollVariant: Variants = {
  top: {
    opacity: 0,
  },
  scroll: {
    opacity: 0.6,
  },
};

const Layout: React.FC<LayoutProps> = ({
  children,
  head,
  title,
  showingSearchIcon = true,
}) => {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState(0);
  const [activeNav, setActiveNav] = useState(false);
  const [profileNav, setProfileNav] = useState(false);
  const { user } = useUser({ isPrivate: false });
  const navRef = useRef<HTMLDivElement>(null);

  const scrollAnimation = useAnimation();
  const { scrollY } = useViewportScroll();

  const handleSize = useCallback(() => {
    setWindowSize(window.innerWidth);
  }, []);

  const activeNavItem = [
    "product",
    "community",
    "profile",
    "upload",
    user?.id ? "logout" : "login",
  ];

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

  const onLogout = async () => {
    await (await fetch(`/api/users/${user?.username}/logout`)).json();
    router.replace("/enter");
  };

  const onNavigate = (nav?: string, username?: string) => {
    switch (nav) {
      case "product":
        router.push("/");
        break;
      case "community":
        router.push("/community");
        break;
      case "profile":
        router.push(user?.id ? `/users/${username}/profile` : "/enter");
        break;
      case "upload":
        onUpload();
        break;
      case user?.id ? "logout" : "login":
        user?.id ? onLogout() : router.push(`/enter`);
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

  const onEnter = () => {
    router.push("/enter");
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

  const onTop = () => {
    navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() < window.innerHeight / 2) {
        scrollAnimation.start("top");
      } else {
        scrollAnimation.start("scroll");
      }
    });
  }, [scrollY, scrollAnimation]);

  return (
    <section>
      <Head>
        <title>{`${head} | grin`}</title>
      </Head>
      <div ref={navRef} className="p-4  mb-2">
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
                    priority
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
                {showingSearchIcon ? <SearchIcon /> : null}
                {user?.id ? (
                  <div
                    onClick={() => setProfileNav((prev) => !prev)}
                    className="w-8 h-8 relative cursor-pointer"
                  >
                    {user.avatar ? (
                      <>
                        <Image
                          src={deliveryFile(user.avatar)}
                          layout="fill"
                          objectFit="cover"
                          alt=""
                          className="rounded-full"
                          priority
                        />
                        <ProfileNav
                          profileNav={profileNav}
                          username={user?.username}
                        />
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full rounded-full bg-slate-300  relative flex justify-center items-center">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <ProfileNav
                          profileNav={profileNav}
                          username={user?.username}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div onClick={() => onEnter()}>
                    <button className="px-4 bg-pink-400 rounded-md text-white hover:bg-pink-600 transition-all">
                      Log In
                    </button>
                  </div>
                )}

                {user?.id && (
                  <div>
                    <button
                      onClick={() => onUpload()}
                      className="p-2 bg-pink-400 rounded-md text-white transition-all hover:bg-pink-600"
                    >
                      Upload
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-6 relative">
                <div className="relative w-16 h-16 mr-8">
                  <Image
                    onClick={() => onHome()}
                    src={logo}
                    layout="fill"
                    objectFit="cover"
                    alt="logo"
                    className="cursor-pointer"
                    priority
                  />
                </div>
              </div>

              <NavTitle title={title} />

              <div className="flex items-center space-x-4">
                {windowSize < 768 ? null : <SearchIcon />}

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
                        <div className="relative flex items-center p-4" key={i}>
                          <span
                            className="cursor-pointer text-gray-400 hover:text-gray-700 transition-all"
                            onClick={() => onNavigate(nav, user?.username)}
                          >
                            {nav}
                          </span>
                        </div>
                      ))}
                      <div className="h-8 w-[100%] pl-4 relative mt-4">
                        <SearchIcon active={true} />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </>
          )}
        </nav>

        <main
          onClick={() => {
            setActiveNav(false);
            setProfileNav(false);
          }}
          className="mb-4 min-h-screen"
        >
          <div className="mt-24 mb-8 w-7 h-7 border-2 rounded-md flex justify-center items-center border-slate-300 cursor-pointer">
            <svg
              onClick={() => goBack()}
              className="h-5 w-5 text-gray-400 hover:text-gray-700  transition-all cursor-pointer"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </div>

          {children}
          <motion.div
            variants={scrollVariant}
            initial="top"
            animate={scrollAnimation}
            onClick={onTop}
            className="fixed w-8 h-8 bg-pink-400 opacity-60 hover:opacity-100 transition-all bottom-2 right-4 rounded-full cursor-pointer"
          >
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </motion.div>
        </main>
      </div>
    </section>
  );
};

export default Layout;
