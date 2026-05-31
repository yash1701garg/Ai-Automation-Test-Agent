"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import EmptyWorkspace from "./EmptyWorkspace";
import { useRouter } from "next/navigation";
import axios from "axios";
import ReportDialog from "../workspace/RepoDialog";
import UserRepoList from "./UserRepoList";

export type UserRepo = {
  id: number;
  repoId: number;
  repoName: string;
  repoFullName: string;
  repoUrl: string;
  userId: number;
  updatedAt: string;
  defaultBranch: string;
  private: boolean;
  owner: string;
  repoLanguage: string | null;
};

export const WorkspaceBody = () => {
  const { userDetails } = useContext(UserDetailContext);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userRepoList, setUserRepoList] = useState<UserRepo[]>([]);

  useEffect(() => {
    getGithubToken();
  }, []);

  useEffect(() => {
    userDetails && getUserRepo();
  }, [userDetails]);

  const getGithubToken = async () => {
    const response = await axios.get("/api/github/getToken");
    console.log("Token Response", response);
    setToken(response.data.token);
  };

  const OnAddRepo = async () => {
    router.push("/api/github");
  };

  const getUserRepo = async () => {
    console.log("UserDetails : ", userDetails?.id);
    const response = await axios.get(
      `/api/user-repo?userId=${userDetails?.id}`,
    );
    console.log("User Repo Response", response.data.data);
    setUserRepoList(response?.data.data);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-medium">Workspace</h2>
        <h2 className="text-blue-800 bg-blue-100 rounded-lg px-2">
          RemainingCredits : {userDetails?.credits}
        </h2>
      </div>
      <Card className="mt-5 flex justify-between items-center p-4 border rounded-lg">
        <div className="flex items-center gap-5">
          <Image src={"/github.png"} alt="github" width={30} height={30} />
          <h2 className="text-lg">Connect to Github Repo</h2>
        </div>

        <div>
          {!token ? (
            <Button onClick={OnAddRepo}>Setup</Button>
          ) : (
            <ReportDialog
              setRefreshPage={(refresh: boolean) => getUserRepo()}
            />
          )}
        </div>
      </Card>
      {userRepoList && userRepoList.length > 0 ? (
        <UserRepoList repoList={userRepoList} />
      ) : (
        <Card className="mt-10">
          <CardContent>
            <EmptyWorkspace />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
