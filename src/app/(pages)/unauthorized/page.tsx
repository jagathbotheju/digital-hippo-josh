import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const UnAuthorizedPage = () => {
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <div className="m-10 p-10 mx-auto flex flex-col justify-center text-center">
          <h2 className="text-3xl font-bold text-red-400">UnAuthorized</h2>
          <p>Please check your email and click Verify button</p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default UnAuthorizedPage;
