import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TreeNode {
  id?: number;
  userId: string;
  name: string;
  nameForSearch: string;
  level: string;
  parentId: string | null;
  volume: number;
  volumeDirect: number;
  volumeIndirect: number;
  tolCommission?: number;
  children?: TreeNode[];
  volSymbol?: Record<string, number>;
  volIndirectSymbol?: Record<string, number>;
  commissionSettingId?: string;
}

export interface ClientReport {
  userId: string;
  name: string;
  volSymbol?: Record<string, number>;
  vol: number;
  deposit: number;
  withdrawal: number;
}

export const buildTree = (
  items: TreeNode[],
  noCommission = true
): TreeNode[] => {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Tạo map của id -> node
  items.forEach((item) => {
    map.set(item.userId, { ...item, children: [] });
  });

  // Xây dựng cấu trúc cây
  items.forEach((item) => {
    const node = map.get(item.userId);
    if (!item.parentId) {
      // Nếu là node gốc (parentId là null), thêm vào danh sách gốc (roots)
      roots.push(node as TreeNode);
    } else {
      // Nếu có cha, tìm cha của node này và thêm nó vào mảng children của cha
      const parent = map.get(item.parentId);
      if (parent) {
        if (!noCommission) {
          let total = 0;
          let newVolSymbol: Record<string, number> = {};

          const getVolSymbol = (
            volSymbol: Record<string, number>,
            volIndirectSymbol: Record<string, number>
          ) => {
            Object.keys(volSymbol).map((key) => {
              if (newVolSymbol[key]) {
                newVolSymbol[key] = volSymbol[key] + newVolSymbol[key];
              } else {
                newVolSymbol[key] = volSymbol[key];
              }
            });

            Object.keys(volIndirectSymbol).map((key) => {
              if (newVolSymbol[key]) {
                newVolSymbol[key] = volIndirectSymbol[key] + newVolSymbol[key];
              } else {
                newVolSymbol[key] = volIndirectSymbol[key];
              }
            });
          };

          parent.children!.map((item) => {
            
            total = total + (item.volume || 0) + (item.volumeIndirect || 0);

            getVolSymbol(item.volSymbol ?? {}, item.volIndirectSymbol ?? {});
          });

          getVolSymbol(node?.volSymbol ?? {}, node?.volIndirectSymbol ?? {});

          parent.volIndirectSymbol = newVolSymbol;

          parent.volumeIndirect =
            Math.round(
              (total + (node?.volume || 0) + (node?.volumeIndirect || 0)) * 100
            ) / 100;
        }

        parent.children!.push(node as TreeNode);
      }
    }
  });

  console.log(`roots`, roots);

  return roots;
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD") // Tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/đ/g, "d") // Thay đ bằng d
    .replace(/Đ/g, "D"); // Thay Đ bằng D
}
