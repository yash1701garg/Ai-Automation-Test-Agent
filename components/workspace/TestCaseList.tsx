import React, { useState } from "react";
import { TestCase } from "./UserRepoList";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Play, RefreshCw, SettingsIcon } from "lucide-react";

type props = {
  testCases: TestCase[];
  onReload: any;
};

const TestCaseList = ({ testCases, onReload }: props) => {
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase[]>([]);

  const handleTestCaseSelect = (
    checked: boolean | string,
    testCase: TestCase,
  ) => {
    if (checked) {
      setSelectedTestCase((prev: any) => [...prev, testCase]);
    } else {
      setSelectedTestCase((prev: any) =>
        prev.filter((item: any) => item.id !== testCase.id),
      );
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-primary">Generate Test Cases</h2>
        <Button size={"sm"} onClick={() => onReload(testCases[0].repoId)}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>
      <div className="border rounded-md mt-3">
        {testCases.map((testCase, index) => (
          <div
            key={index}
            className="p-4 border-b flex item-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedTestCase.some(
                  (item: any) => item.id === testCase.id,
                )}
                onCheckedChange={(checked) =>
                  handleTestCaseSelect(checked, testCase)
                }
              />
              <div>
                <h2>{testCase?.ttile}</h2>
                <p className="text-xs text-gray-500">{testCase?.description}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Badge variant={"secondary"}>{testCase?.type}</Badge>
              <Badge variant={"secondary"}>Pending</Badge>
              <Button size={"icon"} variant={"outline"}>
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between p-4 bg-gray-100">
          <h2>Run Selected Test Case</h2>
          <Button disabled={selectedTestCase.length === 0}>
            <Play className="w-4 h-4 mr-2" />
            Run Selected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestCaseList;
