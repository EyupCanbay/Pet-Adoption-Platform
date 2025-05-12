"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt, FaLock, FaEnvelope, FaPhoneAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { RegisterUser } from "@/src/services/Auth";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const formData = {
            name,
            surname,
            userName,
            email,
            password,
            phoneNumber,
        };

        setLoading(true);
        try {
            if (password !== confirmPassword) {
                setError("Şifreler eşleşmiyor.");
                setLoading(false);
                return;
            }
            const response = await RegisterUser(formData);
            if (response.status === "Success") {
                setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
                router.push("/login");
            } else {
                setError(response.data?.message || "Kayıt işlemi başarısız oldu.");
            }
        } catch (error) {
            setError("Kayıt işlemi sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full py-4 items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
                    Kayıt Ol
                </h2>

                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative">
                        <FaUserAlt className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Adınız"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaUserAlt className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Soyadınız"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaUserAlt className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Kullanıcı Adınız"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaPhoneAlt className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Telefon Numaranız"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Şifreniz"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="absolute right-3 top-4"
                        >
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <FaLock className="absolute left-3 top-4 text-gray-400" />
                        <input
                            type={isConfirmPasswordVisible ? "text" : "password"}
                            placeholder="Şifrenizi Tekrar Girin"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            className="absolute right-3 top-4"
                        >
                            {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Kayıt Oluyor..." : "Kayıt Ol"}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Zaten bir hesabın var mı?{" "}
                    <a href="/login" className="text-blue-500 font-semibold hover:underline">
                        Giriş Yap
                    </a>
                </p>
            </div>
        </div>
    );
}
