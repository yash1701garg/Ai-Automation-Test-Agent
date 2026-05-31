import Image from "next/image";
import { UserRepo } from "./WorkspaceBody";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  ListChecks,
  Loader2,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import TestCaseList from "./TestCaseList";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useContext, useState } from "react";

type props = {
  repoList: UserRepo[];
};

export type TestCase = {
  id: number;
  ttile: string;
  description: string;
  type: string;
  repoId: number;
  targetFiles: string[];
  expectedResult: string;
  repoName: string;
  repoOwner: string;
  targetRoute: string;
};

type StatusData = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
};

const UserRepoList = ({ repoList }: props) => {
  const [statusData, setStatusData] = useState<StatusData>({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    passRate: 0,
  });

  const { userDetails } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);
  const [testCaseLoading, setTestCaseLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const onGenerateTestCases = async (repo: UserRepo) => {
    setLoading(true);
    const response = await axios.post("/api/generate-test-cases", {
      userId: userDetails?.id,
      repoId: repo?.repoId,
      repo: repo?.repoName,
      owner: repo?.owner,
      branch: repo?.defaultBranch,
    });
    console.log("onGenerateTestCases response : ", response);
    setLoading(false);
  };

  const GetTestCase = async (repoId: number) => {
    setTestCaseLoading(true);
    setTestCases([]);
    const response = await axios.get("/api/test-cases", {
      params: {
        repoId: repoId,
      },
    });
    console.log("test case response : ", response);
    setStatusData({
      totalTests: response.data.length,
      passedTests: 0,
      failedTests: 0,
      passRate: 0,
    });
    setTestCaseLoading(false);
    setTestCases(response.data);
  };

  return (
    <div className="mt-10">
      <h2 className="my-3 font-medium">REPOSITORIES</h2>
      <Accordion
        type="single"
        collapsible
        onValueChange={(value) => GetTestCase(Number(value))}
      >
        {repoList.map((repo, index) => (
          <AccordionItem
            value={repo?.repoId.toString()}
            className="rounded-xl border px-5"
          >
            <AccordionTrigger>
              <div className="flex items-center gap-8">
                <Image
                  src={"/github.png"}
                  alt="github"
                  width={30}
                  height={30}
                />
                <div className="flex flex-col items-start">
                  <h2 className="">{repo.repoName}</h2>
                  <p className="text-xs text-gray-500">
                    {repo.defaultBranch} & {repo.repoLanguage}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="pt-4 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatusCard
                    title="Total Tests"
                    value={statusData.totalTests}
                    icon={<ListChecks className="h-5 w-5 text-blue-600" />}
                    bgColor="bg-blue-50"
                  />

                  <StatusCard
                    title="Passed"
                    value={statusData.passedTests}
                    icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                    bgColor="bg-green-50"
                  />

                  <StatusCard
                    title="Failed"
                    value={statusData.failedTests}
                    icon={<XCircle className="h-5 w-5 text-red-600" />}
                    bgColor="bg-red-50"
                  />

                  <StatusCard
                    title="Pass Rate"
                    value={`${statusData.passRate}%`}
                    icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                    bgColor="bg-purple-50"
                  />
                </div>

                {testCases && testCases?.length > 0 && (
                  <TestCaseList
                    testCases={testCases}
                    onReload={(repoId: number) => GetTestCase(repoId)}
                  />
                )}

                {testCaseLoading ? (
                  <h2 className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </h2>
                ) : (
                  testCases?.length === 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 bg-gray-50">
                      <div>
                        <h3 className="font-medium">
                          {loading
                            ? "Geerating ai test cases....."
                            : "Generate AI Test Cases"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Analyze this repository and generate automated test
                          cases using AI.
                        </p>
                      </div>
                      <Button
                        className="gap-2"
                        onClick={() => onGenerateTestCases(repo)}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Generate Test Cases
                      </Button>
                    </div>
                  )
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4 bg-gray-50">
                  <div>
                    <h3 className="font-medium">
                      {loading
                        ? "Geerating ai test cases....."
                        : "Generate AI Test Cases"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Analyze this repository and generate automated test cases
                      using AI.
                    </p>
                  </div>

                  <Button
                    className="gap-2"
                    onClick={() => onGenerateTestCases(repo)}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate Test Cases
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default UserRepoList;

function StatusCard({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <div className="rounded-xl border p-4 flex items-center justify-between bg-white">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      </div>
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center ${bgColor}`}
      >
        {icon}
      </div>
    </div>
  );
}
