import React, { ReactNode, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ToastProvider, useToast } from '@/components/ui/toast';

interface Props {
    children: ReactNode;
    title?: string;
}

function AdminLayoutContent({ children, title }: Props) {
    const page = usePage();
    const { auth, flash } = page.props as any;
    const { success, error } = useToast();
    const currentPath = (page.url || '').split('?')[0];

    const isDashboard = currentPath === '/admin/dashboard';
    const isSales = currentPath.startsWith('/admin/sales');
    const isProducts = currentPath.startsWith('/admin/products');
    const isStocks = currentPath.startsWith('/admin/stocks');
    const isSettings = currentPath.startsWith('/admin/settings');
    const isProfile = currentPath.startsWith('/admin/profile');

    const lastSuccessRef = useRef<string | null>(null);
    const lastErrorRef = useRef<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            if (flash.success !== lastSuccessRef.current) {
                lastSuccessRef.current = flash.success;
                success(flash.success);
            }
        } else {
            lastSuccessRef.current = null;
        }

        if (flash?.error) {
            if (flash.error !== lastErrorRef.current) {
                lastErrorRef.current = flash.error;
                error(flash.error);
            }
        } else {
            lastErrorRef.current = null;
        }
    }, [flash?.success, flash?.error]);

    const navTabs = [
        {
            name: 'Home',
            href: '/admin/dashboard',
            icon: 'dashboard',
            isActive: isDashboard,
        },
        {
            name: 'Pesanan',
            href: '/admin/sales',
            icon: 'payments',
            isActive: isSales,
        },
        {
            name: 'Produk',
            href: '/admin/products',
            icon: 'nutrition',
            isActive: isProducts,
        },
        {
            name: 'Stok',
            href: '/admin/stocks',
            icon: 'inventory_2',
            isActive: isStocks,
        },
        {
            name: 'Pengaturan',
            href: '/admin/settings',
            icon: 'settings',
            isActive: isSettings,
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-200/70 flex justify-center selection:bg-[#b80035] selection:text-white">
            {/* Smartphone Admin Container */}
            <div className="w-full max-w-md min-h-screen bg-[#f8f9fa] text-[#1b1b1e] font-sans flex flex-col relative shadow-2xl md:border-x md:border-zinc-300/60 pb-20">
                {/* Admin Smartphone App Header */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#eae7eb] shadow-2xs px-3.5 h-13 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#b80035] flex items-center justify-center text-white shadow-xs">
                                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-xs sm:text-sm text-[#1b1b1e] leading-none tracking-tight">
                                    Admin Toko
                                </span>
                                <span className="text-[9px] font-bold text-[#006c49]">
                                    ZahwaStrowbery
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Storefront Quick Link */}
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded-full border border-zinc-200 transition-colors"
                            target="_blank"
                            title="Buka Toko Customer"
                        >
                            <span className="material-symbols-outlined text-[13px]">storefront</span>
                            <span>Toko</span>
                        </Link>

                        {/* Admin Profile Link */}
                        <Link
                            href="/admin/profile"
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer overflow-hidden ${
                                isProfile
                                    ? 'bg-rose-100 text-[#b80035] ring-2 ring-[#b80035]'
                                    : 'text-zinc-600 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-200'
                            }`}
                            title="Profil Admin"
                        >
                            {auth?.user?.avatar_url ? (
                                <img
                                    src={auth.user.avatar_url}
                                    alt={auth.user.name || 'Admin'}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                            )}
                        </Link>

                        {/* Logout Button */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Keluar Akun"
                        >
                            <span className="material-symbols-outlined text-[16px]">logout</span>
                        </Link>
                    </div>
                </header>

                {/* Admin Page Content */}
                <main className="flex-1 w-full p-3 sm:p-3.5">{children}</main>

                {/* Smartphone Fixed Bottom Bar for Admin */}
                <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md z-50 bg-white/95 backdrop-blur-md border-t border-[#eae7eb] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around">
                    {navTabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                                tab.isActive
                                    ? 'text-[#b80035] font-black'
                                    : 'text-zinc-400 hover:text-zinc-600 font-medium'
                            }`}
                        >
                            <span
                                className={`material-symbols-outlined text-[20px] transition-transform ${
                                    tab.isActive ? 'scale-110 font-bold' : ''
                                }`}
                            >
                                {tab.icon}
                            </span>
                            <span className="text-[10px] mt-0.5 tracking-tight">{tab.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

export default function AdminLayout({ children, title }: Props) {
    return (
        <ToastProvider>
            <AdminLayoutContent title={title}>
                {children}
            </AdminLayoutContent>
        </ToastProvider>
    );
}
