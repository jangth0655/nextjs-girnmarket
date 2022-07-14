import Layout from "@components/Layout";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Community: NextPage = () => {
  const router = useRouter();

  return (
    <Layout>
      <h1>Community</h1>
    </Layout>
  );
};

export default Community;
