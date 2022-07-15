import EnterButton from "@components/enter/EnterButton";
import ErrorMessage from "@components/enter/ErrorMessage";
import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";

import TextArea from "@components/TextArea";
import UploadImage from "@components/UploadImage";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PostForm {
  question: string;
  image?: FileList;
  error?: string;
}

interface UploadCommunityMutation {
  ok: boolean;
}

const NewCommunity: NextPage = () => {
  const router = useRouter();
  const { user } = useUser({ isPrivate: true });
  const [preview, setPreview] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<PostForm>();

  const [createPost, { loading, data, error }] =
    useMutation<UploadCommunityMutation>("/api/posts");

  const onValid = async (data: PostForm) => {
    if (loading) return;
    console.log(data);
    if (data.image && data.image?.length > 0) {
      const { uploadURL } = await (await fetch("/api/file")).json();
      const form = new FormData();
      form.append("file", data.image[0], `${user?.username}_PostImage`);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      console.log(id);
      createPost({ ...data, imageId: id });
      if (error) {
        setError("error", { message: error });
      }
    }
    createPost(data);
    if (error) {
      setError("error", { message: error });
    }
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push("/community");
    }
  }, [data, router]);

  const image = watch("image");
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [image]);

  const errorString = errors.error?.message || errors.question?.message;
  return (
    <Layout head="Upload Community" title="Community">
      <div className="max-w-4xl m-auto">
        <PageTitle title="Talk together" subTitle="Let's get start" />
        <div className="mt-16">
          <form
            onSubmit={handleSubmit(onValid)}
            className="h-[18rem] w-[60%] m-auto md:h-[24rem] lg:w-[60%]"
          >
            {preview ? (
              <div className="relative w-full h-full rounded-md">
                <Image
                  className="rounded-md"
                  src={preview}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                />
              </div>
            ) : (
              <UploadImage register={register("image")} />
            )}
            <div className="mt-8 space-y-6">
              <TextArea
                register={register("question", {
                  required: "Question is required.",
                })}
                label="Question"
              />
              {errorString && <ErrorMessage errorText={errorString} />}
              <EnterButton text="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewCommunity;
