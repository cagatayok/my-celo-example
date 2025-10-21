"use client";

import React, { useState } from 'react';
<img src="/ceoooo.png" alt="Celo Logo" className="rounded-xl" />

// Firebase importları tamamen kaldırıldı.

// --- Inline SVG İkon Bileşenleri (lucide-react yerine) ---
const SmartphoneIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg>);
const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>);
const ArrowLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3L4 7l4 4"/><path d="M4 7h16"/><path d="M16 21l4-4-4-4"/><path d="M20 17H4"/></svg>);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>);
const Loader2Icon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>);
// Yeni Cüzdan İkonu (Smartphone yerine)
const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16"/><path d="M19 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/><path d="M16 16h-4"/></svg>);
// -------------------------------------------------------------------

// Arayüzler
interface Transaction {
    id: string;
    senderId: string;
    recipientPhone: string; // Artık cüzdan adresi tutacak, ancak isim değişmedi
    amount: number;
    status: 'Başarılı' | 'Beklemede' | 'Başarısız';
    timestamp: number;
}

// Simüle edilmiş Cüzdan Adresi (Kullanıcının verdiği adresi kullanıyoruz)
const SIMULATED_USER_ID = '0xeB35188cefb069ec904903C274282E66118AFcb7'; 

const App = () => {
    // Stateler
    const [userId] = useState(SIMULATED_USER_ID); // Sabit olarak tanımlandı
    const [recipientAddress, setRecipientAddress] = useState(''); // Yeni: Alıcı adresi
    const [amount, setAmount] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Simüle Edilen Bakiye ve Geçmiş (Tamamen client-side yönetiliyor)
    const [userBalance, setUserBalance] = useState(1000.00); // Başlangıç simülasyon bakiyesi
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // ------------------------------------
    // YARDIMCI FONKSİYONLAR
    // ------------------------------------
    
    // Basit bir adres formatı doğrulama fonksiyonu (0x ile başlayıp 42 karakter olması beklenir)
    const isValidAddress = (addr: string) => {
        return /^0x[a-fA-F0-9]{40}$/.test(addr);
    };

    const handleAction = async () => {
        const transferAmount = parseFloat(amount);

        // Validasyonlar
        if (isNaN(transferAmount) || transferAmount <= 0) {
            setStatusMessage("Geçerli bir tutar girin.");
            return;
        }
        if (!isValidAddress(recipientAddress)) { // Adres validasyonu
            setStatusMessage("Lütfen geçerli bir Cüzdan Adresi (0x ile başlayan 42 karakter) girin.");
            return;
        }
        if (transferAmount > userBalance) {
            setStatusMessage("Yetersiz bakiye. Simülasyon bakiyeniz bu transfer için yetersiz.");
            return;
        }

        setIsProcessing(true);
        setStatusMessage("Transfer işlemi başlatılıyor...");

        // Simülasyon Gecikmesi
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Simülasyon: Transfer başarılı
            const newTransaction: Omit<Transaction, 'id'> = {
                id: Date.now().toString(), // Basit ID
                senderId: userId,
                recipientPhone: recipientAddress, // Artık bu alan adresi tutuyor
                amount: transferAmount,
                status: 'Başarılı',
                timestamp: Date.now(),
            };

            // 1. Simülasyon Bakiyesini Düşür (DIRECT DEDUCT)
            setUserBalance(prev => parseFloat((prev - transferAmount).toFixed(2))); 
            
            // 2. İşlem Geçmişine Ekle
            setTransactions(prev => [newTransaction as Transaction, ...prev]);

            setStatusMessage(`Transfer başarılı! ${transferAmount} cUSD adresine gönderildi.`);
            setAmount(''); // Formu temizle
            setRecipientAddress(''); // Adresi temizle
        } catch (error) {
            console.error("Transfer hatası:", error);
            setStatusMessage("Transfer kaydı başarısız oldu. Konsolu kontrol edin.");
        } finally {
            setIsProcessing(false);
        }
    };

    // ------------------------------------
    // 2. RENDERING
    // ------------------------------------

    return (
        <div className="flex flex-col items-center flex-grow pt-10 pb-20 bg-gray-100 min-h-screen font-sans">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-[30px] p-6 md:p-10 transition-all duration-300">
                <div className="text-center mb-10">
                    <GlobeIcon className="mx-auto h-12 w-12 text-indigo-600 mb-3" strokeWidth={1.5} />
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Celo Remittance dApp</h1>
                    <p className="text-sm text-gray-500 mt-1">Düşük Maliyetli Global Para Transferi</p>
                    <img src="ceoooo.png" alt="" />
                    {/* Cüzdan Bilgisi */}
                    <div className="mt-5 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <p className="text-sm text-gray-700 font-semibold">Cüzdan Bakiyeniz (cUSD - Simülasyon):</p>
                        <p className="text-3xl font-extrabold text-indigo-600 mt-1">
                            {userBalance.toFixed(2)} cUSD
                        </p>
                        <p className="text-xs text-gray-500 mt-2 truncate">
                            Kaynak Kullanıcı Adresi: {userId || "Bağlantı Yok"}
                        </p>
                    </div>
                </div>

                {/* Form Alanı */}
                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleAction(); }}>
                    
                    {/* Alıcı Cüzdan Adresi Alanı */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                            Alıcı Cüzdan Adresi (Hedef Kimliği)
                        </label>
                        <div className="relative rounded-2xl shadow-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <WalletIcon className="h-6 w-6 text-indigo-400" /> {/* Yeni İkon */}
                            </div>
                            <input
                                type="text"
                                id="address"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 transition-all duration-200 font-mono"
                                placeholder="0x..."
                                maxLength={42}
                                required
                                disabled={isProcessing}
                            />
                        </div>
                    </div>

                    {/* Tutar Alanı (cUSD cinsinden) */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                            Gönderilecek Tutar (cUSD)
                        </label>
                        <div className="relative rounded-2xl shadow-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSignIcon className="h-6 w-6 text-indigo-400" />
                            </div>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2 transition-all duration-200"
                                placeholder="0.00 cUSD"
                                min="0.01"
                                step="0.01"
                                required
                                disabled={isProcessing}
                            />
                        </div>
                    </div>
                    
                    {/* Durum Mesajı */}
                    {statusMessage && (
                        <div className={`p-3 text-center text-sm rounded-xl font-medium ${statusMessage.includes('başarılı') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage}
                        </div>
                    )}

                    {/* Aksiyon Butonu */}
                    <button
                        type="submit"
                        disabled={isProcessing || !amount || !recipientAddress || parseFloat(amount) <= 0 || !isValidAddress(recipientAddress)}
                        className={`w-full flex justify-center items-center py-4 px-4 rounded-2xl shadow-xl text-xl font-extrabold text-white transition-all duration-300 
                            ${(isProcessing || !amount || !recipientAddress || parseFloat(amount) <= 0 || !isValidAddress(recipientAddress))
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-lg'}`
                        }
                    >
                        {isProcessing && <Loader2Icon className="mr-3 h-6 w-6 animate-spin" />}
                        {!isProcessing && <ArrowLeftRightIcon className="mr-3 h-6 w-6" />}
                        {isProcessing ? "İşleniyor..." : "Transferi Başlat"}
                    </button>
                </form>
            </div>
            
            {/* İşlem Geçmişi */}
            <div className="w-full max-w-md mt-10 p-6 bg-white shadow-2xl rounded-[30px]">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">İşlem Geçmişi ({transactions.length})</h2>
                {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Henüz bir işlem yok.</p>
                ) : (
                    <ul className="space-y-4">
                        {transactions.map((tx) => (
                            <li key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center">
                                    {tx.status === 'Başarılı' ? (
                                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                                    ) : (
                                        <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Alıcı Adresi: {tx.recipientPhone.substring(0, 6)}...{tx.recipientPhone.substring(tx.recipientPhone.length - 4)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(tx.timestamp).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                                <span className={`font-extrabold text-lg ${tx.status === 'Başarılı' ? 'text-green-600' : 'text-red-600'}`}>
                                    -{tx.amount.toFixed(2)} cUSD
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Bu uygulama tamamen istemci tarafında simüle edilmiştir.</p>
            </div>
        </div>
    );
};

export default App;
