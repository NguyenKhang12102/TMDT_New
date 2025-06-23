import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/api/user/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });
            const text = await res.text();
            setMessage(text);
            if (res.ok) {
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch {
            setMessage("Có lỗi xảy ra.");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h2>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới"
                    className="border px-3 py-2 w-full mb-3"
                    required
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
                    Đặt lại mật khẩu
                </button>
                <p className="text-sm mt-3 text-gray-700">{message}</p>
            </form>
        </div>
    );
}

export default ResetPassword;
