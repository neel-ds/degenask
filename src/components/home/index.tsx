"use client";
/* eslint-disable @next/next/no-img-element */
import { useLogin, useLogout, usePrivy, useWallets } from "@privy-io/react-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FarcasterIcon from "@/icons/farcaster";
import toast from "react-hot-toast";
import { User } from "@/types";

export default function Hero({ users }: { users: User[] }) {
  const router = useRouter();
  // const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { ready, authenticated, user, createWallet } = usePrivy();
  const { wallets } = useWallets();

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prevState) => !prevState);
  // };

  const setProfile = async () => {
    const response = await fetch("/api/setCreator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user?.farcaster?.username,
        fid: user?.farcaster?.fid,
      }),
    });
    if (response.status === 200) {
      toast.success("User created successfully", {
        style: {
          borderRadius: "10px",
        },
      });
      router.push("/setup");
    }
  };

  const { login } = useLogin({
    async onComplete(user) {
      if (authenticated) {
        if (wallets.length === 0) {
          const res = createWallet();
        }
      }
      setIsLoggedIn(true);
      if (user) {
        const isExist = users.find(
          (profile: User) => profile.username === user?.farcaster?.username,
        );
        if (isExist) {
          router.push(`/${user?.farcaster?.username}`);
          return;
        }
      }
      await setProfile();
    },
    onError(error) {
      toast.error("Encountered with login error, try again!", {
        style: {
          borderRadius: "10px",
        },
      });
      console.log("🚨 Login error", { error });
    },
  });

  // const { logout } = useLogout({
  //   onSuccess: () => {
  //     setIsLoggedIn(false);
  //   },
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-20">
      <h1 className="text-[3rem] text-center font-title font-semibold text-neutral-200">
        Get paid to answer questions <br /> through <span className="text-[#A36EFD]">Degen</span>
      </h1>
      {!isLoggedIn ? (
        <button
          className="flex w-fit gap-3 px-5 py-3.5 items-center font-primary text-neutral-100 bg-[#A36EFD] hover:text-gray-50 hover:shadow-lg rounded-lg"
          onClick={login}
          disabled={!ready && authenticated}
        >
          <FarcasterIcon className="w-5 h-5" color="#ffffff" />
          Sign in to Create a Page
        </button>
      ) : (
        <div>
          <button className="block w-fit px-5 py-3 font-primary text-neutral-50 bg-[#A36EFD] rounded-lg">
            <span className="flex flex-row items-center gap-x-3">
              <img src={user?.farcaster?.pfp!} alt="icon" className="w-10 h-10 rounded-full" />
              {user?.farcaster?.username}
            </span>
          </button>
          {/* <div
            className={`${
              isDropdownOpen ? "block absolute" : "hidden"
            }  mt-1 z-10 divide-y divide-gray-100 rounded-lg shadow w-44 bg-neutral-100 font-primary`}
          >
            <ul className="py-1 text-sm text-neutral-700" aria-labelledby="dropdown-button">
              <li>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 hover:bg-neutral-300 hover:text-neutral-800"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div> */}
        </div>
      )}
    </main>
  );
}
