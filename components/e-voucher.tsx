"use client";

import { motion } from "framer-motion";
import { memo } from "react";


interface EVoucherProps {
    text?: string;
    backgroundImage?: string;
}

const EVoucher = ({ text = "E-Voucher", backgroundImage = "/e-voucher.jpg" }: EVoucherProps) => {
    return (
        <div className="relative w-[640px] h-[300px] bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            {/* Overlay */}
            <div className="absolute inset-0 "></div>

            {/* Text nằm chính giữa */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center z-10"
            >
                <span className="text-white text-2xl font-bold text-center bg-black bg-opacity-50 p-4 rounded-lg shadow-lg">
                    {text}
                </span>
            </motion.div>
        </div>
    );
};

export default memo(EVoucher);