import Input from "@components/Input";
import Layout from "@components/Layout";
import TextArea from "@components/TextArea";
import { NextPage } from "next";
import Image from "next/image";
import picture from "../../public/image/icons/picture.png";

const NewUpload: NextPage = () => {
  return (
    <Layout head="Upload" title="Product">
      <div className="max-w-4xl m-auto">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-3">
            What things do you selling?
          </h1>
          <h3 className="text-gray-500">Upload your product.</h3>
        </div>
        <div className="mt-16">
          <form className="h-[18rem] w-[60%] m-auto md:h-[24rem]">
            <label
              htmlFor="image"
              className="group flex w-full h-full cursor-pointer m-auto justify-center items-center hover:border-red-400 transition-all border-dashed border-2 rounded-lg"
            >
              <div className="w-24 h-24 relative transition-all group-hover:scale-110">
                <Image
                  src={picture}
                  layout="fill"
                  objectFit="cover"
                  alt="image"
                ></Image>
              </div>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </label>

            <div className="mt-8 space-y-6">
              <Input type="text" label="Name" id="name" placeholder="Name" />
              <Input
                type="number"
                label="Price"
                id="price"
                placeholder="Price"
              />
              <TextArea />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewUpload;
