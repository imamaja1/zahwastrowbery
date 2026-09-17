import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useCart } from '../lib/cart';
import AuthModal from '@/components/AuthModal';
import { ToastProvider, useToast } from '@/components/ui/toast';

interface Props {
    children: ReactNode;
    title?: string;
    showBottomNav?: boolean;
}

function CustomerLayoutContent({ children, title, showBottomNav = true }: Props) {
    const page = usePage();
    const { auth, flash } = page.props as any;
    const { success, error } = useToast();
    const currentPath = (page.url || '').split('?')[0];
    const { totalCount } = useCart();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('login') === '1' && !auth?.user) {
                setIsAuthModalOpen(true);
            }
        }
    }, [auth]);

    const isCatalog = currentPath === '/';
    const isCart = currentPath === '/checkout';
    const isOrders = currentPath.startsWith('/my-orders') || currentPath.startsWith('/orders');
    const isProfile = currentPath.startsWith('/profile');
    const isAdmin = currentPath.startsWith('/admin');

    return (
        <div className="min-h-screen bg-zinc-200/70 flex justify-center selection:bg-[#b80035] selection:text-white">
            {/* Auth Popup Dialog */}
            {isAuthModalOpen && (
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
            )}

            {/* Smartphone Container */}
            <div className="w-full max-w-md min-h-screen bg-[#fbf8fc] text-[#1b1b1e] font-sans flex flex-col relative shadow-2xl md:border-x md:border-zinc-300/60 pb-20">
                {/* Smartphone App Top Bar */}
                <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-[#eae7eb] shadow-2xs px-4 h-14 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#b80035] to-[#e11d48] flex items-center justify-center text-white shadow-xs transition-transform group-active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">nutrition</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-base text-[#1b1b1e] tracking-tight leading-none group-hover:text-[#b80035] transition-colors">
                                ZahwaStrowbery
                            </span>
                            <span className="text-[10px] font-bold text-[#006c49] tracking-wider uppercase">
                                Kebun Buah Segar
                            </span>
                        </div>
                    </Link>

                    {/* Quick Right Top Action: Foto Profil saja jika login */}
                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Link
                                href="/profile"
                                className={`relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border transition-all cursor-pointer active:scale-95 shadow-2xs ${
                                    isProfile
                                        ? 'ring-2 ring-[#b80035] border-white'
                                        : 'border-zinc-200 hover:ring-2 hover:ring-rose-300'
                                }`}
                                title={`Profil ${auth.user.name}`}
                            >
                                {auth.user.avatar_url || auth.user.avatar ? (
                                    <img
                                        src={auth.user.avatar_url || (auth.user.avatar.startsWith('http') ? auth.user.avatar : `/storage/${auth.user.avatar.replace(/^\/storage\//, '')}`)}
                                        alt={auth.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-[#b80035] to-[#e11d48] text-white flex items-center justify-center text-xs font-black">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-[11px] font-bold text-[#b80035] bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-full border border-rose-200 transition-colors cursor-pointer active:scale-95"
                            >
                                Masuk
                            </button>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 w-full">{children}</main>

                {/* Smartphone Fixed Bottom Navigation Bar */}
                {showBottomNav && (
                    <nav className="fixed bottom-0 inset-x-0 mx-auto max-w-md z-50 bg-white/95 backdrop-blur-md border-t border-[#eae7eb] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 flex items-center justify-around">
                        {/* 1. Katalog / Home */}
                        <Link
                            href="/"
                            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all active:scale-90 ${
                                isCatalog
                                    ? 'text-[#b80035] font-bold'
                                    : 'text-zinc-500 hover:text-zinc-800 font-medium'
                            }`}
                        >
                            <div
                                className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                                    isCatalog ? 'bg-rose-100/70 text-[#b80035]' : 'text-zinc-500'
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[22px]"
                                    style={{ fontVariationSettings: isCatalog ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                    storefront
                                </span>
                            </div>
                            <span className="text-[10px] leading-tight">Katalog</span>
                        </Link>

                        {/* 2. Keranjang */}
                        <Link
                            href="/checkout"
                            className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all active:scale-90 ${
                                isCart
                                    ? 'text-[#b80035] font-bold'
                                    : 'text-zinc-500 hover:text-zinc-800 font-medium'
                            }`}
                        >
                            <div
                                className={`relative w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                                    isCart ? 'bg-rose-100/70 text-[#b80035]' : 'text-zinc-500'
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[22px]"
                                    style={{ fontVariationSettings: isCart ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                    shopping_bag
                                </span>
                                {totalCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#b80035] text-white text-[10px] font-extrabold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                                        {totalCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] leading-tight">Keranjang</span>
                        </Link>

                        {/* 3. Pesanan */}
                        <Link
                            href="/my-orders"
                            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all active:scale-90 ${
                                isOrders
                                    ? 'text-[#b80035] font-bold'
                                    : 'text-zinc-500 hover:text-zinc-800 font-medium'
                            }`}
                        >
                            <div
                                className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                                    isOrders ? 'bg-rose-100/70 text-[#b80035]' : 'text-zinc-500'
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[22px]"
                                    style={{ fontVariationSettings: isOrders ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                    receipt_long
                                </span>
                            </div>
                            <span className="text-[10px] leading-tight">Pesanan</span>
                        </Link>

                        {/* 4. Profil / Masuk */}
                        {auth?.user ? (
                            <Link
                                href="/profile"
                                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all active:scale-90 ${
                                    isProfile
                                        ? 'text-[#b80035] font-bold'
                                        : 'text-zinc-500 hover:text-zinc-800 font-medium'
                                }`}
                            >
                                <div
                                    className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                                        isProfile ? 'bg-rose-100/70 text-[#b80035]' : 'text-zinc-500'
                                    }`}
                                >
                                    <span
                                        className="material-symbols-outlined text-[22px]"
                                        style={{ fontVariationSettings: isProfile ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        person
                                    </span>
                                </div>
                                <span className="text-[10px] leading-tight">Profil</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsAuthModalOpen(true)}
                                className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all active:scale-90 text-zinc-500 hover:text-zinc-800 font-medium cursor-pointer"
                            >
                                <div className="w-9 h-7 rounded-full flex items-center justify-center transition-colors text-zinc-500">
                                    <span className="material-symbols-outlined text-[22px]">person</span>
                                </div>
                                <span className="text-[10px] leading-tight">Masuk</span>
                            </button>
                        )}
                    </nav>
                )}
            </div>
        </div>
    );
}

export default function CustomerLayout({ children, title, showBottomNav = true }: Props) {
    return (
        <ToastProvider>
            <CustomerLayoutContent title={title} showBottomNav={showBottomNav}>
                {children}
            </CustomerLayoutContent>
        </ToastProvider>
    );
}

