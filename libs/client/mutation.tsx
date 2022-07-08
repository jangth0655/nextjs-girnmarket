import { useState } from "react";

interface MutationState<T> {
  data?: T;
  loading: boolean;
  error?: any;
}

type MutationResponse<T> = [(data?: any) => void, MutationState<T>];

const useMutation = <T = any,>(url: string): MutationResponse<T> => {
  const [value, setValue] = useState<MutationState<T>>({
    data: undefined,
    loading: false,
    error: undefined,
  });
  const mutation = async (data: any) => {
    try {
      setValue((prev) => ({ ...prev, loading: true }));
      const response = await (
        await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      if (!response.ok) {
        setValue((prev) => ({ ...prev, error: response.error }));
      }
      setValue((prev) => ({ ...prev, data: response }));
    } catch (e) {
      console.log(e);
      return;
    } finally {
      setValue((prev) => ({ ...prev, loading: false }));
    }
  };
  return [mutation, { ...value }];
};

export default useMutation;
