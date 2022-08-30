export interface DeleteImage {
  ok: boolean;
  result: {
    errors: string[];
    success: boolean;
  };
}

export const deleteImage = async (imageId?: string | null) => {
  try {
    const response: DeleteImage = await (
      await fetch(`/api/deleteFile/${imageId}`)
    ).json();
    return response;
  } catch (e) {
    console.log(e);
  }
};
