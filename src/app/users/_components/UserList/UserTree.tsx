"use client";

import { Suspense, useState } from "react";
import { TreeNode } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserForm from "../UserForm";
import ClientForm from "../ClientForm";
import { User } from "@/interfaces/api";

interface UserTreeProps {
  userList?: TreeNode[];
  userSearchResult?: User[];
}

export default function UserTree(props: UserTreeProps) {
  const { userList, userSearchResult } = props;

  const [openUserForm, setOpenUserForm] = useState(false);
  const [openClientForm, setOpenClientForm] = useState(false);
  const [userSelected, setUserSelected] = useState<TreeNode | User | undefined>(
    undefined
  );

  const handleOpenUserForm = (user: TreeNode | User) => {
    setOpenUserForm(true);
    setUserSelected(user);
  };

  const handleOpenClientForm = (user: TreeNode | User) => {
    setOpenClientForm(true);
    setUserSelected(user);
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <div key={node.id} className="ml-4">
        <div
          data-type={node.level}
          className="flex data-[type=Master]:bg-blue-500 data-[type=Master]:text-white data-[type=MIB]:bg-blue-400 data-[type=IB1]:bg-blue-300 data-[type=IB2]:bg-blue-200 data-[type=IB3]:bg-blue-100 data-[type=IB4]:bg-blue-50 bg-slate-200 my-0.5 py-1 px-2 rounded-sm"
        >
          <div className="flex-1">{node.name}</div>
          <div className="w-[120px] px-3 text-right">{node.userId}</div>
          <div className="w-[120px] px-3 text-right">{node.level}</div>

          <div className="w-[250px] flex pl-3 text-right justify-end items-center">
            <Button
              onClick={() => {
                handleOpenUserForm(node);
              }}
              variant="secondary"
              size="xs"
              className="mr-2"
            >
              Add MIB/IB
            </Button>
            <Button
              onClick={() => handleOpenClientForm(node)}
              variant="secondary"
              size="xs"
            >
              Add Client
            </Button>
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div>{renderTree(node.children)}</div> // Đệ quy để render các phần tử con
        )}
      </div>
    ));
  };

  const renderUserSearchResult = (users: User[]) => {
    if (!users.length) return <div className="bg-slate-200 p-6 text-center rounded-sm mx-0.5">User not found</div>;

    return users.map((user) => (
      <div key={user.id}>
        <div
          data-type={user.level}
          className="flex data-[type=Master]:bg-blue-500 data-[type=Master]:text-white data-[type=MIB]:bg-blue-400 data-[type=IB1]:bg-blue-300 data-[type=IB2]:bg-blue-200 data-[type=IB3]:bg-blue-100 data-[type=IB4]:bg-blue-50 bg-slate-200 my-0.5 py-1 px-2 rounded-sm"
        >
          <div className="flex-1">{user.name}</div>
          <div className="w-[120px] px-3 text-right">{user.userId}</div>
          <div className="w-[120px] px-3 text-right">{user.level}</div>

          <div className="w-[250px] flex pl-3 text-right justify-end items-center">
            <Button
              onClick={() => {
                handleOpenUserForm(user);
              }}
              variant="secondary"
              size="xs"
              className="mr-2"
            >
              Add MIB/IB
            </Button>
            <Button
              onClick={() => handleOpenClientForm(user)}
              variant="secondary"
              size="xs"
            >
              Add Client
            </Button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Suspense>
      <div>
        <div className="bg-slate-100 py-0.5 rounded-sm">
          <div className="flex bg-black/0 my-0.5 py-1 px-2 rounded-sm font-semibold">
            <div className="flex-1">Name</div>
            <div className="w-[120px] px-3 text-right">UID</div>
            <div className="w-[120px] px-3 text-right">Level</div>
            <div className="w-[250px] px-3 text-right">Actions</div>
          </div>
          {userSearchResult ? (
            renderUserSearchResult(userSearchResult)
          ) : (
            <div className="-ml-4">{renderTree(userList ?? [])}</div>
          )}
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
      <UserForm
        parentData={userSelected as TreeNode}
        open={openUserForm}
        onClose={() => setOpenUserForm(false)}
      />
      <ClientForm
        parentData={userSelected as TreeNode}
        open={openClientForm}
        onClose={() => setOpenClientForm(false)}
      />
    </Suspense>
  );
}
