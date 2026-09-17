import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { SalesProps } from './types';
import { useSalesFilter } from './hooks/useSalesFilter';
import SalesSearchBar from './components/SalesSearchBar';
import SaleCardList from './components/SaleCardList';
import SaleProofDialog from './components/SaleProofDialog';
import SaleApproveDialog from './components/SaleApproveDialog';
import SaleRejectDialog from './components/SaleRejectDialog';
import SalesPagination from './components/SalesPagination';

export default function SalesIndex(props: SalesProps) {
    const {
        search,
        setSearch,
        isSearching,
        selectedProof,
        setSelectedProof,
        rejectingId,
        setRejectingId,
        rejectionReason,
        setRejectionReason,
        approvingSale,
        setApprovingSale,
        isApproving,
        handleClearSearch,
        handleStatusFilter,
        handleConfirmApprove,
        handleReject,
    } = useSalesFilter(props);

    const { sales, currentStatus } = props;

    return (
        <AdminLayout title="Manajemen Transaksi">
            <Head title="Manajemen Transaksi - Admin ZahwaStrowbery" />

            <div className="flex flex-col gap-3.5">
                {/* Header Title (Compact) */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h1 className="font-extrabold text-sm sm:text-base text-zinc-900 leading-tight">
                            Semua Transaksi Penjualan
                        </h1>
                        <span className="text-[11px] text-zinc-500">
                            {search.trim() ? (
                                <>
                                    Ditemukan <strong className="text-zinc-800">{sales.total}</strong>{' '}
                                    transaksi untuk &quot;{search}&quot;
                                </>
                            ) : (
                                <>
                                    Total <strong className="text-zinc-800">{sales.total}</strong>{' '}
                                    transaksi terdaftar
                                </>
                            )}
                        </span>
                    </div>

                    <Link
                        href="/admin/dashboard"
                        className="text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl border border-rose-100 transition-colors"
                    >
                        ← Dashboard
                    </Link>
                </div>

                {/* Live Search & Horizontal Status Tabs */}
                <SalesSearchBar
                    search={search}
                    isSearching={isSearching}
                    currentStatus={currentStatus}
                    onSearchChange={setSearch}
                    onClearSearch={handleClearSearch}
                    onStatusFilter={handleStatusFilter}
                />

                {/* Sales List Card Feed */}
                <SaleCardList
                    sales={sales.data}
                    search={search}
                    onExamineProof={setSelectedProof}
                    onStartApprove={setApprovingSale}
                    onStartReject={setRejectingId}
                />

                {/* Pagination */}
                <SalesPagination
                    links={sales.links}
                    from={sales.from}
                    to={sales.to}
                    total={sales.total}
                />
            </div>

            {/* Proof Zoom Dialog */}
            <SaleProofDialog
                selectedProof={selectedProof}
                onClose={() => setSelectedProof(null)}
            />

            {/* Approve Confirmation Dialog */}
            <SaleApproveDialog
                approvingSale={approvingSale}
                isApproving={isApproving}
                onClose={() => setApprovingSale(null)}
                onConfirmApprove={handleConfirmApprove}
            />

            {/* Reject Reason Dialog */}
            <SaleRejectDialog
                rejectingId={rejectingId}
                rejectionReason={rejectionReason}
                onClose={() => setRejectingId(null)}
                onReasonChange={setRejectionReason}
                onSubmit={handleReject}
            />
        </AdminLayout>
    );
}
