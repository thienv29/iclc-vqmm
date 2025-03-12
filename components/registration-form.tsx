"use client"

import { forwardRef, useImperativeHandle, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự." }),
    email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
    phone: z.string().min(10, { message: "Vui lòng nhập số điện thoại hợp lệ." }),
    booth: z.string().optional(),
    interests: z.array(z.string()).min(1, {
        message: "Vui lòng chọn ít nhất một sản phẩm.",
    }),
})

type FormValues = z.infer<typeof formSchema>

type RegistrationFormProps = {
    onSubmit: (data: Record<string, string | string[]>) => void
    isSpinning: boolean
}

const boothOptions = [
    "Tiếng Anh Toán – Khoa học thực nghiệm",
    "Tiếng Anh giao tiếp",
    "Tiếng Anh mầm non STEAM",
    "eClass",
    "Công dân toàn cầu",
    "Giáo dục trọn đời",
    "Kỹ năng cho thế hệ tương lai",
    "Môi trường xanh & sạch",
    "Trạm dừng 4.0",
]

export const interestOptions = [
    { id: "tienganhtoan", label: "Tiếng Anh Toán – Khoa học thực nghiệm" },
    { id: "tienganggiaotiep", label: "Tiếng Anh giao tiếp" },
    { id: "tienganhsteam", label: "Tiếng Anh mầm non STEAM" },
    { id: "eclass", label: "eClass" },
    { id: "congdantoancau", label: "Công dân toàn cầu" },
    { id: "giaoductronddoi", label: "Giáo dục trọn đời" },
    { id: "kynangtuonglai", label: "Kỹ năng cho thế hệ tương lai" },
    { id: "moitruongxanh", label: "Môi trường xanh & sạch" },
    { id: "tramdung40", label: "Trạm dừng 4.0" },
]

export const RegistrationForm = forwardRef<{ reset: () => void }, RegistrationFormProps>(
    ({ onSubmit, isSpinning }, ref) => {
        const [expandedSection, setExpandedSection] = useState<string | null>(null)

        const form = useForm<FormValues>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                name: "",
                email: "",
                phone: "",
                interests: [],
            },
        })

        useImperativeHandle(ref, () => ({
            reset: () => {
                form.reset()
                setExpandedSection(null)
            },
        }))

        function handleSubmit(values: FormValues) {
            onSubmit(values)
        }

        const toggleSection = (section: string) => {
            setExpandedSection(expandedSection === section ? null : section)
        }

        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-sm">Họ và tên</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập họ và tên" {...field} className="h-9 text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-sm">Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập số điện thoại" {...field} className="h-9 text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-sm">Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập email" type="email" {...field} className="h-9 text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Collapsible Interests Selection */}
                    <div className="border rounded-md">
                        <button
                            type="button"
                            onClick={() => toggleSection("interests")}
                            className="flex justify-between items-center w-full p-2 text-left text-sm font-medium"
                        >
                            <span>Ông/Bà quan tâm đến sản phẩm nào? </span>
                            <span className="flex items-center">
                {form.getValues("interests")?.length > 0 && (
                    <span className="mr-2 text-xs text-muted-foreground">
                    Đã chọn {form.getValues("interests")?.length}
                  </span>
                )}
                                {expandedSection === "interests" ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
              </span>
                        </button>

                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-300",
                                expandedSection === "interests" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                            )}
                        >
                            <div className="p-2 pt-0 border-t">
                                <FormField
                                    control={form.control}
                                    name="interests"
                                    render={() => (
                                        <FormItem>
                                            {interestOptions.map((item, index) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="interests"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem key={item.id} className={`flex flex-row items-start space-x-2 space-y-0 mb-1  ${index === 0 ? "mt-3" : ""}`}>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(field.value?.filter((value) => value !== item.id))
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full !mt-5 animate-pulse hover:animate-none" disabled={isSpinning}>
                        {isSpinning ? "Đang quay..." : "Quay Ngay"}
                    </Button>
                </form>
            </Form>
        )
    },
)

RegistrationForm.displayName = "RegistrationForm"

