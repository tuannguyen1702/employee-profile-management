import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  children?: TreeNode[];
}

export const buildTree = (items: TreeNode[], noCommission = true): TreeNode[] => {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Tạo map của id -> node
  items.forEach((item) => {
    map.set(item.userId, { ...item, children: [] });
  });

  // Xây dựng cấu trúc cây
  items.forEach((item) => {
    const node = map.get(item.userId);
    if (item.parentId === null) {
      // Nếu là node gốc (parentId là null), thêm vào danh sách gốc (roots)
      roots.push(node as TreeNode);
    } else {
      // Nếu có cha, tìm cha của node này và thêm nó vào mảng children của cha
      const parent = map.get(item.parentId);
      if (parent) {

        if(!noCommission) {
          let total = 0;

          parent.children!.map((item) => {
            total = total + (item.volume || 0) + (item.volumeIndirect || 0);
          })
  
          parent.volumeIndirect = Math.round((total + (node?.volume || 0)) * 100) / 100;
        }

        parent.children!.push(node as TreeNode);
      }

     
    }

  });

  return roots;
};

export function removeAccents(str: string) {
  return str.normalize("NFD") // Tách ký tự và dấu
            .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
            .replace(/đ/g, "d") // Thay đ bằng d
            .replace(/Đ/g, "D"); // Thay Đ bằng D
}
