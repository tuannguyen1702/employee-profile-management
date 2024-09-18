"use client";

import * as XLSX from "xlsx";
import { ITEM_PER_PAGE, levels } from "@/const";
import { User } from "@/interfaces/api";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import Title from "@/components/common/Typography/Title";
import { Button } from "@/components/ui/button";
import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import UserForm from "../UserForm";
import { useGetUsers } from "@/hooks/useGetUsers";
import { buildTree, TreeNode } from "@/lib/utils";
import { useGetUserRelated } from "@/hooks/useGetUserRelated";

export default function EmployeeList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [dataReport, setDataReport] = useState<any>(null);
  const [userInvalid, setUserInvalid] = useState<string[] | null>(null);

  const [page, setPage] = useState<number>(1);
  const [deletedIndex, setDeletedIndex] = useState<number | undefined>();
  const [textSearch, setTextSearch] = useState<string | null>(name);
  const [employees, setEmployees] = useState<User[]>([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const query: Record<string, string> = {};

  if (name) {
    query.name_like = name;
  }

  const { data, isValidating } = useGetUsers({
    ...query,
    _limit: `${ITEM_PER_PAGE}`,
    _page: `${page}`,
  });

  const { data: userRelated } = useGetUserRelated();

  const userList = useMemo(() => {
    let newUserList = employees;
    if (dataReport) {
      newUserList = employees.map((item) => ({
        ...item,
        volume: dataReport[item.userId] ?? 0,
        volumeDirect: dataReport[item.userId] ?? 0,
      }));
    }
    const treeData = buildTree(newUserList as unknown as TreeNode[]);

    return treeData;
  }, [employees, dataReport]);

  const userRelatedObj = useMemo(() => {
    const userRelatedData: Record<string, string> = {};
    userRelated?.data?.map((item) => {
      userRelatedData[item.userId] = item.parentId;
    });

    return userRelatedData;
  }, [userRelated]);

  const { trigger: deleteEmployee } = useDeleteEmployee({
    onSuccess: (res: any) => {
      if (res.data && deletedIndex !== undefined) {
        const newEmployeeData = [...employees];
        newEmployeeData.splice(deletedIndex, 1);
        setEmployees(newEmployeeData);
      }
    },
  });

  const handleDeleteEmployee = () => {
    setOpenConfirmDelete(false);
    if (deletedIndex !== undefined) {
      const deleteEmployeeSelected = employees.slice(
        deletedIndex,
        deletedIndex + 1
      );
      if (deleteEmployeeSelected?.length)
        deleteEmployee({ id: deleteEmployeeSelected[0].id?.toString() || "" });
    }
  };

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "100px",
  });

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
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
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSearch = () => {
    // if (textSearch) {
    //   setEmployees([]);
    //   router.push(`/employees?name=${textSearch}`);
    // } else {
    //   router.push(`/employees`);
    // }
  };

  const loadMore = useCallback(() => {
    if (data?.data?.length === ITEM_PER_PAGE && !isValidating) {
      setPage((prev) => prev + 1);
    }
  }, [data, isValidating]);

  useEffect(() => {
    if (data?.data) {
      setEmployees([...employees, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    if (userInvalid?.length) {
      alert(`UserId is invalid - ${userInvalid.join(',')}`);
    }
  }, [userInvalid]);

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) =>
      node.volumeDirect || node.volumeIndirect ? (
        <div key={node.id} className="ml-4">
          <div className="flex bg-slate-200 my-0.5 py-1 px-2 rounded-sm">
            <div className="flex-1">{node.name}</div>
            <div>{node.level}</div>
            <div className="w-[160px] px-4 text-right">
              {node.volumeDirect || "--"}
            </div>
            <div className="w-[160px] px-4 text-right">
              {node.volumeIndirect || "--"}
            </div>
            <div className="w-[200px] px-4 text-right">
              {node.volumeDirect
                ? Math.round(
                    levels[node.level].directCommission *
                      node.volumeDirect *
                      100
                  ) / 100
                : "--"}
            </div>
            <div className="w-[200px] px-4 text-right">
              {node.volumeIndirect
                ? Math.round(
                    levels[node.level].inDirectCommission *
                      node.volumeIndirect *
                      100
                  ) / 100
                : "--"}
            </div>
            <div className="w-[160px] px-4 text-right">
              {Math.round(
                (levels[node.level].inDirectCommission *
                  (node.volumeIndirect || 0) +
                  levels[node.level].directCommission *
                    (node.volumeDirect || 0)) *
                  100
              ) / 100}
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <div>{renderTree(node.children)}</div> // Đệ quy để render các phần tử con
          )}
        </div>
      ) : (
        ""
      )
    );
  };

  return (
    <Suspense>
      <div>
        <Title>List User MIB/IB</Title>
        <div className="flex gap-x-4 items-center mb-4 py-2">
          <div className="flex-1">
            <div className="flex gap-x-2 items-center max-w-[700px]">
              <label className="hidden md:inline-block w-[120px]">
                Search name
              </label>
              <div className="flex-1">
                <Input
                  placeholder="Input name"
                  value={textSearch || ""}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  onChange={(e) => {
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
          <div>
            {/* <Button
              onClick={importReportFile}
              className="bg-green-600 hover:bg-green-500"
            >
              Import Report File
            </Button> */}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            {/* <UserForm userData={data?.data} /> */}
          </div>
        </div>
        {/* <div className="grid ">
            {dataReport?.map((item: any, idx: number) => {
              return parseFloat(item.Volume) > 0 ? <div key={`client_${item.UserId}_${idx}`} className="flex">
                <div className='pr-4'>{idx + 1}</div>
                <div className='pr-4'>{item.UserId}</div>
                <div className="flex-1">{item.Name}</div>
                <div>{item.Volume}</div>
              </div> : ''
})}
          </div> */}
        {(!isValidating && !userList?.length) || !userList ? (
          <div className="text-center text-lg py-[100px]">
            List user is empty
          </div>
        ) : (
          <div className="bg-slate-100 px-1 py-0.5 rounded-sm">
            <div className="flex bg-slate-200 my-0.5 py-1 px-2 rounded-sm font-semibold">
              <div className="flex-1">Name</div>
              <div>Level</div>
              <div className="w-[160px] px-4 text-right">Direct Volume</div>
              <div className="w-[160px] px-4 text-right">Indirect Volume</div>
              <div className="w-[200px] px-4 text-right">Direct Commission</div>
              <div className="w-[200px] px-4 text-right">
                Indirect Commission
              </div>
              <div className="w-[160px] px-4 text-right">Total Income</div>
            </div>
            <div className="-ml-4">
              {renderTree(userList)} {/* Render cây từ dữ liệu */}
            </div>
          </div>
        )}
        {isValidating && <p className="py-3">Loading...</p>}
        <div ref={ref} />
        <ConfirmDialog
          open={openConfirmDelete}
          onOk={() => handleDeleteEmployee()}
          onCancel={() => setOpenConfirmDelete(false)}
          title={"Are you sure to delete this employee?"}
          description={
            "This action cannot be undone. This employee will be permanently removed from your system."
          }
        />
      </div>
    </Suspense>
  );
}
