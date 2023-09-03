import { useEffect } from "react";

export default function SignInPage() {
  useEffect(() => {
    window.catalyst.auth.signIn("login", { signInProvidersOnly: true });
  }, []);
  return (
    <>
      <h2 className="my-4 text-lg text-center md:text-xl text-gray-50">Signin to manage rooms and questions </h2>

      <div id="login"></div>
    </>
  );
}
