"use client"

import {useEffect, useState} from "react"
import type {Prize, WheelData} from "@/types/prize"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { StorageService } from "@/services/storage-service"
import { Textarea } from "./ui/textarea"
import {Input} from "@/components/ui/input";


export function DataImportPopup({onClose}: {onClose: any}) {
    const [data, setData] = useState<WheelData>(StorageService.getData());

    const handleExport = () => {
        StorageService.exportData();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            StorageService.importData(file)
                .then(() => {
                    setData(StorageService.getData());
                    alert("Import thành công!");
                })
                .catch((error) => {
                    alert("Lỗi khi nhập file: " + error);
                });
        }
    };

    const handleReset = () => {
        StorageService.resetToDefault();
        setData(StorageService.getData());
        alert("Dữ liệu đã được đặt lại mặc định!");
    };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-300 border-4 border-pink-200">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center">
            <Button onClick={handleExport} className="w-full">
                Xuất dữ liệu
            </Button>

            <Input type="file" accept=".json" onChange={handleImport} />

            <Button onClick={handleReset} variant="destructive" className="w-full">
                Đặt lại dữ liệu mặc định
            </Button>
        </div>
      </div>

    </div>
  )
}

