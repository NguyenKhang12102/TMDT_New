import { useState } from "react";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/user/forgot-password?email=${encodeURIComponent(email)}`, {
                method: "POST",
            });
            const text = await res.text();
            setMessage(text);
        } catch {
            setMessage("Lỗi khi gửi yêu cầu.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Quên mật khẩu</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className="border px-3 py-2 w-full mb-3"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                    Gửi yêu cầu
                </button>
                <p className="text-sm mt-3 text-gray-700">{message}</p>
            </form>
        </div>
    );
}

export default ForgotPassword;
