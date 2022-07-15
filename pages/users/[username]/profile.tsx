import Layout from "@components/Layout";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";

const profileRecord = [
  { name: "Product", id: "product", isPrivate: false },
  { name: "Post", id: "post", isPrivate: false },
  { name: "Like", id: "favList", isPrivate: true },
  { name: "Purchases", id: "purchase", isPrivate: true },
  { name: "Sales", id: "sale", isPrivate: true },
];

const Profile: NextPage = () => {
  const { user } = useUser({ isPrivate: false });
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
          {user?.id && (
            <div>
              <button className="p-2 font-bold  rounded-md bg-pink-300 text-white hover:bg-pink-600 transition-all">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-[50%]  items-center justify-between mt-24">
        {profileRecord.map((item) =>
          user?.id && item.isPrivate ? (
            <span
              className="text-gray-400 hover:text-gray-800 cursor-pointer"
              key={item.id}
            >
              {item.name}
            </span>
          ) : (
            <span
              className="text-gray-400 hover:text-gray-800 cursor-pointer"
              key={item.id}
            >
              {item.name}
            </span>
          )
        )}
      </div>
      <div className="mt-4 mb-10 w-full h-[1px] bg-gray-300" />
      <div></div>
    </Layout>
  );
};

export default Profile;
