export const membershipPackages = {
  basic: {
    id: "basic",
    title: "BASIC",
    price: 199000,
    durationDays: 10,
    totalCourses: 10,
    dailyLimit: 1,
    bonusPremiumCourses: 0,
    extraCourses: 0,
    allowCourseRange: "39.000đ-99.000đ + khóa 1đ",
    avgPricePerCourse: "20.000đ/khóa",
    description: "Phù hợp cho người muốn trải nghiệm ngắn hạn.",
    rules: [
      "Trong 10 ngày có thể mở tối đa 10 khóa",
      "Hết 10 ngày hoặc hết 10 khóa thì gói kết thúc"
    ],
  },
  standard: {
    id: "standard",
    title: "STANDARD",
    price: 299000,
    durationDays: 30,
    totalCourses: 30,
    dailyLimit: 1,
    bonusPremiumCourses: 0,
    extraCourses: 0,
    allowCourseRange: "39.000đ-149.000đ + khóa 1đ, 2đ",
    avgPricePerCourse: "10.000đ/khóa",
    description: "Phù hợp học đều trong 1 tháng.",
    rules: [
      "Mỗi ngày chỉ mở tối đa 1 khóa",
      "Sau 30 ngày gói hết hạn"
    ],
  },
  silver: {
    id: "silver",
    title: "SILVER",
    price: 499000,
    durationDays: 90,
    totalCourses: 180,
    dailyLimit: 2,
    bonusPremiumCourses: 0,
    extraCourses: 0,
    allowCourseRange: "39.000đ-149.000đ + khóa 1đ, 2đ",
    avgPricePerCourse: "8.000đ/khóa",
    description: "Phù hợp học nhiều trong 3 tháng.",
    rules: [
      "Mỗi ngày mở tối đa 2 khóa",
      "Sau 90 ngày gói hết hạn"
    ],
  },
  premium: {
    id: "premium",
    title: "PREMIUM",
    price: 699000,
    durationDays: 90,
    totalCourses: 180,
    dailyLimit: 2,
    bonusPremiumCourses: 3,
    extraCourses: 0,
    allowCourseRange: "39.000đ-149.000đ + khóa 1đ, 2đ",
    avgPricePerCourse: "4.000đ/khóa",
    description: "Phù hợp học nghiêm túc trong 3 tháng.",
    rules: [
      "Mỗi ngày mở tối đa 2 khóa",
      "Sau 90 ngày gói hết hạn"
    ],
  },
  gold: {
    id: "gold",
    title: "GOLD",
    price: 999000,
    durationDays: 365,
    totalCourses: 1095,
    dailyLimit: 3,
    bonusPremiumCourses: 5,
    extraCourses: 2,
    allowCourseRange: "39.000đ-149.000đ + khóa 1đ, 2đ",
    avgPricePerCourse: "1.100đ/khóa",
    description: "Phù hợp học lâu dài, tiết kiệm.",
    rules: [
      "Mỗi ngày mở tối đa 3 khóa",
      "Sau 365 ngày gói hết hạn"
    ],
  },
  diamond: {
    id: "diamond",
    title: "DIAMOND",
    price: 1499000,
    durationDays: 365,
    totalCourses: 1095,
    dailyLimit: 3,
    bonusPremiumCourses: 36,
    extraCourses: 4,
    allowCourseRange: "39.000đ-149.000đ + khóa 1đ, 2đ",
    avgPricePerCourse: "900đ/khóa",
    description: "Phù hợp người muốn full quyền lợi VIP và học rất nhiều.",
    rules: [
      "Mỗi ngày mở tối đa 3 khóa",
      "Sau 365 ngày gói hết hạn"
    ],
  },
};
