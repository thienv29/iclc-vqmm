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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
const formSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Required' })
    .email({ message: 'Vui lòng nhập địa chỉ email hợp lệ.' }),
  school: z.string().trim().min(1, { message: 'Required' }),
  schoolType: z.string().trim().min(1, { message: 'Required' }),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, {
      message: 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).',
    }),
  booth: z.string().optional(),
  interests: z.array(z.string()).optional(),
  role: z.enum(['Quý Thầy Cô', 'Quý Phụ huynh', 'Khác'], {
    required_error: 'Vui lòng chọn một tùy chọn.',
  }),
})

type FormValues = z.infer<typeof formSchema>

type RegistrationFormProps = {
  onSubmit: (data: Record<string, string | string[]>) => void
  isSpinning: boolean
}

const boothOptions = [
  'Tiếng Anh Toán – Khoa học thực nghiệm',
  'Tiếng Anh giao tiếp',
  'Tiếng Anh mầm non STEAM',
  'eClass',
  'Công dân toàn cầu',
  'Giáo dục trọn đời',
  'Kỹ năng cho thế hệ tương lai',
  'Môi trường xanh & sạch',
  'Trạm dừng 4.0',
]

export const interestOptions = [
  { id: 'tienganhtoan', label: 'Tiếng Anh Toán – Khoa học thực nghiệm' },
  { id: 'tienganggiaotiep', label: 'Tiếng Anh giao tiếp' },
  { id: 'tienganhsteam', label: 'Tiếng Anh mầm non STEAM' },
  { id: 'eclass', label: 'eClass' },
  { id: 'congdantoancau', label: 'Công dân toàn cầu' },
  { id: 'giaoductronddoi', label: 'Giáo dục trọn đời' },
  { id: 'kynangtuonglai', label: 'Kỹ năng cho thế hệ tương lai' },
  { id: 'moitruongxanh', label: 'Môi trường xanh & sạch' },
  { id: 'tramdung40', label: 'Trạm dừng 4.0' },
]

export const RegistrationForm = forwardRef<
  { reset: () => void },
  RegistrationFormProps
>(({ onSubmit, isSpinning }, ref) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      school: '',
      schoolType: '',
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
        {/* <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-sm'>Ông/Bà là</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='h-9 text-sm'>
                    <SelectValue placeholder='Chọn vai trò' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Quý Thầy Cô'>Quý Thầy Cô</SelectItem>
                  <SelectItem value='Quý Phụ huynh'>Quý Phụ huynh</SelectItem>
                  <SelectItem value='Khác'>Khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name='school'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-sm'>Trường học / Đơn vị</FormLabel>
              <FormControl>
                <Input
                  placeholder='Nhập tên trường'
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
          name='schoolType'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-sm'>Cấp giáo dục</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col space-y-1'
                >
                  {/* <FormItem className='space-y-1'>
                    <FormControl className={'mr-2'}>
                      <RadioGroupItem value='Mầm non' id='mamnon' />
                    </FormControl>
                    <FormLabel htmlFor='mamnon' className='text-sm'>
                      Mầm non
                    </FormLabel>
                  </FormItem> */}
                  <FormItem className='space-y-1'>
                    <FormControl className={'mr-2'}>
                      <RadioGroupItem value='Tiểu học' id='tieuhoc' />
                    </FormControl>
                    <FormLabel htmlFor='tieuhoc' className='text-sm'>
                      Tiểu học
                    </FormLabel>
                  </FormItem>
                  <FormItem className='space-y-1'>
                    <FormControl className={'mr-2'}>
                      <RadioGroupItem value='Trung học cơ sở' id='thcs' />
                    </FormControl>
                    <FormLabel htmlFor='thcs' className='text-sm'>
                      Trung học cơ sở
                    </FormLabel>
                  </FormItem>
                  {/* <FormItem className='space-y-1'>
                    <FormControl className={'mr-2'}>
                      <RadioGroupItem value='Trung học phổ thông' id='thpt' />
                    </FormControl>
                    <FormLabel htmlFor='thpt' className='text-sm'>
                      Trung học phổ thông
                    </FormLabel>
                  </FormItem> */}
                </RadioGroup>
              </FormControl>
              <FormMessage className='text-xs' />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full !mt-5 animate-pulse hover:animate-none'
          disabled={isSpinning}
        >
          {isSpinning ? 'Đang quay...' : 'Quay Ngay'}
        </Button>
      </form>
    </Form>
  )
})

RegistrationForm.displayName = 'RegistrationForm'
