import AuthComponent from "@/components/AuthComponent";

export default function Signup() {
  return (
    <div className="bg-[#e7ecef]">
      <AuthComponent loginType={"signup"} />
    </div>
  );
}
