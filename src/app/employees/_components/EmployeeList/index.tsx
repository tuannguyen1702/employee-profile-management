"use client";

import { ITEM_PER_PAGE } from "@/const";
import { useGetEmployees } from "@/hooks/useGetEmployees";
import { Employee, PositionResource } from "@/interfaces/api";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import Title from "@/components/common/Typography/Title";
import { Button } from "@/components/ui/button";
import { useDeleteEmployee } from "@/hooks/useDeleteEmployee";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Link from "next/link";
import { EmployeeCard } from "../EmployeeCard";
import { useGetPositionResources } from "@/hooks/useGetPositionResources";

export default function EmployeeList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [page, setPage] = useState<number>(1);
  const [deletedIndex, setDeletedIndex] = useState<number | undefined>();
  const [textSearch, setTextSearch] = useState<string | null>(name);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);

  const query: Record<string, string> = {};

  if (name) {
    query.name = name;
  }

  const { data, isValidating } = useGetEmployees({
    ...query,
    _limit: `${ITEM_PER_PAGE}`,
    _page: `${page}`,
  });

  const { data: positionResourcesRes } = useGetPositionResources();

  const positionResources = useMemo(() => {
    const positionResourcesObj: Record<number, PositionResource> = {};
    positionResourcesRes?.data?.map((item) => {
      positionResourcesObj[item.positionResourceId] = item;
    })

    return positionResourcesObj;
  }, [positionResourcesRes]);

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

  const goToCreateEmployee = () => {
    router.push("/employees/create");
  };

  const handleSearch = () => {
    if (textSearch) {
      setEmployees([]);
      router.push(`/employees?name=${textSearch}`);
    } else {
      router.push(`/employees`);
    }
  };

  const loadMore = useCallback(() => {
    if (data?.data?.length === ITEM_PER_PAGE && !isValidating) {
      setPage((prev) => prev + 1);
    }
  }, [data, isValidating]);

  useEffect(() => {
    console.log(`data?.data`, employees, data?.data);
    if (data?.data) {
      setEmployees([...employees, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <Suspense>
      <div>
        <Title>List Employees</Title>
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
            <Button
              onClick={goToCreateEmployee}
              className="bg-green-600 hover:bg-green-500"
            >
              Add Employee
            </Button>
          </div>
        </div>
        {!isValidating && !employees.length ? (
          <div className="text-center text-lg py-[100px]">
            List employees is empty
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 md:gap-8">
            {employees.map((employee, idx) => (
              <Link
                key={idx + employee.name}
                href={`/employees/edit/${employee.id}`}
              >
                <EmployeeCard
                  data={employee}
                  positionResources={positionResources}
                  actions={
                    <Button
                      className="min-w-[100px] hidden group-hover:block"
                      variant="destructive"
                      onClick={(e) => {
                        setDeletedIndex(idx);
                        setOpenConfirmDelete(true);
                        e.preventDefault();
                      }}
                    >
                      Delete
                    </Button>
                  }
                />
              </Link>
            ))}
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
