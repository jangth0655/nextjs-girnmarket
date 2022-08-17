import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import useUser from "@libs/client/useUser";

const profileNavItem = ["profile", "logout"];

interface ProfileNavProps {
  username?: string;
  profileNav?: boolean;
}

const ProfileNav: React.FC<ProfileNavProps> = ({ username, profileNav }) => {
  const router = useRouter();

  const onProfileAndFavList = (nav: string, username?: string) => {
    switch (nav) {
      case "profile":
        router.push(`/users/${username}/profile`);
        break;
      case "logout":
        onLogout();
        break;
      default:
        return;
    }
  };

  const onLogout = async () => {
    await (await fetch(`/api/users/${username}/logout`)).json();
    router.replace("/enter");
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
    <AnimatePresence>
      {profileNav ? (
        <motion.div
          className="absolute left-2 bg-slate-200 top-10 py-4  space-y-2 rounded-full rounded-tl-none origin-top"
          variants={navVariant}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {profileNavItem.map((nav, i) => (
            <div
              onClick={() => onProfileAndFavList(nav, username)}
              key={i}
              className="cursor-pointer  w-full  hover:text-gray-800 text-gray-400 transition-all px-8"
            >
              {username ? (
                <span className="hover:border-b-[1.5px] border-gray-500 ">
                  {nav}
                </span>
              ) : (
                nav !== "logout" && (
                  <span className="hover:border-b-[1.5px] border-gray-500 ">
                    {nav}
                  </span>
                )
              )}
            </div>
          ))}
        </motion.div>
      ) : null}
      ;
    </AnimatePresence>
  );
};

export default ProfileNav;
