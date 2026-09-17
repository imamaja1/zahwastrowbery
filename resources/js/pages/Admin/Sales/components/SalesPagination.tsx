import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { PaginationLink } from '../types';

interface Props {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function SalesPagination({ links, from, to, total }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-200">
            <span className="text-[11px] text-zinc-500">
                Menampilkan {from || 0} - {to || 0} dari {total} transaksi
            </span>
            <div className="flex items-center gap-1">
                {links.map((link, idx) => {
                    const cleanLabel = link.label
                        .replace('&laquo; Previous', '←')
                        .replace('Next &raquo;', '→');

                    if (!link.url) {
                        return (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-[11px] text-zinc-300 rounded-lg"
                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                            />
                        );
                    }

                    return (
                        <Button
                            key={idx}
                            asChild
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            className={`h-7 px-2.5 text-[11px] rounded-lg ${
                                link.active
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white font-bold'
                                    : 'text-zinc-600 hover:bg-zinc-100'
                            }`}
                        >
                            <Link
                                href={link.url}
                                preserveScroll
                                preserveState
                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                            />
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
