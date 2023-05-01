import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { auth, db, storage } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  getAuth,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          user: user,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function submitPost(postDetails) {
    await addDoc(collection(db, "posts"), {
      timestamp: postDetails.timestamp,
      id: postDetails.id,
      username: postDetails.username,
      title: postDetails.title,
      description: postDetails.description,
      startDate: postDetails.startDate,
      endDate: postDetails.endDate,
      location: postDetails.location,
      locations: postDetails.locations,
      linkForMoreEventPostInfo: postDetails.linkForMoreEventPostInfo,
    });
  }

  async function likePost() {}

  async function bookmarkPost() {}

  function signUp(email, password, username) {
    let signedUpUser = null;
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        signedUpUser = user;
        setCurrentUser({
          user: user,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || username,
          photoURL: user.photoURL,
        });
      })
      .then(() => {
        updateProfile(signedUpUser, {
          displayName: username,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  }

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setCurrentUser({
          user: user,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }

  async function logOut() {
    setCurrentUser(null);
    await signOut(auth);
  }

  function logInUsingGoogle() {
    return signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setCurrentUser({
          user: user,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  function updateUserDisplayName(newUsername) {
    updateProfile(getAuth().currentUser, {
      displayName: newUsername,
    });
    setCurrentUser({ ...currentUser, displayName: newUsername });
    // gauti informacija ja pakeisti.
  }

  async function updateUsersPicture(selectedPicture) {
    updateProfile(getAuth().currentUser, {
      photoURL: selectedPicture,
    });
    setCurrentUser({ ...currentUser, photoURL: selectedPicture });
  }

  function updateUsersEmail(newEmail, currentPassword) {
    /* test@test.com -> 123@test.com */
    let signedUpUser = null;
    signInWithEmailAndPassword(auth, currentUser.email, currentPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        signedUpUser = user;
        updateEmail(signedUpUser, newEmail)
          .then(() => {
            setCurrentUser({
              ...currentUser,
              email: newEmail,
            });
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  }

  function updateUsersPassword(currentPassword, newPassword) {
    /* 123456 -> testas */
    let signedUpUser = null;
    signInWithEmailAndPassword(auth, currentUser.email, currentPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        signedUpUser = user;
        updatePassword(signedUpUser, newPassword)
          .then(() => {
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  }

  function deleteAccount() {
    deleteUser(getAuth().currentUser)
      .then(() => {
      })
      .catch((error) => {
      });
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logIn,
        logInUsingGoogle,
        signUp,
        logOut,
        submitPost,
        updateUserDisplayName,
        updateUsersEmail,
        updateUsersPassword,
        updateUsersPicture,
        deleteAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
