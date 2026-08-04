import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import auth from "../firebase/auth";

export async function login(email, password) {
  const user = await signInWithEmailAndPassword(auth, email, password);

  localStorage.setItem(
    "user",
    JSON.stringify({
      uid: user.user.uid,
      email: user.user.email,
    }),
  );

  return user.user;
}

export async function logout() {
  await signOut(auth);

  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!localStorage.getItem("user");
}
