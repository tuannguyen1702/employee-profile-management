export const ITEM_PER_PAGE = 9999;

export const levels: Record<string, {directCommission: number; inDirectCommission: number}> = {
  Master: {
    directCommission: 63,
    inDirectCommission: 33,
  },
  MIB: {
    directCommission: 30,
    inDirectCommission: 6,
  },
  IB1: {
    directCommission: 24,
    inDirectCommission: 4,
  },
  IB2: {
    directCommission: 20,
    inDirectCommission: 4,
  },
  IB3: {
    directCommission: 16,
    inDirectCommission: 4,
  },
  IB4: {
    directCommission: 12,
    inDirectCommission: 4,
  }
};
