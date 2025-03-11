import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn();
      }}
    >
      <button type="submit">Sign in</button>
    </form>
  );
}
