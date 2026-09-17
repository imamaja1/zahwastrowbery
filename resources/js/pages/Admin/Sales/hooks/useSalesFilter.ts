import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Sale, SalesProps } from '../types';

export function useSalesFilter({ currentStatus, searchQuery }: SalesProps) {
    const [search, setSearch] = useState(searchQuery || '');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvingSale, setApprovingSale] = useState<Sale | null>(null);
    const [isApproving, setIsApproving] = useState(false);

    // Sinkronkan input pencarian jika props searchQuery berubah dari luar
    useEffect(() => {
        setSearch(searchQuery || '');
    }, [searchQuery]);

    // Live search otomatis dengan debounce 350ms
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (searchQuery || '')) {
                setIsSearching(true);
                router.get(
                    '/admin/sales',
                    {
                        status: currentStatus,
                        search: search.trim() || undefined,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                        onFinish: () => setIsSearching(false),
                    }
                );
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            '/admin/sales',
            {
                status: currentStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleStatusFilter = (status: string) => {
        router.get(
            '/admin/sales',
            {
                status,
                search: search.trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleConfirmApprove = () => {
        if (!approvingSale) return;
        setIsApproving(true);
        router.post(
            `/admin/sales/${approvingSale.id}/verify`,
            { action: 'approve' },
            {
                onFinish: () => {
                    setIsApproving(false);
                    setApprovingSale(null);
                },
            }
        );
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingId) return;

        router.post(
            `/admin/sales/${rejectingId}/verify`,
            { action: 'reject', rejection_reason: rejectionReason },
            {
                onSuccess: () => {
                    setRejectingId(null);
                    setRejectionReason('');
                },
            }
        );
    };

    return {
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
    };
}
