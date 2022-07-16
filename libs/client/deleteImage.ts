export const deleteImage = async (imageId?: string) => {
  return await (
    await fetch(`/api/deleteFile`, {
      method: "DELETE",
      body: `${imageId}`,
    })
  ).json();
};
