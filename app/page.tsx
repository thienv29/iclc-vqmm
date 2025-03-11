"use client"
import LuckyWheel from "@/components/lucky-wheel"
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleDoubleClick = () => {
        router.push("/admin"); // Điều hướng đến trang mới
    };
    return (
        <main className="min-h-screen py-8 px-4 relative overflow-hidden flex flex-col justify-center items-center">
            {/* Animated background */}
            <div className="absolute inset-0 -z-10">
                <div
                    className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div
                    className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div
                    className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div
                    className="absolute -bottom-8 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
            </div>

            <div className="container mx-auto relative z-10">
                <h1 onDoubleClick={handleDoubleClick} className=" leading-[3.5rem] text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                    VÒNG QUAY MAY MẮN
                </h1>
                <h1 onDoubleClick={handleDoubleClick} className="leading-[3.5rem] text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                    CHUYỂN ĐỘNG CÙNG GIÁO DỤC SỐ
                </h1>
                <LuckyWheel/>
            </div>
        </main>
    )
}

