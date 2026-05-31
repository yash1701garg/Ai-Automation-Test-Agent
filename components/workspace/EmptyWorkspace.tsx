import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Link } from "lucide-react";

const EmptyWorkspace = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={"/open-folder.png"}
        alt="oper folder"
        width={70}
        height={70}
      />
      <h2 className="text-center text-2xl font-medium mb-4 mt-8">
        No repository connected
      </h2>
      <p className="text-center mx-10">
        Connect your github account & add a repository to generate a test cases
      </p>
      <Button className="mt-5">
        <Link className="mr-4 h-4 w-4" />
        Connect Repo
      </Button>
    </div>
  );
};

export default EmptyWorkspace;
