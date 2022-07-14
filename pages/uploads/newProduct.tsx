import EnterButton from "@components/enter/EnterButton";
import Input from "@components/Input";
import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";

import TextArea from "@components/TextArea";
import UploadImage from "@components/UploadImage";
import { NextPage } from "next";
import Image from "next/image";
import picture from "../../public/image/icons/picture.png";

const NewProduct: NextPage = () => {
  return (
    <Layout head="Upload" title="Product">
      <div className="max-w-4xl m-auto">
        <PageTitle
          title="What things do you selling"
          subTitle="Upload your product"
        />
        <div className="mt-16">
          <form className="h-[18rem] w-[60%] m-auto md:h-[24rem] lg:w-[60%]">
            <UploadImage />
            <div className="mt-8 space-y-6 pb-2">
              <Input type="text" label="Name" id="name" placeholder="Name" />
              <Input
                type="number"
                label="Price"
                id="price"
                placeholder="Price"
              />
              <TextArea label="Description" />
              <EnterButton text="Submit" />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewProduct;
