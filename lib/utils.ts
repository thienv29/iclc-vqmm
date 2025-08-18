import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { interestOptions } from '@/components/wheel1/registration-form'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const bitrixCategoryNumber = 80
export async function addContact(order: any) {
  const contactApiUrl =
    'https://anhnguiclc.com/rest/1/z6j1e8kdzjcjegok/crm.contact.add.json'
  const contactData = {
    FIELDS: {
      TITLE:
        'Contact create a new contact by API from ' + window.location.hostname,
      NAME: order.fullName,
      LAST_NAME: '',
      EMAIL: [{ VALUE: order.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: order.phone, VALUE_TYPE: 'WORK' }],
    },
  }
  return await fetch(contactApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  })
}

const getInterestLabels = (interests: string[]) => {
  if (!interests) return []
  return interests.map(
    (id) =>
      interestOptions.find((option) => option.id === id)?.label ||
      'Không xác định'
  )
}
const API_BASE = 'https://anhnguiclc.com/rest/1/dcqn591zbut35f5u'

export async function isRolledByPhone(phoneNumber: string): Promise<boolean> {
  try {
    const dealResponse = await fetch(
      `${API_BASE}/crm.deal.list.json?filter[CATEGORY_ID]=${bitrixCategoryNumber}&filter[UF_CRM_DEAL_1717076519247]=${phoneNumber}`
    )
    const dealData = await dealResponse.json()
    const deals = dealData.result || []
    return deals.length > 0
  } catch (error) {
    console.error('Lỗi khi gọi API:', error)
    return false
  }
}


export async function checkGiai(): Promise<any> {
  try {
    const dealResponse = await fetch(
        `${API_BASE}/crm.deal.list.json?filter[CATEGORY_ID]=${bitrixCategoryNumber}`
    )
    const dealData = await dealResponse.json()
    const deals = dealData.result || []
    return {
      dautu:deals.filter((item: any) => item.TITLE.includes("Đầu Tư")).length,
      quocte:deals.filter((item: any) => item.TITLE.includes("Trải Nghiệm Quốc Tế")).length
    }

  } catch (error) {
    console.error('Lỗi khi gọi API:', error)
    return false
  }
}


export async function createDealBitrix24(order: any) {
  const labels = getInterestLabels(order.interests)
  try {
    const dealApiUrl =
      'https://anhnguiclc.com/rest/1/dcqn591zbut35f5u/crm.deal.add.json'
    const contactResponse = await addContact(order)
    const contactResult = await contactResponse.json()

    if (contactResult.result) {
      const dealData = {
        FIELDS: {
          TITLE: `${order.fullName} quay trúng ${
            order.nameBitrix || order.prizeName
          }`,
          CATEGORY_ID: bitrixCategoryNumber,
          CONTACT_ID: contactResult.result,
          COMMENTS: order.description.split('và')[0],
          UF_CRM_1637679301: 'Vòng Quay May Mắn ',
          UF_CRM_1729745560: order.nameBitrix || order.prizeName,
          UF_CRM_1741686182: order.description,
          UF_CRM_1741686210: labels.join(', ') ?? '',
          UF_CRM_DEAL_1717076519247: order.phone,
          UF_CRM_6178C6D2EDA26: order.school,
          UF_CRM_1742537683: order.schoolType,
          UF_CRM_1742859134: order.note,
          UF_CRM_1744194486: order.role
        },
      }

      const dealResponse = await fetch(dealApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      })

      const dealResult = await dealResponse.json()
      return dealResult
      // Handle the deal response if necessary
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
