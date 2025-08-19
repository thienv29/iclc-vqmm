'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Required' })
    .email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
  phone: z.string().regex(/^\d{10,11}$/, {
    message: 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).',
  }),
})

type FormValues = z.infer<typeof formSchema>

type RegistrationFormProps = {
  onSubmit: (data: Record<string, string | string[]>) => void
  isSpinning: boolean
  isSubmittingForm: boolean // New prop
}

export const RegistrationForm2 = forwardRef<
  { reset: () => void },
  RegistrationFormProps
>(({ onSubmit, isSpinning, isSubmittingForm }, ref) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-sm'>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  placeholder='Nhập họ và tên'
                  {...field}
                  className='h-9 text-sm'
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-sm'>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  placeholder='Nhập số điện thoại'
                  {...field}
                  className='h-9 text-sm'
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-sm'>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Nhập email'
                  type='email'
                  {...field}
                  className='h-9 text-sm'
                />
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full !mt-5 animate-pulse hover:animate-none'
          disabled={isSpinning || isSubmittingForm}
        >
          {isSubmittingForm ? 'Đang kiểm tra...' : isSpinning ? 'Đang quay...' : 'Quay Ngay'}
        </Button>
      </form>
    </Form>
  )
})

RegistrationForm2.displayName = 'RegistrationForm2'
