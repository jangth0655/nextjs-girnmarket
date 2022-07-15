import Layout from "@components/Layout";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";

const Profile: NextPage = () => {
  const { user } = useUser({ isPrivate: false });
  return (
    <Layout>
      <h1>Profile</h1>
    </Layout>
  );
};

export default Profile;
