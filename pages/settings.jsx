import Head from "next/head";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRef, useState } from "react";
import { InsertPhoto } from "@mui/icons-material";
import { useRouter } from "next/router";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export default function settings() {
  const {
    currentUser,
    updateUserDisplayName,
    updateUsersPicture,
    updateUsersEmail,
    updateUsersPassword,
    deleteAccount,
  } = useAuth();
  /*  */
  const [newPassword, setNewPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [email, setEmail] = useState({ newEmail: "", currentPassword: "" });
  const [newUsername, setNewUsername] = useState("");
  /*  */
  const [openChangeUsername, setOpenChangeUsername] = useState(false);
  const [openChangeProfileImg, setOpenChangeProfileImg] = useState(false);
  const [openChangeEmail, setOpenChangeEmail] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const router = useRouter();

  function changeEmail() {
    updateUsersEmail(email.newEmail, email.currentPassword);
    setOpenChangeEmail(false);
  }

  function changePassword() {
    updateUsersPassword(newPassword.currentPassword, newPassword.newPassword);
    setOpenChangePassword(false);
  }

  function changeUsername() {
    updateUserDisplayName(newUsername);
    setOpenChangeUsername(false);
  }

  /* UPDATE USER PICTURE */
  const filePickerRef = useRef();
  const [selectedPicture, setSelectedPicture] = useState(null);

  function addImageToPost(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedPicture(readerEvent.target.result);
    };
  }

  async function sendProfilePic() {
    const imageRef = ref(storage, `users/${currentUser.uid}/profilePic`);

    await uploadString(imageRef, selectedPicture, "data_url").then(async () => {
      const downloadURL = await getDownloadURL(imageRef);
      if (downloadURL) {
        updateUsersPicture(downloadURL);
      }
    });
    setOpenChangeProfileImg(false);
  }

  let accountProvider = null;

  if (currentUser) {
    accountProvider = currentUser.user.providerData[0].providerId;
  }
  /*  */

  if (!currentUser) {
    router.push("/signin");
    return <></>;
  }

  return (
    <div className="w-screen">
      <Head>
        <title>Dance Network || Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex flex-col max-w-[1500px] mx-auto">
        <div className="flex space-x-2 p-2">
          <h3
            className="my-auto font-medium text-xl cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            Dance Network
          </h3>
          <div className="w-[300px] items-center my-auto space-x-3 h-10 flex">
            <h3>
              Signed in as
              {currentUser.uid && (
                <Link
                  className="ml-2 font-medium"
                  href={`/user/${currentUser.uid}`}
                >
                  {currentUser.displayName}
                </Link>
              )}
            </h3>
          </div>
        </div>
        <div className="flex justify-center min-h-screen border-t-2 border-gray-500 scrollbar-hide">
          <div className="flex items-center flex-col p-2 sticky top-0 w-1/6 border-l-2 border-gray-500">
            <Sidebar />
          </div>
          <div className="relative lg:w-[725px] flex flex-col pt-8 pl-2 sm:pl-8 space-y-5 border-gray-500 border-x-2 w-4/6">
            <h2 className="text-2xl">Settings</h2>
            <div className="w-2/3">
              <ul className="space-y-6">
                <li className="space-y-3">
                  <button
                    onClick={() => setOpenChangeUsername(!openChangeUsername)}
                    className={
                      openChangeUsername
                        ? "font-bold  whitespace-nowrap"
                        : " whitespace-nowrap"
                    }
                  >
                    Change Username
                  </button>
                  {openChangeUsername && (
                    <div className="space-y-3 flex flex-col">
                      <input
                        type="text"
                        placeholder="Type in your new username"
                        className=" w-full placeholder:text-sm sm:placeholder:text-md sm:w-[250px] border-2 border-gray-500 p-2"
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                      <button
                        className="p-2 text-sm sm:text-md w-full sm:w-[250px] border-gray-500 border-2 rounded"
                        onClick={() => {
                          changeUsername();
                        }}
                      >
                        Submit changes.
                      </button>
                    </div>
                  )}
                </li>
                <li className="space-y-3">
                  <button
                    onClick={() =>
                      setOpenChangeProfileImg(!openChangeProfileImg)
                    }
                    className={
                      openChangeProfileImg
                        ? "font-bold whitespace-nowrap"
                        : " whitespace-nowrap"
                    }
                  >
                    Change Profile Image
                  </button>
                  {openChangeProfileImg && (
                    <div className="space-y-3 flex flex-col">
                      <div className="flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <h4 className="text-sm">Select an Image.</h4>
                          <div onClick={() => filePickerRef.current.click()}>
                            <InsertPhoto className="h-[22px]" />
                            <input
                              type="file"
                              hidden
                              onChange={addImageToPost}
                              ref={filePickerRef}
                            />
                          </div>
                        </div>

                        <button
                          className="text-sm sm:text-md border-gray-500 border-2 rounded"
                          onClick={() => {
                            sendProfilePic();
                          }}
                        >
                          Submit changes.
                        </button>
                      </div>
                    </div>
                  )}
                </li>
                {accountProvider !== "google.com" && (
                  <li className="space-y-3">
                    <button
                      onClick={() => setOpenChangeEmail(!openChangeEmail)}
                      className={
                        openChangeEmail
                          ? "font-bold  whitespace-nowrap"
                          : " whitespace-nowrap"
                      }
                    >
                      Change User Email Address
                    </button>
                    {openChangeEmail && (
                      <div className="flex flex-col justify-center space-y-3">
                        <input
                          type="email"
                          placeholder="Type in your new email address"
                          className=" w-full placeholder:text-sm sm:placeholder:text-md sm:w-[250px] border-2 border-gray-500 p-2"
                          onChange={(e) =>
                            setEmail({ ...email, newEmail: e.target.value })
                          }
                        />
                        <input
                          type="email"
                          placeholder="Type in your account password."
                          className=" w-full placeholder:text-sm sm:placeholder:text-md sm:w-[250px] border-2 border-gray-500 p-2"
                          onChange={(e) =>
                            setEmail({
                              ...email,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                        <button
                          className="p-2 text-sm sm:text-md  w-full sm:w-[250px] border-gray-500 border-2 rounded"
                          onClick={changeEmail}
                        >
                          Submit changes.
                        </button>
                      </div>
                    )}
                  </li>
                )}

                {accountProvider !== "google.com" && (
                  <li className="space-y-3">
                    <button
                      onClick={() => setOpenChangePassword(!openChangePassword)}
                      className={
                        openChangePassword
                          ? "font-bold  whitespace-nowrap"
                          : " whitespace-nowrap"
                      }
                    >
                      Change User Password
                    </button>
                    {openChangePassword && (
                      <div className="flex-col space-y-4">
                        <div className="space-y-4">
                          <input
                            type="password"
                            placeholder="Type in your new password"
                            className="w-full placeholder:text-sm sm:placeholder:text-md sm:w-[250px] border-2 border-gray-500 p-2"
                            onChange={(e) =>
                              setNewPassword({
                                ...newPassword,
                                newPassword: e.target.value,
                              })
                            }
                          />
                          <input
                            type="password"
                            placeholder="Type in your old password"
                            className="placeholder:text-sm sm:placeholder:text-md w-full  sm:w-[250px] border-2 border-gray-500 p-2"
                            onChange={(e) =>
                              setNewPassword({
                                ...newPassword,
                                currentPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                        <button
                          className="p-2 text-sm sm:text-md  w-full sm:w-[250px] border-gray-500 border-2 rounded"
                          onClick={changePassword}
                        >
                          Submit changes.
                        </button>
                      </div>
                    )}
                  </li>
                )}
                <li>
                  <button onClick={deleteAccount}>Delete account</button>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-1/6 hidden lg:flex items-center justify-center"></div>
        </div>
      </main>
    </div>
  );
}
