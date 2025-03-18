"use client";

import * as XLSX from "xlsx";
import { configKeys, ITEM_PER_PAGE } from "@/const";
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
import UserForm from "../UserForm";
import ClientForm from "../ClientForm";
import ClientFormUpdate from "../ClientFormUpdate";
import { useGetConfigByKey } from "@/hooks/useGetConfigByKey";

export default function UserList() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const users = userStore((state) => state.users);
  const userRelated = userRelatedStore((state) => state.userRelated);

  const [dataReport, setDataReport] = useState<Record<
    string,
    { vol: number; volSymbol: Record<string, number> | null }
  > | null>(null);
  const [dataClient, setDataClient] = useState<Record<
    string,
    ClientReport
  > | null>(null);
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

  const [openUserForm, setOpenUserForm] = useState(false);
  const [openClientForm, setOpenClientForm] = useState(false);
  const [openClientFormUpdate, setOpenClientFormUpdate] = useState(false);
  const [userSelected, setUserSelected] = useState<
    { user?: TreeNode | User; isEdit: boolean } | undefined
  >(undefined);

  const handleOpenUserForm = (user?: TreeNode | User, isEdit = false) => {
    setOpenUserForm(true);
    setUserSelected({ user, isEdit });
  };

  const handleOpenClientForm = (user: TreeNode | User) => {
    setOpenClientForm(true);
    setUserSelected({ user, isEdit: false });
  };
  const handleOpenClientFormUpdate = (user: TreeNode | User) => {
    setOpenClientFormUpdate(true);
    setUserSelected({ user, isEdit: false });
  };

  const { error, isValidating } = useGetUsers({
    ...query,
    _limit: `${ITEM_PER_PAGE}`,
    _page: `${page}`,
  });

  const { error: userRelatedError } = useGetUserRelated();
  const { error: commissionError } = useGetConfigByKey(
    configKeys.COMMISSION_TYPE
  );

  const userList = useMemo(() => {
    let newUserList = users;
    if (dataReport) {
      newUserList = users.map((item) => ({
        ...item,
        volume: dataReport[item.userId]?.vol ?? 0,
        volumeDirect: dataReport[item.userId]?.vol ?? 0,
        volSymbol: dataReport[item.userId]?.volSymbol,
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

  const handleFileUpload = (event: any, isDaily = true) => {
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
      const newData: Record<
        string,
        { vol: number; volSymbol: Record<string, number> | null }
      > = {};
      const clientData: Record<string, ClientReport> = {};
      const invalidUsers: string[] = [];
      let totalVol = 0;
      // let testVol = 0;
      jsonData?.map((item: any) => {
        const vol = parseFloat(item.Volume ?? item.volume);

        const userId = item.UserId ?? item.UID ?? item.login;

        if (vol > 0) {
          totalVol = Math.round((totalVol + vol) * 100) / 100;

          // If user is valid
          if (userRelatedObj[userId]) {

            // if('213686' === userRelatedObj[userId]) {
            //   testVol = testVol + parseFloat(item.Volume ?? item.volume)
            //   console.log(parseFloat(item.Volume ?? item.volume), testVol)
            // }
            const newVol = newData[userRelatedObj[userId]] //Parent object is valid
              ? Math.round((vol + newData[userRelatedObj[userId]].vol) * 100) /
                100
              : vol;

            let symbol = (item.Symbol ?? item.symbol) as string;

            symbol = symbol.replace(/.v/, '');

            let volSymbol = {
              ...(newData[userRelatedObj[userId]]?.volSymbol ?? {}),
            };

            if (volSymbol[symbol]) {
              volSymbol = {
                ...volSymbol,
                [symbol]: Math.round((volSymbol[symbol] + vol) * 100) / 100,
              };
            } else {
              volSymbol = {
                ...volSymbol,
                [symbol]: vol,
              };
            }

            newData[userRelatedObj[userId]] = {
              vol: newVol,
              volSymbol: symbol ? volSymbol : null,
            };

            const newClient = clientData[userId];
            const deposit = parseFloat(item.Deposit);
            const withdrawal = parseFloat(item.Withdrawal);

            if (newClient) {
              clientData[userId] = {
                userId: item.UserId,
                vol: Math.round((newClient.vol + vol) * 100) / 100,
                name: item.Name,
                deposit: newClient.deposit + deposit,
                withdrawal: newClient.withdrawal + withdrawal,
              };
            } else {
              clientData[userId] = {
                userId: userId,
                vol: vol,
                name: item.Name,
                deposit: deposit,
                withdrawal: withdrawal,
              };
            }
          } else {
            if (!invalidUsers.includes(userId)) invalidUsers.push(userId);
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
              <Button onClick={() => handleOpenUserForm()} variant="secondary">
                Add Master
              </Button>
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
            {/* <Button className="bg-blue-600 hover:bg-blue-500 relative">
              <input
                ref={fileInputRef}
                className="opacity-0 absolute h-full w-full cursor-pointer"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e)}
              />
              Daily Report
            </Button> */}

            <Button className="bg-blue-600 hover:bg-blue-500 relative">
              <input
                ref={fileInputRef}
                className="opacity-0 absolute h-full w-full cursor-pointer"
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e, false)}
              />
              Import Report
            </Button>

            {/* <UserForm userData={data?.data} /> */}
          </div>
        </div>
        {(!isValidating && !userList?.length) || !userList ? (
          <div className="text-center text-lg py-[100px]">
            List user is empty
          </div>
        ) : dataReport ? (
          <UserTreeCommission clientObj={dataClient} userList={userList} />
        ) : (
          <UserTree
            openClientForm={handleOpenClientForm}
            openUserForm={handleOpenUserForm}
            openClientFormUpdate={handleOpenClientFormUpdate}
            userSearchResult={searchResult}
            userList={userList}
          />
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
      <UserForm
        parentData={userSelected}
        open={openUserForm}
        onClose={() => setOpenUserForm(false)}
      />
      <ClientForm
        parentData={userSelected}
        open={openClientForm}
        onClose={() => setOpenClientForm(false)}
      />
      <ClientFormUpdate
        parentData={userSelected}
        open={openClientFormUpdate}
        onClose={() => setOpenClientFormUpdate(false)}
      />
    </Suspense>
  );
}