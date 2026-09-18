import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { DashboardProps } from './Dashboard/types';
import DashboardHeader from './Dashboard/components/DashboardHeader';
import KeyMetricsGrid from './Dashboard/components/KeyMetricsGrid';
import QuickShortcuts from './Dashboard/components/QuickShortcuts';
import PendingVerificationSection from './Dashboard/components/PendingVerificationSection';
import SalesAnalytics from './Dashboard/components/SalesAnalytics';
import RecentSalesFeed from './Dashboard/components/RecentSalesFeed';
import ProofModal from './Dashboard/components/ProofModal';
import RejectModal from './Dashboard/components/RejectModal';

export default function AdminDashboard({
    metrics,
    pending_verifications,
    recent_sales = [],
    top_products,
    sales_trend = [],
}: DashboardProps) {
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingId) return;

        router.post(
            `/admin/sales/${rejectingId}/verify`,
            {
                action: 'reject',
                rejection_reason: rejectionReason,
            },
            {
                onSuccess: () => {
                    setRejectingId(null);
                    setRejectionReason('');
                },
            }
        );
    };

    const handleApprove = (id: number) => {
        router.post(`/admin/sales/${id}/verify`, {
            action: 'approve',
        });
    };

    return (
        <AdminLayout title="Dashboard & Verifikasi">
            <Head title="Admin Dashboard - ZahwaStrowbery" />

            <div className="flex flex-col gap-3.5">
                {/* 1. Admin Header & Welcome Banner */}
                <DashboardHeader />

                {/* 2. Key Metrics - 2x2 Grid */}
                <KeyMetricsGrid metrics={metrics} />

                {/* 3. Pintasan Cepat */}
                <QuickShortcuts />

                {/* 4. Antrean Verifikasi Pembayaran Masuk */}
                <PendingVerificationSection
                    pendingVerifications={pending_verifications}
                    onExamineProof={setSelectedProof}
                    onStartReject={setRejectingId}
                    onApprove={handleApprove}
                />

                {/* 5. Grafik Penjualan & Produk Terlaris */}
                <SalesAnalytics topProducts={top_products} salesTrend={sales_trend} />

                {/* 6. Pesanan Terbaru Feed */}
                <RecentSalesFeed recentSales={recent_sales} />
            </div>

            {/* Proof Zoom Modal */}
            <ProofModal
                selectedProof={selectedProof}
                onClose={() => setSelectedProof(null)}
            />

            {/* Rejection Reason Modal */}
            <RejectModal
                rejectingId={rejectingId}
                rejectionReason={rejectionReason}
                onClose={() => setRejectingId(null)}
                onReasonChange={setRejectionReason}
                onSubmit={handleRejectSubmit}
            />
        </AdminLayout>
    );
}
