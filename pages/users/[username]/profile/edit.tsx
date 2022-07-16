import Input from "@components/Input";
import Layout from "@components/Layout";
import SmallButton from "@components/SmallButton";
import { NextPage } from "next";

const EditProfile: NextPage = () => {
  return (
    <Layout head="Edit" title="Edit Profile">
      <div className="max-w-4xl m-auto border-2">
        <div className="space-y-20">
          <div className="flex items-center">
            <div className="relative mr-10 w-20 h-20">
              <div className="w-full h-full rounded-full bg-slate-500" />
            </div>
            <div className="flex w-[40%] h-10 space-x-6">
              <SmallButton text="Upload new picture" />
              <SmallButton text="Delete" />
            </div>
          </div>

          <div className="w-[100%] flex justify-center">
            <form className="w-[60%] space-y-6">
              <Input id="Name" label="Name" placeholder="name" type="text" />
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
