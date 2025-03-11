"use client"

import { forwardRef, useImperativeHandle } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự." }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
  phone: z.string().min(10, { message: "Vui lòng nhập số điện thoại hợp lệ." }),
  school: z.string().optional(),
  class: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type RegistrationFormProps = {
  onSubmit: (data: Record<string, string>) => void
  isSpinning: boolean
}

export const RegistrationForm = forwardRef<{ reset: () => void }, RegistrationFormProps>(
  ({ onSubmit, isSpinning }, ref) => {
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
      },
    })

    useImperativeHandle(ref, () => ({
      reset: () => {
        form.reset()
      },
    }))

    function handleSubmit(values: FormValues) {
      onSubmit(values)
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

          <Button type="submit" className="w-full !mt-5 animate-pulse hover:animate-none" disabled={isSpinning}>
            {isSpinning ? "Đang quay..." : "Quay Ngay"}
          </Button>
        </form>
      </Form>
    )
  },
)

RegistrationForm.displayName = "RegistrationForm"

