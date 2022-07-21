import EnterButton from "@components/enter/EnterButton";
import ErrorMessage from "@components/enter/ErrorMessage";
import Input from "@components/Input";
import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";
import UploadImage from "@components/UploadImage";
import { deleteImage } from "@libs/client/deleteImage";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { PostWithUserWithCount } from "pages/community";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface PostDetailResponse {
  ok: boolean;
  isLikePost: boolean;
  isMine: boolean;
  post: PostWithUserWithCount;
}

interface EditPost {
  image: FileList;
  question: string;
}

const EditPost: NextPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState("");
  const { data, error } = useSWR<PostDetailResponse>(
    router.query.postId ? `/api/posts/${router.query.postId}` : null
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditPost>();

  const [editPost, { data: EditData, loading: EditLoading }] = useMutation(
    router.query.postId ? `/api/posts/${router.query.postId}` : ""
  );

  const [deletePost, { data: DeletePostData }] = useMutation(
    router.query.postId ? `/api/posts/${router.query.postId}/remove` : ""
  );

  const onValid = async (formData: EditPost) => {
    if (EditLoading) return;
    if (formData && formData.image.length > 0) {
      deleteImage(data?.post.image || undefined);
      const { uploadURL } = await (await fetch(`/api/file`)).json();
      const form = new FormData();
      form.append(
        "file",
        formData.image[0],
        `${data?.post.user.username}_post`
      );
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editPost({ ...data, imageUrl: id });
    }
    editPost(formData);
  };

  const image = watch("image");
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (data && data.ok) {
      data.post.question && setValue("question", data.post.question);
      data.post.image && setPreview(deliveryFile(data.post.image));
    }
  }, [data, setValue]);

  useEffect(() => {
    if (DeletePostData && DeletePostData.ok) {
      router.push("/community");
    }
    if (EditData && EditData.ok && router.query.postId) {
      router.push(`/community/${router.query.postId}`);
    }
  }, [DeletePostData, EditData, router]);

  const onReset = () => {
    setPreview("");
  };

  const onDeletePost = () => {
    window.confirm("Really??!!");
    deletePost({});
  };

  return (
    <Layout title="Edit Post" head="Edit Post">
      <div className="max-w-4xl m-auto min-h-screen">
        <PageTitle title="Edit Post" />
        <div className="mt-16">
          <form
            onSubmit={handleSubmit(onValid)}
            className="h-[18rem] w-[60%] m-auto md:h-[24rem] lg:w-[60%]"
          >
            <div className="rounded-lg flex justify-end mb-2">
              <svg
                onClick={() => onDeletePost()}
                className="h-6 w-6 text-red-400 hover:text-red-600 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {preview ? (
              <label
                htmlFor="image"
                className="flex w-full h-full rounded-md relative cursor-pointer"
              >
                <Image
                  className="rounded-md"
                  src={preview}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                  priority
                />
                <input
                  {...register("image")}
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            ) : (
              <UploadImage register={register("image")} />
            )}
            <div
              onClick={() => onReset()}
              className="px-2 w-[20%] flex justify-center items-center rounded-md mt-2 bg-red-400 hover:bg-red-600 transition-all"
            >
              <button className="text-white">Reset</button>
            </div>

            <div className="space-y-6 mt-8 pb-6">
              <Input
                register={register("question", {
                  minLength: {
                    value: 2,
                    message: "Plz 2 more than",
                  },
                })}
                id="question"
                label="Question"
                placeholder="Question"
                type="text"
              />
            </div>
            <EnterButton text="Edit" loading={EditLoading} />
            {errors.question?.message && (
              <ErrorMessage errorText={errors.question.message} />
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default EditPost;
