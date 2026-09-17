import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import AuthModal from '@/components/AuthModal';
import { CheckoutProps } from './types';
import { useCheckout } from './hooks/useCheckout';
import StepIndicator from './components/StepIndicator';
import CartItemsCard from './components/CartItemsCard';
import ShippingInfoCard from './components/ShippingInfoCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import OrderSummaryCard from './components/OrderSummaryCard';

export default function Checkout(props: CheckoutProps) {
    const {
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        copiedBank,
        handleCopyBank,
        isQrisActive,
        isTransferActive,
        isCodActive,
        cart,
        categoryCount,
        totalPrice,
        groupedCart,
        updateCartQuantity,
        removeFromCart,
        paymentMethod,
        previewUrl,
        data,
        setData,
        processing,
        errors,
        handleMethodChange,
        handleFileChange,
        handleSubmit,
        shippingCost,
        discountPromo,
        finalTotal,
    } = useCheckout(props);

    return (
        <CustomerLayout title="Checkout & Pembayaran">
            <Head title="Keranjang & Checkout - ZahwaStrowbery" />

            <div className="flex flex-col w-full max-w-2xl mx-auto px-4 py-4 md:py-6 pb-20">
                {/* 1. Step Indicator */}
                <StepIndicator />

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* 2. Ringkasan Keranjang Berdasarkan Kategori */}
                    <CartItemsCard
                        cart={cart}
                        groupedCart={groupedCart}
                        categoryCount={categoryCount}
                        errorItems={errors.items}
                        onUpdateQuantity={updateCartQuantity}
                        onRemoveFromCart={removeFromCart}
                    />

                    {/* 3. Informasi Pelanggan & Alamat */}
                    <ShippingInfoCard
                        currentUser={currentUser}
                        customerName={data.customer_name}
                        customerPhone={data.customer_phone}
                        customerAddress={data.customer_address}
                        notes={data.notes}
                        errors={errors}
                        onUpdateField={(field, val) => setData(field as any, val)}
                        onOpenAuthModal={() => setIsAuthModalOpen(true)}
                    />

                    {/* 4. Pilihan Metode Pembayaran */}
                    <PaymentMethodCard
                        paymentSettings={props.payment_settings}
                        isQrisActive={isQrisActive}
                        isTransferActive={isTransferActive}
                        isCodActive={isCodActive}
                        paymentMethod={paymentMethod}
                        finalTotal={finalTotal}
                        previewUrl={previewUrl}
                        paymentProofFile={data.payment_proof}
                        errorProof={errors.payment_proof}
                        copiedBank={copiedBank}
                        onMethodChange={handleMethodChange}
                        onFileChange={handleFileChange}
                        onCopyBank={handleCopyBank}
                    />

                    {/* 5. Rincian Pembayaran Total & Submit */}
                    <OrderSummaryCard
                        currentUser={currentUser}
                        totalPrice={totalPrice}
                        shippingCost={shippingCost}
                        discountPromo={discountPromo}
                        finalTotal={finalTotal}
                        isCartEmpty={cart.length === 0}
                        processing={processing}
                        authError={(errors as any)?.auth}
                    />
                </form>
            </div>

            {/* Modal Login jika belum login saat Konfirmasi & Pesan Sekarang */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </CustomerLayout>
    );
}
