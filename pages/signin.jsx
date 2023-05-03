import AuthComponent from "@/components/AuthComponent";

export default function Signin() {
  return (
    <div className="bg-[#e7ecef]">
      <AuthComponent loginType={"signin"} />
    </div>
  );
}
