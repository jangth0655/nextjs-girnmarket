import Layout from "@components/Layout";
import { NextPage } from "next";
import Image from "next/image";
import picture from "../../public/image/icons/picture.png";

const NewCommunity: NextPage = () => {
  return (
    <Layout head="Upload Community" title="Community">
      <h1>newCommunity</h1>
    </Layout>
  );
};

export default NewCommunity;
