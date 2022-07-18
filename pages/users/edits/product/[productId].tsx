import EnterButton from "@components/enter/EnterButton";
import Input from "@components/Input";
import Layout from "@components/Layout";
import PageTitle from "@components/PageTitle";
import TextArea from "@components/TextArea";
import UploadImage from "@components/UploadImage";
import { deleteImage } from "@libs/client/deleteImage";
import { deliveryFile } from "@libs/client/deliveryImage";
import useMutation from "@libs/client/mutation";
import { Photo, Product, User } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ProductWithPhotoWithUser extends Product {
  photos: Photo[];
  user: User;
}

interface ProductItemResponse {
  ok: boolean;
  product: ProductWithPhotoWithUser;
}

interface EditProductForm {
  image: FileList;
  description: string;
  name: string;
  price: string;
}

interface EditMutationResponse {
  ok: boolean;
}

interface RemoveMutationResponse {
  ok: boolean;
}

const EditProduct: NextPage = () => {
  const router = useRouter();
  const { data, error } = useSWR<ProductItemResponse>(
    router.query.productId && `/api/products/${router.query.productId}`
  );
  const [preview, setPreview] = useState("");

  const photoId = data && data.product?.photos[0]?.id;
  const loading = !data && !error;

  useEffect(() => {
    if (data?.product) {
      data.product.name && setValue("name", data.product.name);
      data.product.price && setValue("price", data?.product?.price);
      data.product.description &&
        setValue("description", data.product.description);
      data.product.photos &&
        setPreview(deliveryFile(data.product.photos[0].url));
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<EditProductForm>();

  const formRef = useRef<HTMLFormElement>(null);

  const [editProduct, { data: editData, loading: editLoading }] =
    useMutation<EditMutationResponse>(
      router.query.productId
        ? `/api/products/${router.query.productId}/edit`
        : ""
    );

  const [remove, { data: removeData, loading: removeLoading }] =
    useMutation<RemoveMutationResponse>(
      router.query.productId
        ? `/api/products/${router.query.productId}/remove`
        : ""
    );

  const onRemoveProduct = () => {
    window.confirm("Really???");
    remove({});
  };

  useEffect(() => {
    if (removeData && removeData.ok) {
      router.push(`/users/${data?.product.user.username}/profile`);
    }
  }, [removeData, router, data?.product?.user?.username]);

  console.log(removeData);

  const onValid = async (formData: EditProductForm) => {
    if (editLoading) return;
    if (formData && formData.image.length > 0) {
      const { uploadURL } = await (await fetch("/api/file")).json();
      const form = new FormData();
      form.append(
        "file",
        formData.image[0],
        `${data?.product.user.username}_${formData.name}`
      );
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      await deleteImage(data?.product.photos[0].url);
      editProduct({ ...formData, photoId, photoUrl: id });
    }
    if (formData && formData.image.length === 0) {
      editProduct(formData);
    }
  };

  useEffect(() => {
    if (editData && editData.ok) {
      router.push(`/users/${data?.product.user.username}/profile`);
    }
  }, [data?.product.user.username, editData, router]);

  const image = watch("image");

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [setPreview, image]);

  return (
    <Layout title="Edit Product" head="Edit Product">
      {loading ? (
        "Loading"
      ) : (
        <div>
          <div className="max-w-4xl m-auto min-h-screen">
            <PageTitle title="Edit Product" />
            <div className="mt-16 ">
              <form
                ref={formRef}
                onSubmit={handleSubmit(onValid)}
                className="h-[18rem] w-[60%] m-auto md:h-[24rem] lg:w-[60%]"
              >
                {preview && (
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
                )}
                <div
                  onClick={() => onRemoveProduct()}
                  className="rounded-lg bg-red-400 w-[20%] transition-all hover:bg-red-600 flex justify-center items-center mt-2"
                >
                  <button className="p-1 font-bold text-xs text-white ">
                    {removeLoading ? "Loading..." : "Delete Product"}
                  </button>
                </div>
                <div className="space-y-6 mt-8 pb-6">
                  <Input
                    id="name"
                    label="Name"
                    placeholder="Name"
                    type="text"
                    register={register("name")}
                  />
                  <Input
                    id="price"
                    label="Price"
                    placeholder="Price"
                    type="number"
                    register={register("price")}
                  />
                  <TextArea
                    label="Description"
                    register={register("description", {
                      minLength: {
                        value: 2,
                        message: "please 2 more than",
                      },
                    })}
                  />
                </div>
                <EnterButton text="Edit Product" loading={editLoading} />
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default EditProduct;
