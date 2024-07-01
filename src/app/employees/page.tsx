'use client'

import { ITEM_PER_PAGE } from "@/const";
import { useGetEmployees } from "@/hooks/useGetEmployees";
import { Employee } from "@/interfaces/api";
import { useCallback, useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import { EmployeeCard } from "./_components/EmployeeCard";
import Title from "@/components/common/Typography/Title";

export default function Employees() {

  const [page, setPage] = useState(1);
  const { data, isValidating } = useGetEmployees({_limit: `${ITEM_PER_PAGE}`, _page: `${page}`})

  const [employees, setEmployees] = useState<Employee[]>([]);
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '100px',
  });

  const loadMore = useCallback(() => {
    if (data?.data?.length === ITEM_PER_PAGE && !isValidating) {
      setPage((prev) => prev + 1);
    }
  }, [data, isValidating]);

  useEffect(() => {
    if (data?.data) {
      setEmployees((prev) => [...prev, ...data.data]);
    }
  }, [data]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <div>
      <Title>List Employees</Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 md:gap-8">
        {employees.map((employee, idx) => (
          <EmployeeCard key={idx} data={employee} />
        ))}
      </div>
      {isValidating && <p>Loading...</p>}
      <div ref={ref} />
    </div>
  );
}
