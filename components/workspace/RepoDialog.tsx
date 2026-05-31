import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";
import { Input } from "../ui/input";
import { UserDetailContext } from "@/context/UserDetailContext";

type UserRepo = {
  id: number;
  name: string;
  fullName: string;
  html_url: string;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  default_branch: string;
  private: boolean;
  owner: string;
};

const RepoDialog = ({
  setRefreshPage,
}: {
  setRefreshPage: (refresh: boolean) => void;
}) => {
  const [reposList, setReposList] = useState<UserRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<UserRepo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { userDetails } = useContext(UserDetailContext);
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    repoList();
  }, []);
  const repoList = async () => {
    const res = await axios.get("/api/github/repos");
    console.log("Get all the repos from github", res?.data);
    setReposList(res.data);
  };

  const filteredList = useMemo(() => {
    return reposList.filter((repo) =>
      (repo.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [reposList, searchTerm]);

  const addRepo = async () => {
    if (!selectedRepo) return;

    try {
      const response = await axios.post("/api/user-repo", {
        repoId: selectedRepo.id,

        userId: userDetails?.id,

        repoName: selectedRepo.name,

        repoFullName: selectedRepo.fullName,

        repoUrl: selectedRepo.html_url,

        repoLanguage: selectedRepo.language,

        private_: selectedRepo.private,

        defaultBranch: selectedRepo.default_branch,

        owner: selectedRepo.owner,
      });

      console.log(response.data);

      setOpen(false);

      setRefreshPage(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+Add Repo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search the Repository</DialogTitle>
          <DialogDescription>
            Select your github repository to start the test case generation
          </DialogDescription>
        </DialogHeader>
        <div>
          {/* Repo List */}
          <Input
            type="text"
            placeholder="Search your Repositories..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-60 overflow-y-auto border rounded-xl mt-4">
            {filteredList?.map((repo) => (
              <li
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className={`cursor-pointer ${selectedRepo?.id === repo.id ? "bg-gray-100" : ""} p-4 border-b hover:bg-gray-100`}
              >
                {repo.fullName}
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="flex gap-5">
          <DialogClose>Cancel</DialogClose>
          <Button onClick={() => addRepo()}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RepoDialog;
