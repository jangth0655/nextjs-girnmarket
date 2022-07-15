import Layout from "@components/Layout";
import { cls } from "@libs/client/cls";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Record from "@components/userRecord/Record";
import { useRouter } from "next/router";
import useSWR from "swr";
import { User } from "@prisma/client";

const profileRecord = [
  { name: "Product", id: "product", isPrivate: false },
  { name: "Post", id: "post", isPrivate: false },
  { name: "Like", id: "favList", isPrivate: true },
  { name: "Purchases", id: "purchase", isPrivate: true },
  { name: "Sales", id: "sale", isPrivate: true },
];

export type MarkType = "product" | "post" | "favList" | "purchase" | "sale";

interface UserProfileResponse {
  ok: boolean;
  userProfile: User;
}

const Profile: NextPage = () => {
  const router = useRouter();
  const [confirmUser, setConfirmUser] = useState(false);
  const { data, error } = useSWR<UserProfileResponse>(
    router.query.username && `/api/users/${router.query.username}`
  );

  const { user } = useUser({ isPrivate: false });

  const [mark, setMark] = useState<MarkType>("product");

  const onRecord = (item: MarkType) => {
    setMark(item);
  };

  const profileUser = router.query.username && router.query.username;

  useEffect(() => {
    if (profileUser && user?.username !== profileUser) {
      setConfirmUser(false);
    } else {
      setConfirmUser(true);
    }
  }, [profileUser, user?.username]);

  return (
    <Layout title="Profile" head="Profile">
      <div className="flex justify-center items-center space-x-8">
        <div>
          <div className="w-36 h-36 rounded-full bg-slate-400" />
        </div>
        <div className="space-y-4">
          <div className="flex flex-col justify-center items-center">
            <span className="font-bold text-2xl">username</span>
            <span>date</span>
          </div>
          {confirmUser && (
            <div>
              <button className="p-2 font-bold  rounded-md bg-pink-300 text-white hover:bg-pink-600 transition-all">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <section
        className={cls(
          "flex w-[100%] md:w-[70%]  items-center justify-between mt-24",
          user?.id ? "" : "w-[20%]"
        )}
      >
        {profileUser ? (
          profileRecord.map((item) => (
            <div
              onClick={() => onRecord(item.id as any)}
              key={item.id}
              className="py-2 px-1 relative"
            >
              {confirmUser ? (
                <span className="text-gray-400 hover:text-gray-800 cursor-pointer ">
                  {item.name}
                </span>
              ) : (
                !item.isPrivate && (
                  <span
                    className="text-gray-400 hover:text-gray-800 cursor-pointer "
                    key={item.id}
                  >
                    {item.name}
                  </span>
                )
              )}
              {mark === item.id && (
                <motion.div
                  className="w-2 h-2 left-0 right-0 m-auto rounded-full absolute bg-pink-400"
                  layoutId="mark"
                />
              )}
            </div>
          ))
        ) : (
          <div>
            <span>Loading...</span>
          </div>
        )}
      </section>

      <div className="mt-4 mb-10 w-full h-[1px] bg-gray-300" />
      <section className="w-ful">
        {data?.userProfile.username && (
          <Record mark={mark} username={data?.userProfile.username} />
        )}
      </section>
    </Layout>
  );
};

export default Profile;
