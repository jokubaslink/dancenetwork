import { UseAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AuthComponent({ loginType }) {
  const router = useRouter();
  const [loginWithGoogle, setLoginWithGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { logIn, logInUsingGoogle, currentUser, logOut, signUp } = UseAuth();

  function register() {
    signUp(email, password, username);
    router.push("/");
  }

  function login() {
    logIn(email, password);
    router.push("/");
  }

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen space-y-5">
      <h1 className="text-3xl md:text-5xl font-medium text-[#274C77]">
        {loginType === "signin" && "Login to "}
        {loginType === "signup" && "Join "}
        Dance Network!
      </h1>
      <div className="flex flex-col">
        {!loginWithGoogle && (
          <div className="flex flex-col space-y-2">
            {loginType === "signup" && (
              <input
                onChange={(event) => setUsername(event.target.value)}
                className="md:w-[300px] md:h-14 border-2 border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] rounded p-2"
                type="text"
                placeholder="Enter your username"
              />
            )}
            <input
              onChange={(event) => setEmail(event.target.value)}
              className="border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] md:w-[300px] md:h-14 border-2 border-500-gray rounded p-2"
              type="email"
              placeholder="Enter your email"
            />
            <input
              onChange={(event) => setPassword(event.target.value)}
              className="border-[#274C77] bg-[#e7ecef] placeholder:text-[#274C77] md:w-[300px] md:h-14 border-2 border-500-gray rounded p-2"
              type="password"
              placeholder="Enter your password"
            />
            {loginType === "signin" && (
              <>
                <button
                  onClick={login}
                  className="h-12 text-[#FBF9FF] bg-[#6096BA] border-[#274C77] active:scale-95 active:bg-[#94bdd8] shadow-lg rounded-md border-2 p-2 text-sm"
                >
                  Login
                </button>
                <button
                  className="text-[#274C77] text-[10px] text-center font-medium"
                  onClick={() => router.push("/signup")}
                >
                  <p>If you don&apos;t have an account, press here to register.</p>
                </button>
              </>
            )}
            {loginType === "signup" && (
              <>
                <button
                  onClick={register}
                  className="h-12 border-2  rounded p-2 text-sm text-[#FBF9FF] bg-[#6096BA] border-[#274C77] active:scale-95 active:bg-[#94bdd8]"
                >
                  Register
                </button>
                <button
                  className="text-[#274C77] text-[10px] text-center font-medium"
                  onClick={() => router.push("/signin")}
                >
                  <p>Already have an account? Press here to login.</p>
                </button>
              </>
            )}
            <button
              className="text-[#274C77] text-[12px] text-center font-medium"
              onClick={() => setLoginWithGoogle((prev) => !prev)}
            >
              <p className="font-bold md:text-[16px]"> Login using Google</p>
            </button>
          </div>
        )}
        {loginWithGoogle && (
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                logInUsingGoogle();
                router.push("/");
              }}
              className="text-[#FBF9FF] bg-[#6096BA] border-2 border-[#274C77] rounded active:scale-95 active:bg-[#94bdd8] p-2"
            >
              Login with Google
            </button>
            <button
              className="text-[#274C77] text-[12px] text-center font-bold"
              onClick={() => setLoginWithGoogle((prev) => !prev)}
            >
              <p> Login using Email and Password</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
