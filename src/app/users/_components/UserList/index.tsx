"use client";

import * as XLSX from "xlsx";
import { ITEM_PER_PAGE } from "@/const";
import { User } from "@/interfaces/api";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Title from "@/components/common/Typography/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

import { useGetUsers } from "@/hooks/useGetUsers";
import { buildTree, ClientReport, removeAccents, TreeNode } from "@/lib/utils";
import { useGetUserRelated } from "@/hooks/useGetUserRelated";
import UserTreeCommission from "./UserTreeCommission";
import UserTree from "./UserTree";
import { Cross2Icon } from "@radix-ui/react-icons";
import { UserRelatedForm } from "../UserRelatedForm";
import { userStore } from "@/stores/userStore";
import { userRelatedStore } from "@/stores/userRelatedStore";

export default function UserList() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const users = userStore((state) => state.users);
  const userRelated = userRelatedStore((state) => state.userRelated);

  const [dataReport, setDataReport] = useState<any>(null);
  const [dataClient, setDataClient] = useState<ClientReport[]>([]);
  const [userInvalid, setUserInvalid] = useState<string[] | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<any>(null);

  const [page, _] = useState<number>(1);
  const [textSearch, setTextSearch] = useState<string | null>(name);
  const [openUserRelatedForm, setOpenUserRelatedForm] =
    useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<User[] | undefined>(
    undefined
  );

  const query: Record<string, string> = {};

  const { error, isValidating } = useGetUsers({
    ...query,
    _limit: `${ITEM_PER_PAGE}`,
    _page: `${page}`,
  });

  const { error: userRelatedError } = useGetUserRelated();

  const userList = useMemo(() => {
    let newUserList = users;
    if (dataReport) {
      newUserList = users.map((item) => ({
        ...item,
        volume: dataReport[item.userId] ?? 0,
        volumeDirect: dataReport[item.userId] ?? 0,
      }));
    }
    const treeData = buildTree(
      newUserList as unknown as TreeNode[],
      dataReport ? false : true
    );

    return treeData;
  }, [users, dataReport]);

  const userRelatedObj = useMemo(() => {
    const userRelatedData: Record<string, string> = {};
    userRelated.map((item) => {
      userRelatedData[item.userId] = item.parentId;
    });

    return userRelatedData;
  }, [userRelated]);

  const handleFileUpload = (event: any) => {
    const file = event.target.files?.[0];

    if (!file) {
      // setFileName('');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Get the first sheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      // Convert the sheet to JSON
      const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
      const newData: Record<string, number> = {};
      const clientData: ClientReport[] = [];
      const invalidUsers: string[] = [];
      let totalVol = 0;
      jsonData?.map((item: any) => {
        const vol = parseFloat(item.Volume);

        if (vol > 0) {
          totalVol = Math.round((totalVol + vol) * 100) / 100;
          if (userRelatedObj[item.UserId]) {
            const newVol = newData[userRelatedObj[item.UserId]]
              ? Math.round((vol + newData[userRelatedObj[item.UserId]]) * 100) /
                100
              : vol;
            newData[userRelatedObj[item.UserId]] = newVol;
            clientData.push({userId: userRelatedObj[item.UserId], vol: newVol, name: item.Name, deposit: parseFloat(item.Deposit), withdrawal: parseFloat(item.Withdrawal)});
          } else {
            invalidUsers.push(item.UserId);
          }
        }
      });

      if (invalidUsers.length) {
        setUserInvalid(invalidUsers);
        setDataReport(null);
      } else {
        setDataReport(newData);
        setFileName(file.name);
        setDataClient(clientData);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSearch = () => {
    if (!textSearch) {
      return;
    }

    deleteUpload();
    
    const newTextSearch = textSearch.toLowerCase();
    const userSearchResult = users.filter(
      (item) =>
        item.nameForSearch?.includes(newTextSearch) ||
        item.userId.includes(newTextSearch)
    );

    setSearchResult(userSearchResult);

    // if (textSearch) {
    //   setUsers([]);
    //   router.push(`/users?name=${textSearch}`);
    // } else {
    //   router.push(`/users`);
    // }
  };

  const deleteUpload = () => {
    fileInputRef.current.value = "";
    setFileName("");
    setDataReport(null);
  };

  // useEffect(() => {
  //   if (data?.data) {
  //     const newData = data.data?.map((item) => ({
  //       ...item,
  //       nameForSearch: removeAccents(item.name).toLowerCase(),
  //     }));
  //     setUsers(newData);
  //   }
  // }, [data]);

  useEffect(() => {
    if (userInvalid?.length) {
      //alert(`UserId is invalid - ${userInvalid.join(",")}`);
      deleteUpload();
      setOpenUserRelatedForm(true);
    }
  }, [userInvalid]);

  return (
    <Suspense>
      <div>
        <Title>List User MIB/IB</Title>
        <div className="flex gap-x-4 items-center mb-4 py-2">
          <div className="flex-1">
            <div className="flex gap-x-2 items-center max-w-[500px]">
              {/* <label className="hidden md:inline-block w-[120px]">
                Input Name/UID
              </label> */}
              <div className="flex-1">
                <Input
                  placeholder="Input Name/UID"
                  value={textSearch || ""}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setSearchResult(undefined);
                    }
                    setTextSearch(e.target.value);
                  }}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Search
              </Button>
            </div>
          </div>
          <div className="flex space-x-2 items-center">
            <div>{fileName}</div>
            {fileName && (
              <Button
                onClick={() => deleteUpload()}
                variant="secondary"
                className="w-5 h-5 p-1 rounded-full bg-gray-300 hover:bg-gray-200"
              >
                <Cross2Icon className="h-4 w-4" />
              </Button>
            )}
            <Button className="bg-blue-600 hover:bg-blue-500 relative">
              <input
                ref={fileInputRef}
                className="opacity-0 absolute h-full w-full cursor-pointer"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e)}
              />
              Choose Daily Report
            </Button>

            {/* <UserForm userData={data?.data} /> */}
          </div>
        </div>
        {(!isValidating && !userList?.length) || !userList ? (
          <div className="text-center text-lg py-[100px]">
            List user is empty
          </div>
        ) : dataReport ? (
          <UserTreeCommission clientList={dataClient} userList={userList} />
        ) : (
          <UserTree userSearchResult={searchResult} userList={userList} />
        )}
        {isValidating && <p className="py-3">Loading...</p>}
        {/* <ConfirmDialog
          open={openConfirmDelete}
          onOk={() => handleDeleteEmployee()}
          onCancel={() => setOpenConfirmDelete(false)}
          title={"Are you sure to delete this employee?"}
          description={
            "This action cannot be undone. This employee will be permanently removed from your system."
          }
        /> */}
      </div>
      <UserRelatedForm
        userDataList={userInvalid}
        open={openUserRelatedForm}
        onClose={() => {
          setOpenUserRelatedForm(false);
        }}
      />
    </Suspense>
  );
}
