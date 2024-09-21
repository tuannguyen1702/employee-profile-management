"use client";

import { levels } from "@/const";
import { Suspense } from "react";
import { TreeNode } from "@/lib/utils";

interface UserTreeCommissionProps {
  userList: TreeNode[];
}

export default function UserTreeCommission(props: UserTreeCommissionProps) {
  const { userList } = props;

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) =>
      node.volumeDirect || node.volumeIndirect ? (
        <div key={node.id} className="ml-4">
          <div
            data-type={node.level}
            className="flex data-[type=Master]:bg-blue-500 data-[type=Master]:text-white data-[type=MIB]:bg-blue-400 data-[type=IB1]:bg-blue-300 data-[type=IB2]:bg-blue-200 data-[type=IB3]:bg-blue-100 data-[type=IB4]:bg-blue-50 bg-slate-200 my-0.5 py-1 px-2 rounded-sm"
          >
            <div className="flex-1">{node.name}</div>
            <div className="w-[100px] px-3 text-right">{node.userId}</div>
            <div className="w-[80px] px-3 text-right">{node.level}</div>
            <div className="w-[120px] px-3 text-right">
              {node.volumeDirect || "--"}
            </div>
            <div className="w-[120px] px-3 text-right">
              {node.volumeIndirect || "--"}
            </div>
            <div className="w-[190px] px-3 text-right">
              {node.volumeDirect
                ? Math.round(
                    levels[node.level].directCommission *
                      node.volumeDirect *
                      100
                  ) / 100
                : "--"}
            </div>
            <div className="w-[190px] px-3 text-right">
              {node.volumeIndirect
                ? Math.round(
                    levels[node.level].inDirectCommission *
                      node.volumeIndirect *
                      100
                  ) / 100
                : "--"}
            </div>
            <div className="w-[140px] px-3 text-right">
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
        <div className="bg-slate-100 py-0.5 rounded-sm">
          <div className="flex bg-black/0 my-0.5 py-1 px-2 rounded-sm font-semibold">
            <div className="flex-1">Name</div>
            <div className="w-[100px] px-3 text-right">UID</div>
            <div className="w-[80px] px-3 text-right">Level</div>
            <div className="w-[120px] px-3 text-right">Direct Vol</div>
            <div className="w-[120px] px-3 text-right">Indirect Vol</div>
            <div className="w-[190px] px-3 text-right">Direct Commission</div>
            <div className="w-[190px] px-3 text-right">Indirect Commission</div>
            <div className="w-[140px] px-3 text-right">Total Income</div>
          </div>
          <div className="-ml-4">{renderTree(userList)}</div>
        </div>
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
    </Suspense>
  );
}
