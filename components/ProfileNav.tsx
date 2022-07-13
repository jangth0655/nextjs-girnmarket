import { useRouter } from "next/router";
import React from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

const profileNavItem = ["profile", "favList"];

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
    <AnimatePresence>
      {profileNav ? (
        <motion.div
          className="absolute bg-slate-200 top-10 py-2 px-4 space-y-2 rounded-md origin-top"
          variants={navVariant}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {profileNavItem.map((nav, i) => (
            <div key={i} className="cursor-pointer">
              <span onClick={() => onProfileAndFavList(nav, username)}>
                {nav}
              </span>
            </div>
          ))}
        </motion.div>
      ) : null}
      ;
    </AnimatePresence>
  );
};

export default ProfileNav;
