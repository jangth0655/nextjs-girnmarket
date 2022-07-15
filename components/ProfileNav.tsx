import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

const profileNavItem = ["profile", "favList", "logout"];

interface ProfileNavProps {
  username?: string;
  profileNav?: boolean;
}

interface LogoutResponse {
  ok: boolean;
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
      case "logout":
        onLogout();
      default:
        return;
    }
  };

  let response: LogoutResponse;
  const onLogout = async () => {
    response = await (await fetch(`/api/users/${username}/logout`)).json();
  };

  useEffect(() => {
    console.log(response);
    if (response && response.ok) {
      router.push("/enter");
    }
  }, [router]);

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
              key={i}
              className="cursor-pointer  w-full px-8 hover:text-gray-800 text-gray-400 transition-all"
            >
              <span
                className="hover:border-b-[1.5px] border-gray-500"
                onClick={() => onProfileAndFavList(nav, username)}
              >
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
