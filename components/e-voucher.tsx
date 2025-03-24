"use client";

import { motion } from "framer-motion";
import { memo } from "react";


interface EVoucherProps {
    text?: string;
    backgroundImage?: string;
    isFull?: boolean;
}

const EVoucher = ({ text = "E-Voucher", backgroundImage = "/e-voucher.jpg", isFull = false }: EVoucherProps) => {
    return (
        <div className={`relative ${isFull ? '' : 'md:w-[510px]'} md:w-[510px] md:h-[250px] w-[100%] h-[170px] bg-cover bg-center rounded-2xl border-4 border-pink-200 `} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute inset-0 "></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center z-10"
            >
                <span className="text-white md:text-xl text-md font-bold text-center bg-black bg-opacity-50 px-3 py-1 rounded shadow-lg w-full" dangerouslySetInnerHTML={{__html:text}}>
                </span>
            </motion.div>
        </div>
    );
};

export default memo(EVoucher);