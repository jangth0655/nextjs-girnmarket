import EnterButton from "@components/enter/EnterButton";
import ErrorMessage from "@components/enter/ErrorMessage";
import Input from "@components/Input";
import Layout from "@components/Layout";
import SmallButton from "@components/SmallButton";
import TextArea from "@components/TextArea";
import { DeleteImage, deleteImage } from "@libs/client/deleteImage";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface EditForm {
  username: string;
  image?: FileList;
  email: string;
  bio?: string;
  website?: string;
  error?: string;
}

interface EditMutation {
  ok: boolean;
}

interface DeleteMutationResponse {
  ok: boolean;
}

const EditProfile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser({ isPrivate: true });
  const [preview, setPreview] = useState("");
  const [stopDelete, setStopDelete] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [edit, { loading, data, error }] =
    useMutation<EditMutation>(`/api/users/me/edit`);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    watch,
  } = useForm<EditForm>();

  const onValid = async (data: EditForm) => {
    if (loading) return;
    if (data.image && data?.image.length > 0) {
      const { uploadURL } = await (await fetch("/api/file")).json();
      const form = new FormData();
      form.append("file", data?.image[0], `${user?.username}_avatar`);

      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      edit({ ...data, avatarId: id });
      if (error) {
        setError("error", { message: error });
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
    edit(data);
    if (error) {
      setError("error", { message: error });
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const onDeleteAvatar = async (avatarId?: string) => {
    if (!avatarId || undefined) return;
    window.confirm("Do your really want to delete avatar");
    setStopDelete(true);
    setPreview((prev) => "");
    const response: DeleteImage | undefined = await deleteImage(avatarId);
    if (response && !response?.result?.success) {
      setStopDelete(false);
      router.reload();
    }
    if (response && response.ok) {
      router.push("/");
    }
  };

  const [deleteAccount, { data: deleteData, loading: deleteLoading }] =
    useMutation<DeleteMutationResponse>(`api/user/${user?.username}/delete`);

  const onDelete = () => {
    window.confirm("Really???");
    deleteAccount({});
  };

  useEffect(() => {
    if (deleteData && deleteData.ok) {
      router.replace("/");
    }
  }, [deleteData, router]);

  console.log(deleteData);

  const image = watch("image");
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    user?.bio && setValue("bio", user.bio);
    user?.website && setValue("website", user.website);
    user?.email && setValue("email", user.email);
    user?.username && setValue("username", user.username);
    if (user && user?.avatar) {
      setPreview(deliveryFile(user?.avatar));
    }
  }, [user, setValue]);

  useEffect(() => {
    if (data && data.ok) {
      router.push("/");
    }
  }, [data, router]);

  useEffect(() => {
    setStopDelete(false);
  }, []);

  return (
    <Layout head="Edit" title="Edit Profile">
      <div className="max-w-4xl m-auto">
        <div className="space-y-20">
          <div className="flex items-center justify-center">
            <div className="relative mr-10 w-24 h-24 cursor-pointer rounded-full ">
              {preview ? (
                <Image
                  src={preview}
                  layout="fill"
                  objectFit="cover"
                  alt=""
                  className="rounded-full"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-full flex justify-center items-center border-2 border-gray-400">
                  <svg
                    className="h-14 w-14 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div
              ref={formRef}
              className="sm:flex-row flex flex-col w-[60%] sm:space-x-6 space-y-4 sm:space-y-0"
            >
              <label
                htmlFor="avatar"
                className="rounded-lg text-sm p-1 flex justify-center items-center w-full transition-all bg-red-400 text-white hover:bg-red-500 cursor-pointer"
              >
                <input
                  {...register("image")}
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <span>Upload</span>
              </label>
              <div onClick={() => setPreview((prev) => "")} className="w-full">
                <SmallButton text="Reset Preview" />
              </div>
              <div
                onClick={() => onDeleteAvatar(user?.avatar || undefined)}
                className="w-full"
              >
                {stopDelete ? (
                  <div className="hidden">
                    <SmallButton text="Delete" />
                  </div>
                ) : (
                  <SmallButton text="Delete" />
                )}
              </div>
            </div>
          </div>

          <div className="w-[100%] flex justify-center">
            <form
              onSubmit={handleSubmit(onValid)}
              className="w-[60%] space-y-6"
            >
              <div>
                {errors.error?.message && (
                  <ErrorMessage errorText={errors.error.message} />
                )}
                <Input
                  id="Username"
                  label="Username"
                  placeholder="Username"
                  type="text"
                  register={register("username", {
                    required: "Username is required.",
                  })}
                />
              </div>
              <div>
                <Input
                  id="Email"
                  label="Email"
                  placeholder="Email"
                  type="text"
                  register={register("email", {
                    required: "Email is required.",
                    validate: {
                      emailForm: (value) =>
                        value.includes("@") || "Please email form.",
                    },
                  })}
                />
              </div>
              <div>
                <TextArea
                  label="Bio"
                  register={register("bio", {
                    minLength: {
                      value: 2,
                      message: "Please two or more letters.",
                    },
                  })}
                />
                {errors.bio?.message && (
                  <ErrorMessage errorText={errors.bio.message} />
                )}
              </div>
              <div>
                <Input
                  id="Personal website"
                  label="Personal website"
                  placeholder=""
                  type="text"
                  register={register("website", {
                    minLength: {
                      value: 2,
                      message: "Please two or more letters.",
                    },
                  })}
                />
                {errors.website?.message && (
                  <ErrorMessage errorText={errors.website.message} />
                )}
              </div>
              <EnterButton text="Edit" loading={loading} />
            </form>
          </div>
          <div
            onClick={() => onDelete()}
            className="rounded-lg bg-red-400 w-[20%] transition-all hover:bg-red-600 flex justify-center items-center"
          >
            <button className="p-1 font-bold text-xs text-white ">
              {deleteLoading ? "Loading..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
