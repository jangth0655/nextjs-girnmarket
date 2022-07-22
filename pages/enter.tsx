import EnterButton from "@components/enter/EnterButton";
import EnterInput from "@components/enter/EnterInput";
import EnterLinkMessage from "@components/enter/EnterLinkMessage";
import ErrorMessage from "@components/enter/ErrorMessage";
import { cls } from "@libs/client/cls";
import useMutation from "@libs/client/mutation";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import enterImage from "../public/image/enter.jpg";
import logo from "../public/image/logo.png";

interface EnterForm {
  username: string;
  email: string;
  error?: string;
}

interface TokenForm {
  token: number;
  tokenError?: string;
}

interface EnterMutation {
  ok: boolean;
  token: number;
}

interface TokenMutation {
  ok: boolean;
}

const Enter: NextPage = () => {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState(0);
  const [enter, { data, loading, error }] =
    useMutation<EnterMutation>("/api/users/enter");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<EnterForm>({
    mode: "onChange",
  });

  const {
    register: tokenRegister,
    handleSubmit: tokenSubmit,
    formState: { errors: tokenError },
    setError: tokenSetError,
    setValue,
  } = useForm<TokenForm>({
    mode: "onChange",
  });

  const [
    confirm,
    { data: tokenData, loading: tokenLoading, error: tokenErrorString },
  ] = useMutation<TokenMutation>("/api/users/confirm");

  const handleSize = useCallback(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, [handleSize]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    if (data && data.ok) {
      setValue("token", data.token);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (tokenData && tokenData.ok) {
      router.replace("/");
    }
  }, [router, tokenData]);

  const onValid = (data: EnterForm) => {
    if (loading) return;
    if (error) {
      setError("error", { message: error });
    }
    enter(data);
  };

  const onTokenValid = (data: TokenForm) => {
    if (tokenLoading) return;
    confirm(data);
    if (tokenErrorString) {
      tokenSetError("tokenError", { message: tokenErrorString });
    }
  };

  const ErrorState = errors.email || errors.username || errors.error;

  return (
    <section className="min-h-screen flex text-gray-700">
      {windowSize > 965 ? (
        <div className="relative w-[50%] h-screen">
          <Image src={enterImage} layout="fill" objectFit="cover" alt="enter" />
        </div>
      ) : null}
      <main
        className={cls("py-24 m-auto", windowSize < 965 ? "w-full" : "w-[50%]")}
      >
        <div className="max-w-sm m-auto space-y-12">
          <div>
            <div className="relative w-40 h-40 mb-8">
              <Image src={logo} layout="fill" objectFit="cover" alt="logo" />
            </div>
            <h1 className="text-xl font-bold">Sign up to GrinMarket</h1>
          </div>

          <div className="h-[1px] w-full bg-gray-300" />

          {data?.ok ? (
            <>
              <div>
                {tokenError.tokenError?.message && (
                  <ErrorMessage errorText={tokenError.tokenError?.message} />
                )}
                {data?.token && (
                  <div className="mb-4">
                    <span className="text-lg font-bold text-blue-600">
                      {data.token}
                    </span>
                  </div>
                )}
                <form
                  onSubmit={tokenSubmit(onTokenValid)}
                  className="flex flex-col space-y-8"
                >
                  <div className="flex flex-col w-96">
                    <EnterInput
                      register={tokenRegister("token", {
                        required: "Token is required.",
                        valueAsNumber: true,
                      })}
                      placeholder="Token"
                      text="Token"
                      id="token"
                      errorState={Boolean(tokenError.tokenError)}
                    />
                  </div>

                  <EnterButton
                    text="Submit"
                    errorState={Boolean(tokenError.tokenError)}
                    loading={tokenLoading}
                  />
                </form>
              </div>
            </>
          ) : (
            <>
              <div>
                {ErrorState && (
                  <ErrorMessage
                    errorText={
                      errors.email?.message ||
                      errors.username?.message ||
                      errors.error?.message
                    }
                  />
                )}
                <form
                  onSubmit={handleSubmit(onValid)}
                  className="flex flex-col space-y-8"
                >
                  <div className="flex flex-col w-96">
                    <EnterInput
                      register={register("username", {
                        required: "Username is required.",
                        validate: {
                          trimUser: (value) =>
                            value.trim() || "Fill in the blanks",
                        },
                      })}
                      placeholder="Username"
                      text="Username"
                      id="username"
                      errorState={Boolean(errors.username)}
                    />
                  </div>

                  <div className="flex flex-col w-96">
                    <EnterInput
                      register={register("email", {
                        required: "Email is required.",
                        validate: {
                          emailForm: (value) =>
                            value.includes("@") || "Please email form",
                        },
                      })}
                      placeholder="Email"
                      text="Email"
                      id="email"
                      errorState={Boolean(errors.email)}
                    />
                  </div>
                  <EnterButton
                    text="Log in"
                    errorState={Boolean(ErrorState)}
                    loading={loading}
                  />
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </section>
  );
};

export default Enter;
