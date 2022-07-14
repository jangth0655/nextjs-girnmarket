import EnterButton from "@components/enter/EnterButton";
import ErrorMessage from "@components/enter/ErrorMessage";
import Input from "@components/Input";
import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";
import SmallButton from "@components/SmallButton";

import TextArea from "@components/TextArea";
import UploadImage from "@components/UploadImage";
import { cls } from "@libs/client/cls";
import useMutation from "@libs/client/mutation";
import useUser from "@libs/client/useUser";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface UploadProductForm {
  image?: FileList;
  name: string;
  price: number;
  description: string;
  error?: string;
}

interface UploadProductMutation {
  ok: boolean;
}

const NewProduct: NextPage = () => {
  const router = useRouter();
  const { user } = useUser({ isPrivate: true });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<UploadProductForm>();
  const [preview, setPreview] = useState("");
  const [imageRequired, setImageRequired] = useState(false);
  console.log(imageRequired);
  const [createProduct, { loading, error, data }] =
    useMutation<UploadProductMutation>("/api/products");

  const onValid = async (data: UploadProductForm) => {
    if (data.image && data.image.length === 0) {
      setImageRequired(true);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    if (data.image && data.image.length > 0) {
      setImageRequired(false);
      const { uploadURL } = await (await fetch("/api/file")).json();
      const form = new FormData();
      form.append("file", data?.image[0], `${user?.username}_${data.name}`);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      createProduct({ ...data, productId: id });
      if (error) {
        setError("error", { message: error });
      }
    }
  };

  const image = watch("image");
  const formRef = useRef<HTMLFormElement>(null);

  const imageReset = () => {
    setPreview((prev) => "");
  };

  const errorText =
    errors.description?.message ||
    errors.image?.message ||
    errors.name?.message ||
    errors.price?.message ||
    errors.error?.message;

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (data && data.ok) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <Layout head="Upload" title="Product">
      <div className="max-w-4xl m-auto">
        <PageTitle
          title="What things do you selling"
          subTitle="Upload your product"
        />
        <div className="mt-16">
          <form
            ref={formRef}
            onSubmit={handleSubmit(onValid)}
            className={cls(
              "h-[18rem] w-[60%] m-auto md:h-[24rem] lg:w-[60%]",
              imageRequired ? "border-red-600" : ""
            )}
          >
            {preview ? (
              <div className="flex flex-col w-full h-full">
                <div className="relative w-full h-full rounded-md">
                  <Image
                    className="rounded-md"
                    src={preview}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                  />
                </div>
                <div className="mt-2 flex space-x-2 items-center">
                  <label htmlFor="image" className=" w-[20%]">
                    <SmallButton text="Change">
                      <input
                        {...register("image")}
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </SmallButton>
                  </label>
                  <div onClick={() => imageReset()} className="w-[20%]">
                    <SmallButton text="Reset"></SmallButton>
                  </div>
                </div>
              </div>
            ) : (
              <UploadImage
                imageRequired={imageRequired}
                register={register("image")}
              />
            )}

            <div className="mt-8 space-y-6 pb-2">
              <Input
                register={register("name", { required: "Name is required." })}
                type="text"
                label="Name"
                id="name"
                placeholder="Name"
              />
              <Input
                register={register("price", { required: "Price is required." })}
                type="number"
                label="Price"
                id="price"
                placeholder="Price"
              />
              <TextArea
                label="Description"
                register={register("description", {
                  minLength: {
                    value: 2,
                    message: "Description is required.",
                  },
                })}
              />
              {errorText && <ErrorMessage errorText={errorText} />}
              <EnterButton text="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewProduct;
