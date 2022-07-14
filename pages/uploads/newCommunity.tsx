import EnterButton from "@components/enter/EnterButton";
import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";

import TextArea from "@components/TextArea";
import UploadImage from "@components/UploadImage";
import { NextPage } from "next";
import Image from "next/image";
import picture from "../../public/image/icons/picture.png";

const NewCommunity: NextPage = () => {
  return (
    <Layout head="Upload Community" title="Community">
      <div className="max-w-4xl m-auto">
        <PageTitle title="Talk together" subTitle="Let's get start" />
        <div className="mt-16">
          <form className="h-[18rem] w-[60%] m-auto md:h-[24rem] lg:w-[60%]">
            <UploadImage />
            <div className="mt-8 space-y-6">
              <TextArea label="Question" />
              <EnterButton text="Submit" />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewCommunity;
