"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }

        try {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            router.push("/");
        } catch (error) {
            setError("Giriş başarısız, lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white p-8  rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    Giriş Yap
                </h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type={isVisible ? "text" : "password"}
                            placeholder="Şifreniz"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute right-3 top-4"
                        >
                            {isVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Hesabın yok mu?{" "}
                    <a href="/register" className="text-blue-500 font-semibold hover:underline">
                        Kayıt Ol
                    </a>
                </p>
            </div>
        </div>
    );
}
