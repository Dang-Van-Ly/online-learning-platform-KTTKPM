/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

// DÒNG QUAN TRỌNG NHẤT: Phải có "export" ở đây
export const AuthContext = createContext({
    user: null,
    purchasedCourseIds: [],
    cartItems: [],
    favoriteCourseIds: [],
    membershipInfo: null,
    membershipHistory: [],
    loginUser: () => {},
    logoutUser: () => {},
    addPurchasedCourse: () => {},
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
    addFavoriteCourse: () => {},
    removeFavoriteCourse: () => {},
    toggleFavoriteCourse: () => {},
    addMembership: () => {},
    loadUserData: () => {},
    useMembershipCourse: () => {},
});

const STORAGE_USER_KEY = "user";
const STORAGE_PURCHASED_KEY = "purchasedCourseIds";
const STORAGE_CART_KEY = "cartItems";
const STORAGE_FAVORITES_KEY = "favoriteCourseIds";
const STORAGE_MEMBERSHIP_KEY = "membershipInfo";
const STORAGE_MEMBERSHIP_HISTORY_KEY = "membershipHistory";

const normalizeMembershipInfo = (membership) => {
    if (!membership) return null;
    const now = new Date();
    const expiresAt = new Date(membership.expiresAt);
    const lastUsedDay = membership.lastUsedDate ? membership.lastUsedDate.split("T")[0] : null;
    const today = now.toISOString().split("T")[0];
    const usedToday = lastUsedDay === today ? Number(membership.usedToday || 0) : 0;
    const remainingTotal = Math.max(0, (membership.totalCourses || 0) - (membership.usedCourses || 0));
    const isExpired = expiresAt <= now || remainingTotal <= 0;

    return {
        ...membership,
        usedToday,
        status: isExpired ? "expired" : membership.status || "active",
    };
};

export const AuthProvider = ({ children }) => {
    // Khởi tạo state đồng bộ từ localStorage để tránh bị "đá" ra trang chủ
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem(STORAGE_USER_KEY);
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem(STORAGE_USER_KEY);
                return null;
            }
        }
        return null;
    });
    const [purchasedCourseIds, setPurchasedCourseIds] = useState(() => {
        const savedPurchased = localStorage.getItem(STORAGE_PURCHASED_KEY);
        if (!savedPurchased) return [];
        try {
            const ids = JSON.parse(savedPurchased);
            return Array.isArray(ids) ? ids.map(String) : [];
        } catch (error) {
            console.error('Error parsing purchased course IDs:', error);
            localStorage.removeItem(STORAGE_PURCHASED_KEY);
            return [];
        }
    });
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem(STORAGE_CART_KEY);
        if (!savedCart) return [];
        try {
            const items = JSON.parse(savedCart);
            return Array.isArray(items) ? items : [];
        } catch (error) {
            console.error('Error parsing cart items:', error);
            localStorage.removeItem(STORAGE_CART_KEY);
            return [];
        }
    });
    const [favoriteCourseIds, setFavoriteCourseIds] = useState(() => {
        const savedFavorites = localStorage.getItem(STORAGE_FAVORITES_KEY);
        if (!savedFavorites) return [];
        try {
            const ids = JSON.parse(savedFavorites);
            return Array.isArray(ids) ? ids.map(String) : [];
        } catch (error) {
            console.error('Error parsing favorite course IDs:', error);
            localStorage.removeItem(STORAGE_FAVORITES_KEY);
            return [];
        }
    });
    const [membershipInfo, setMembershipInfo] = useState(() => {
        const savedMembership = localStorage.getItem(STORAGE_MEMBERSHIP_KEY);
        if (!savedMembership) return null;
        try {
            return normalizeMembershipInfo(JSON.parse(savedMembership));
        } catch (error) {
            console.error('Error parsing membership info:', error);
            localStorage.removeItem(STORAGE_MEMBERSHIP_KEY);
            return null;
        }
    });
    const [membershipHistory, setMembershipHistory] = useState(() => {
        const savedHistory = localStorage.getItem(STORAGE_MEMBERSHIP_HISTORY_KEY);
        if (!savedHistory) return [];
        try {
            const history = JSON.parse(savedHistory);
            return Array.isArray(history) ? history : [];
        } catch (error) {
            console.error('Error parsing membership history:', error);
            localStorage.removeItem(STORAGE_MEMBERSHIP_HISTORY_KEY);
            return [];
        }
    });

    useEffect(() => {
        if (!membershipInfo) return;
        const normalized = normalizeMembershipInfo(membershipInfo);
        if (normalized.status !== membershipInfo.status || normalized.usedToday !== membershipInfo.usedToday) {
            setMembershipInfo(normalized);
            localStorage.setItem(STORAGE_MEMBERSHIP_KEY, JSON.stringify(normalized));
        }
    }, [membershipInfo]);

    const persistPurchasedCourseIds = (ids) => {
        const normalized = Array.isArray(ids) ? ids.map(String) : [];
        setPurchasedCourseIds(normalized);
        localStorage.setItem(STORAGE_PURCHASED_KEY, JSON.stringify(normalized));
    };

    const persistCartItems = (items) => {
        const normalized = Array.isArray(items) ? items : [];
        setCartItems(normalized);
        localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(normalized));
    };

    const persistMembershipInfo = (membership) => {
        const normalized = normalizeMembershipInfo(membership);
        setMembershipInfo(normalized);
        if (normalized) {
            localStorage.setItem(STORAGE_MEMBERSHIP_KEY, JSON.stringify(normalized));
        } else {
            localStorage.removeItem(STORAGE_MEMBERSHIP_KEY);
        }
    };

    const persistMembershipHistory = (history) => {
        const normalized = Array.isArray(history) ? history : [];
        setMembershipHistory(normalized);
        localStorage.setItem(STORAGE_MEMBERSHIP_HISTORY_KEY, JSON.stringify(normalized));
    };

    const useMembershipCourse = (courseId) => {
        setMembershipInfo((prev) => {
            if (!prev) return prev;
            const now = new Date();
            const expiresAt = new Date(prev.expiresAt);
            const today = now.toISOString().split("T")[0];
            const lastUsedDay = prev.lastUsedDate ? prev.lastUsedDate.split("T")[0] : null;
            const currentUsedToday = lastUsedDay === today ? Number(prev.usedToday || 0) : 0;
            const remainingDaily = Math.max(0, (prev.dailyLimit || 0) - currentUsedToday);
            const remainingTotal = Math.max(0, (prev.totalCourses || 0) - (prev.usedCourses || 0));
            if (expiresAt <= now || remainingTotal <= 0 || remainingDaily <= 0) {
                return {
                    ...prev,
                    status: "expired",
                };
            }
            const next = {
                ...prev,
                usedCourses: (prev.usedCourses || 0) + 1,
                usedToday: currentUsedToday + 1,
                lastUsedDate: now.toISOString(),
                usedCourseIds: Array.from(new Set([...(prev.usedCourseIds || []), String(courseId)])),
            };
            localStorage.setItem(STORAGE_MEMBERSHIP_KEY, JSON.stringify(normalizeMembershipInfo(next)));

            // Persist usage to backend in background (best-effort)
            try {
                if (user && user.userId) {
                    api.post('/user-membership/use', { userId: user.userId, courseId: Number(courseId) }).catch(err => {
                        console.warn('Failed to persist membership usage:', err?.message || err);
                    });
                }
            } catch (e) {
                console.warn('Failed to call membership use API', e);
            }

            return normalizeMembershipInfo(next);
        });
    };

    const addFavoriteCourse = (courseId) => {
        const newId = String(courseId);
        setFavoriteCourseIds((prev) => {
            if (prev.includes(newId)) return prev;
            const next = [...prev, newId];
            localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
            return next;
        });
    };

    const removeFavoriteCourse = (courseId) => {
        const idToRemove = String(courseId);
        setFavoriteCourseIds((prev) => {
            const next = prev.filter(id => id !== idToRemove);
            localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
            return next;
        });
    };

    const toggleFavoriteCourse = (courseId) => {
        const courseIdStr = String(courseId);
        setFavoriteCourseIds((prev) => {
            const exists = prev.includes(courseIdStr);
            const next = exists ? prev.filter(id => id !== courseIdStr) : [...prev, courseIdStr];
            localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
            return next;
        });
    };

    const loginUser = (data) => {
        setUser(data);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data));
        if (Array.isArray(data?.purchasedCourseIds)) {
            persistPurchasedCourseIds(data.purchasedCourseIds);
        }
    };

    const logoutUser = () => {
        setUser(null);
        setPurchasedCourseIds([]);
        setCartItems([]);
        setFavoriteCourseIds([]);
        setMembershipHistory([]);
        persistMembershipInfo(null);
        localStorage.removeItem(STORAGE_USER_KEY);
        localStorage.removeItem(STORAGE_PURCHASED_KEY);
        localStorage.removeItem(STORAGE_CART_KEY);
        localStorage.removeItem(STORAGE_FAVORITES_KEY);
        localStorage.removeItem(STORAGE_MEMBERSHIP_HISTORY_KEY);
    };

    const addPurchasedCourse = (courseId) => {
        const newId = String(courseId);
        setPurchasedCourseIds((prev) => {
            if (prev.includes(newId)) return prev;
            const next = [...prev, newId];
            localStorage.setItem(STORAGE_PURCHASED_KEY, JSON.stringify(next));
            return next;
        });
    };

    const addToCart = (course) => {
        if (!course || !course.id) return;
        const newId = String(course.id);
        setCartItems((prev) => {
            if (prev.some(item => String(item.id) === newId)) return prev;
            const next = [...prev, { ...course, id: newId }];
            localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(next));
            return next;
        });
    };

    const removeFromCart = (courseId) => {
        const idToRemove = String(courseId);
        setCartItems((prev) => {
            const next = prev.filter(item => String(item.id) !== idToRemove);
            localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(next));
            return next;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(STORAGE_CART_KEY);
    };

    const addMembership = (membershipData) => {
        if (!membershipInfo) {
            persistMembershipInfo(membershipData);
            persistMembershipHistory([membershipData]);
            return;
        }

        // So sánh gói cũ và gói mới để lấy gói tốt nhất
        const currentTotalCourses = membershipInfo.totalCourses || 0;
        const currentExpiresAt = new Date(membershipInfo.expiresAt);
        const newTotalCourses = membershipData.totalCourses || 0;
        const newExpiresAt = new Date(membershipData.expiresAt);
        const currentTimeLeft = Math.max(0, currentExpiresAt - new Date());
        const newTimeLeft = Math.max(0, newExpiresAt - new Date());

        let finalMembership = membershipData;

        if (currentTotalCourses > newTotalCourses) {
            // Gói cũ tốt hơn (nhiều khóa hơn)
            finalMembership = membershipInfo;
        } else if (currentTotalCourses === newTotalCourses && currentTimeLeft > newTimeLeft) {
            // Gói cũ có thời hạn lâu hơn
            finalMembership = membershipInfo;
        }
        // Nếu gói mới tốt hơn hoặc bằng nhau (nhưng có thời hạn lâu hơn), sử dụng gói mới

        persistMembershipInfo(finalMembership);
        persistMembershipHistory([...(membershipHistory || []), membershipData]);
    };

    const loadUserData = async (userId) => {
        if (!userId) {
            console.warn('userId is not provided, skipping loadUserData');
            return;
        }

        // Helper: parse date từ ISO string hoặc Java array [year,month,day,hour,min,sec,nano]
        const parseDate = (val) => {
            if (!val) return null;
            if (typeof val === 'string') return val;
            if (Array.isArray(val)) {
                // [year, month, day, hour, min, sec, nano] — month là 1-based
                const [y, mo, d, h = 0, mi = 0, s = 0] = val;
                return new Date(y, mo - 1, d, h, mi, s).toISOString();
            }
            return String(val);
        };

        try {
            // Load purchased courses from orders
            const ordersRes = await api.get(`/orders/user/${userId}`);
            const orders = ordersRes.data || [];
            const purchasedIds = [];
            orders.forEach(order => {
                if (order.orderItems) {
                    order.orderItems.forEach(item => {
                        if (item.courseId) {
                            purchasedIds.push(String(item.courseId));
                        }
                    });
                }
            });
            persistPurchasedCourseIds(purchasedIds);

            // Load membership
            const membershipRes = await api.get(`/user-membership/user/${userId}`);
            const memberships = membershipRes.data || [];
            if (memberships && memberships.length > 0) {
                // Lấy gói ACTIVE còn hạn mới nhất
                const now = new Date();
                const activeMembership = memberships
                    .filter(m => {
                        if (m.status !== 'ACTIVE') return false;
                        const end = new Date(parseDate(m.endDate));
                        return end > now;
                    })
                    .sort((a, b) => new Date(parseDate(b.endDate)) - new Date(parseDate(a.endDate)))[0];

                if (activeMembership) {
                        const plan = activeMembership.membership;
                        const totalCourses = (plan.durationDays || 0) * (plan.coursesPerDay || 0);

                        // Try to parse usedCourseIds (may be JSON array or comma-separated string)
                        let parsedUsedCourseIds = [];
                        try {
                            if (activeMembership.usedCourseIds) {
                                if (Array.isArray(activeMembership.usedCourseIds)) parsedUsedCourseIds = activeMembership.usedCourseIds.map(String);
                                else if (typeof activeMembership.usedCourseIds === 'string') {
                                    const s = activeMembership.usedCourseIds.trim();
                                    if (s.startsWith('[')) {
                                        parsedUsedCourseIds = JSON.parse(s).map(String);
                                    } else if (s.length > 0) {
                                        parsedUsedCourseIds = s.split(',').map(p => p.trim()).filter(Boolean).map(String);
                                    }
                                }
                            }

                        } catch (e) {
                            console.warn('Failed to parse usedCourseIds', e);
                        }

                        // Compute usedToday and usedCourses from enrollments as the source-of-truth
                        let computedUsedToday = Number(activeMembership.usedToday || 0);
                        let computedUsedCourses = Number(activeMembership.usedCourses || 0);
                        try {
                            const enrollRes = await api.get(`/enrollments/user/${userId}`);
                            const enrolls = Array.isArray(enrollRes.data) ? enrollRes.data : (enrollRes.data || []);
                            const now = new Date();
                            const todayStr = now.toISOString().split('T')[0];
                            // count enrollments that fall within membership period
                            const start = parseDate(activeMembership.startDate);
                            const end = parseDate(activeMembership.endDate);
                            const startDateObj = start ? new Date(start) : null;
                            const endDateObj = end ? new Date(end) : null;

                            const enrollsInMembership = enrolls.filter(en => {
                                const enrolledAt = en.enrolledAt || en.enrolled_at || en.createdAt || en.created_at || null;
                                if (!enrolledAt) return false;
                                const d = new Date(enrolledAt);
                                if (startDateObj && d < startDateObj) return false;
                                if (endDateObj && d > endDateObj) return false;
                                return true;
                            });

                            computedUsedCourses = enrollsInMembership.length;
                            computedUsedToday = enrollsInMembership.filter(en => {
                                const enrolledAt = en.enrolledAt || en.enrolled_at || en.createdAt || en.created_at || null;
                                if (!enrolledAt) return false;
                                return new Date(enrolledAt).toISOString().split('T')[0] === todayStr;
                            }).length;
                        } catch (e) {
                            console.warn('Failed to fetch enrollments to compute membership usage', e);
                        }

                        const membershipData = {
                            id: plan.id,
                            name: plan.name,
                            title: plan.name,           // giữ cả 2 để tương thích
                            totalCourses: totalCourses,
                            dailyLimit: plan.coursesPerDay || 0,
                            durationDays: plan.durationDays || 0,
                            price: plan.price,
                            startDate: parseDate(activeMembership.startDate),
                            expiresAt: parseDate(activeMembership.endDate),
                            status: "active",
                            usedCourses: computedUsedCourses,
                            usedToday: computedUsedToday,
                            lastUsedDate: parseDate(activeMembership.lastUsedDate) || null,
                            usedCourseIds: parsedUsedCourseIds,
                        };
                        persistMembershipInfo(membershipData);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            purchasedCourseIds,
            cartItems,
            favoriteCourseIds,
            membershipInfo,
            membershipHistory,
            loginUser,
            logoutUser,
            addPurchasedCourse,
            addToCart,
            removeFromCart,
            clearCart,
            addFavoriteCourse,
            removeFavoriteCourse,
            toggleFavoriteCourse,
            addMembership,
            loadUserData,
            useMembershipCourse
        }}>
            {children}
        </AuthContext.Provider>
    );
};