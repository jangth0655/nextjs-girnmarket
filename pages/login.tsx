import EnterButton from "@components/enter/EnterButton";
import EnterInput from "@components/enter/EnterInput";
import ErrorMessage from "@components/enter/ErrorMessage";
import { cls } from "@libs/client/cls";
import { NextPage } from "next";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../public/image/logo.png";
import loginImage from "../public/image/login.jpg";
import EnterLinkMessage from "@components/enter/EnterLinkMessage";

interface LoginForm {
  email: string;
  username: string;
}

const Login: NextPage = () => {
  const [windowSize, setWindowSize] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
  });

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

  const onValid = () => {};

  const ErrorState = errors.email || errors.username;

  return (
    <section className="min-h-screen flex text-gray-700">
      {windowSize > 965 ? (
        <div className="relative w-[50%] h-screen">
          <Image src={loginImage} layout="fill" objectFit="cover" alt="enter" />
        </div>
      ) : null}
      <main
        className={cls(
          "py-24 px-4  m-auto",
          windowSize < 980 ? "w-full" : "w-[40%]"
        )}
      >
        <div className="max-w-sm m-auto space-y-12">
          <div>
            <div className="relative w-40 h-40 mb-8">
              <Image src={logo} layout="fill" objectFit="cover" alt="logo" />
            </div>
            <h1 className="text-xl font-bold">Log In to GrinMarket</h1>
          </div>

          <div className="h-[1px] w-full bg-gray-300" />

          <div>
            {ErrorState && (
              <ErrorMessage
                errorText={errors.email?.message || errors.username?.message}
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
                text="Create Account"
                errorState={Boolean(ErrorState)}
              />
            </form>
          </div>
          <EnterLinkMessage
            link={"/enter"}
            text="Not a member?"
            enterMessage="Sign up now"
          />
        </div>
      </main>
    </section>
  );
};

export default Login;
