"use client";

import { clientCommission, levels } from "@/const";
import { Suspense, useState } from "react";
import { ClientReport, TreeNode } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserTreeCommissionProps {
  userList: TreeNode[];
  clientList: ClientReport[];
}

export default function UserTreeCommission(props: UserTreeCommissionProps) {
  const { userList, clientList = [] } = props;
  const [type, setType] = useState("daily");
  const [tabValue, setTabValue] = useState("mib");

  const monthlyCommissionCal = (node: TreeNode, level: string) => {
    const vol =
      node.volumeIndirect || node.volumeDirect
        ? Math.round(
            ((node.volumeDirect ?? 0) + (node.volumeIndirect ?? 0)) * 100
          ) / 100
        : 0;

    if (!vol) return { vol: 0, commission: 0 };

    let ratio = 0;

    if (vol > levels[level].monthlyCommission.lv2.min) {
      ratio = levels[level].monthlyCommission.lv2.commission;
    } else if (vol > levels[level].monthlyCommission.lv1.min) {
      ratio = levels[level].monthlyCommission.lv1.commission;
    }

    return { vol: vol, commission: Math.round(ratio * vol * 100) / 100 };
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => {
      let monthlyData = null;
      if (type === "monthly") {
        monthlyData = monthlyCommissionCal(node, node.level);
      }

      return ((node.volumeDirect || node.volumeIndirect) && type === "daily") ||
        (type === "monthly" && monthlyData?.commission) ||
        node.level === "Master" ? (
        <div key={node.id} className="ml-4">
          <div
            data-type={node.level}
            className="flex data-[type=Master]:hidden data-[type=Master]:text-white data-[type=MIB]:bg-blue-400 data-[type=IB1]:bg-blue-300 data-[type=IB2]:bg-blue-200 data-[type=IB3]:bg-blue-100 data-[type=IB4]:bg-blue-50 bg-slate-200 my-0.5 py-1 px-2 rounded-sm"
          >
            <div className="flex-1">{node.name}</div>
            <div className="w-[100px] px-3 text-right">{node.userId}</div>
            <div className="w-[80px] px-3 text-right">{node.level}</div>
            {type === "daily" ? (
              <>
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
              </>
            ) : (
              <>
                <div className="w-[190px] px-3 text-right">
                  {monthlyData?.vol}
                </div>
                <div className="w-[190px] px-3 text-right">
                  {monthlyData?.commission}
                </div>
              </>
            )}
          </div>
          {node.children && node.children.length > 0 && (
            <div>{renderTree(node.children)}</div> // Đệ quy để render các phần tử con
          )}
        </div>
      ) : (
        ""
      );
    });
  };

  const renderClientBody = (nodes: ClientReport[]) => {
    return nodes.map((node) => {
      const netMoney = Math.round((node.deposit - node.withdrawal) * 100) / 100;
      let commission = 0;

      if (
        clientCommission.lv1.minNet > netMoney ||
        clientCommission.lv1.minVol > node.vol
      )
        return "";

      if (
        clientCommission.lv2.minNet <= netMoney &&
        clientCommission.lv2.minVol <= node.vol
      ) {
        commission =
          Math.round(node.vol * clientCommission.lv2.commission * 100) / 100;
      } else {
        commission =
          Math.round(node.vol * clientCommission.lv1.commission * 100) / 100;
      }

      return (
        <div
          className="flex bg-blue-100 mt-[1px] py-1 rounded-sm peer have-item"
          key={node.userId}
        >
          <div className="flex-1 px-3">{node.name}</div>
          <div className="w-[100px] px-3 text-right">{node.userId}</div>
          <div className="w-[190px] px-3 text-right">{node.vol}</div>
          <div className="w-[190px] px-3 text-right">{commission}</div>
        </div>
      );
    });
  };

  const renderContent = () => (
    <div>
      <div className="bg-slate-100 py-0.5 rounded-sm">
        <div className="flex bg-black/0 my-0.5 py-1 px-2 rounded-sm font-semibold">
          <div className="flex-1">Name</div>
          <div className="w-[100px] px-3 text-right">UID</div>
          <div className="w-[80px] px-3 text-right">Level</div>
          {type === "daily" ? (
            <>
              <div className="w-[120px] px-3 text-right">Direct Vol</div>
              <div className="w-[120px] px-3 text-right">Indirect Vol</div>
              <div className="w-[190px] px-3 text-right">Direct Commission</div>
              <div className="w-[190px] px-3 text-right">
                Indirect Commission
              </div>
              <div className="w-[140px] px-3 text-right">Total Income</div>
            </>
          ) : (
            <>
              <div className="w-[190px] px-3 text-right">Vol</div>
              <div className="w-[190px] px-3 text-right">Total Commission</div>
            </>
          )}
        </div>
        <div className="-ml-8">{renderTree(userList)}</div>
      </div>
    </div>
  );

  const renderClientContent = () => (
    <div className="bg-slate-100 py-0.5 rounded-sm">
      <div className="flex bg-black/0 my-0.5 py-1 rounded-sm font-semibold">
        <div className="flex-1 px-3">Name</div>
        <div className="w-[100px] px-3 text-right">UID</div>
        <div className="w-[190px] px-3 text-right">Vol</div>
        <div className="w-[190px] px-3 text-right">Total Commission</div>
      </div>
      <div>
        {renderClientBody(clientList)}
        <div className="bg-slate-200 peer-[.have-item]:hidden text-center py-3 rounded-sm">
          No clients received commission
        </div>
      </div>
    </div>
  );

  return (
    <Suspense>
      <Tabs value={tabValue} onValueChange={setTabValue}>
        <div className="flex">
          <div className="flex-1">
            <TabsList
              data-type={type}
              className="grid max-w-[400px] grid-cols-2 data-[type=daily]:hidden"
            >
              <TabsTrigger value="mib">MIB/IN Commission</TabsTrigger>
              <TabsTrigger value="client">Client Commission</TabsTrigger>
            </TabsList>
          </div>
          <Select
            defaultValue={type}
            onValueChange={(value) => {
              setType(value);
              setTabValue("mib");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily Report</SelectItem>
              <SelectItem value="monthly">Monthly Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsContent value="mib">{renderContent()}</TabsContent>
        <TabsContent value="client">{renderClientContent()}</TabsContent>
      </Tabs>
    </Suspense>
  );
}
