export const ITEM_PER_PAGE = 9999;

export const clientCommission = {
  lv1: {
    minNet: 1000,
    minVol: 40,
    commission: 0.5,
  },
  lv2: {
    minNet: 10001,
    minVol: 401,
    commission: 1,
  },
}

export const levels: Record<
  string,
  {
    directCommission: number;
    inDirectCommission: number;
    monthlyCommission: {
      lv1: {
        min: number;
        commission: number;
      };
      lv2: {
        min: number;
        commission: number;
      };
    };
  }
> = {
  Master: {
    directCommission: 63,
    inDirectCommission: 33,
    monthlyCommission: {
      lv1: {
        min: 0,
        commission: 0,
      },
      lv2: {
        min: 0,
        commission: 0,
      },
    },
  },
  MIB: {
    directCommission: 30,
    inDirectCommission: 6,
    monthlyCommission: {
      lv1: {
        min: 0,
        commission: 0.5,
      },
      lv2: {
        min: 4999,
        commission: 1,
      },
    },
  },
  IB1: {
    directCommission: 24,
    inDirectCommission: 4,
    monthlyCommission: {
      lv1: {
        min: 99,
        commission: 0.5,
      },
      lv2: {
        min: 999,
        commission: 1,
      },
    },
  },
  IB2: {
    directCommission: 20,
    inDirectCommission: 4,
    monthlyCommission: {
      lv1: {
        min: 99,
        commission: 0.5,
      },
      lv2: {
        min: 999,
        commission: 1,
      },
    },
  },
  IB3: {
    directCommission: 16,
    inDirectCommission: 4,
    monthlyCommission: {
      lv1: {
        min: 99,
        commission: 0.5,
      },
      lv2: {
        min: 999,
        commission: 1,
      },
    },
  },
  IB4: {
    directCommission: 12,
    inDirectCommission: 4,
    monthlyCommission: {
      lv1: {
        min: 99,
        commission: 0.5,
      },
      lv2: {
        min: 999,
        commission: 1,
      },
    },
  },
};
