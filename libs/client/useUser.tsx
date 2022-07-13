import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UseUserProfile {
  ok: boolean;
  user: User;
}

interface UseUserProp {
  isPrivate: boolean;
}

const useUser = ({ isPrivate }: UseUserProp) => {
  const router = useRouter();
  const { data, error } = useSWR<UseUserProfile>("/api/users/me");

  useEffect(() => {
    if (isPrivate) {
      if (data && !data.ok) {
        router.replace("/enter");
      }
    }
  }, [router, isPrivate, data]);

  return { user: data?.user, isLoading: !data && !error };
};

export default useUser;
