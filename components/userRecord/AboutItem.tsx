import { User } from "@prisma/client";
import React from "react";
import useSWR from "swr";

interface AboutItemProps {
  username?: string;
}

interface UserProfileResponse {
  ok: boolean;
  userProfile: User;
}

const AboutItem: React.FC<AboutItemProps> = ({ username }) => {
  const { data, error } = useSWR<UserProfileResponse>(`/api/users/${username}`);
  const loading = !data && !error;

  return (
    <div className="w-full">
      {loading ? (
        "Loading"
      ) : (
        <div className="h-80 space-y-14">
          <div className="h-[60%]">
            <h1 className="font-bold text-lg mb-2">Bio</h1>
            <div className="w-full h-[90%] p-2 overflow-y-scroll border-[1px] rounded-md">
              <p>
                {data?.userProfile.bio ? (
                  data?.userProfile.bio
                ) : (
                  <span className="text-gray-500 text-sm">Empty</span>
                )}
              </p>
            </div>
          </div>

          <div className="h-[40%]">
            <h1 className="font-bold text-lg mb-2">Personal website</h1>
            <div className="w-full h-[30%] p-2 border-[1px] rounded-md">
              <span>
                {data?.userProfile.website ? (
                  data.userProfile.website
                ) : (
                  <span className="text-gray-500 text-sm">Empty</span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutItem;
