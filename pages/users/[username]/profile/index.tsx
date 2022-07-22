import Layout from "@components/Layout";
import { cls } from "@libs/client/cls";
import useUser from "@libs/client/useUser";
import { GetServerSideProps, NextPage, NextPageContext } from "next";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Record from "@components/userRecord/Record";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import { User } from "@prisma/client";
import { dateFormate } from "@libs/client/dateFormat";
import Image from "next/image";
import { deliveryFile } from "@libs/client/deliveryImage";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

const profileRecord = [
  { name: "Product", id: "product", isPrivate: false },
  { name: "Post", id: "post", isPrivate: false },
  { name: "About", id: "about", isPrivate: false },
  { name: "Like", id: "favList", isPrivate: true },
  { name: "Purchases", id: "purchase", isPrivate: true },
  { name: "Sales", id: "sale", isPrivate: true },
];

export type MarkType =
  | "product"
  | "post"
  | "favList"
  | "purchase"
  | "sale"
  | "about";

interface UserProfileResponse {
  ok: boolean;
  userProfile: User;
}

const Profile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser({ isPrivate: false });
  const [confirmUser, setConfirmUser] = useState(false);
  const { data, error } = useSWR<UserProfileResponse>(
    router.query.username && `/api/users/${router.query.username}`
  );

  const loading = !data && !error;

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

  const onEditProfile = (username?: string) => {
    if (!username) return;
    router.push(`/users/${username}/profile/edit`);
  };

  return (
    <Layout title="Profile" head="Profile" showingSearchIcon={false}>
      <div className="flex justify-center items-center space-x-8">
        {user?.avatar ? (
          <div className="relative w-36 h-36 rounded-full">
            <Image
              src={deliveryFile(user?.avatar)}
              layout="fill"
              objectFit="cover"
              alt=""
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="w-36 h-36 border-2 border-gray-400 rounded-full flex justify-center items-center">
            <svg
              className="h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        <div className="space-y-4">
          {loading ? (
            "Loading"
          ) : (
            <div className="flex flex-col justify-center items-center">
              <span className="font-bold text-2xl mb-2">
                {data?.userProfile?.username}
              </span>
              <span>{dateFormate(data?.userProfile?.createdAt)}</span>
            </div>
          )}
          {confirmUser && (
            <div onClick={() => onEditProfile(data?.userProfile?.username)}>
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
              ) : !item.isPrivate ? (
                <span
                  className="text-gray-400 hover:text-gray-800 cursor-pointer"
                  key={item.id}
                >
                  {item.name}
                </span>
              ) : (
                <span className="hidden"></span>
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
        {data?.userProfile?.username && (
          <Record mark={mark} username={data?.userProfile.username} />
        )}
      </section>
    </Layout>
  );
};

const Page: NextPage<{ existUser: User }> = ({ existUser }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": {
            ok: true,
            user: existUser,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = withSsrSession(
  async ({ req }: NextPageContext) => {
    const userProfile = await client.user.findUnique({
      where: {
        id: req?.session.user?.id,
      },
      select: {
        username: true,
        id: true,
        avatar: true,
        email: true,
        createdAt: true,
        bio: true,
        website: true,
      },
    });
    return {
      props: {
        userProfile: JSON.parse(JSON.stringify(userProfile)),
      },
    };
  }
);

export default Page;
