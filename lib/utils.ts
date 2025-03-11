import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {interestOptions} from "@/components/registration-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function addContact(order: any) {
  const contactApiUrl = 'https://anhnguiclc.com/rest/1/z6j1e8kdzjcjegok/crm.contact.add.json';
  const contactData = {
    FIELDS: {
      TITLE: "Contact create a new contact by API from " + window.location.hostname,
      NAME: order.fullName,
      LAST_NAME: '',
      EMAIL: [{ VALUE: order.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: order.phone, VALUE_TYPE: 'WORK' }],
    },
  };
  return await fetch(contactApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
}

const getInterestLabels = (interests: string[]) => {
  return interests.map(id =>
      interestOptions.find(option => option.id === id)?.label || "Không xác định"
  );
};

export async function createDealBitrix24(order: any) {
  const labels = getInterestLabels(order.interests);
  try {
    const dealApiUrl = 'https://anhnguiclc.com/rest/1/dcqn591zbut35f5u/crm.deal.add.json';
    const contactResponse = await addContact(order);
    const contactResult = await contactResponse.json();

    if (contactResult.result) {
      const dealData = {
        FIELDS: {
          TITLE: `${order.fullName} quay trúng ${order.nameBitrix || order.prizeName }`,
          CATEGORY_ID: 56,
          CONTACT_ID: contactResult.result,
          UF_CRM_1637679301: 'Vòng Quay May Mắn ',
          UF_CRM_1729745560: order.nameBitrix || order.prizeName,
          UF_CRM_1741686182: order.booth,
          UF_CRM_1741686210: labels.join(', '),
        },
      };

      const dealResponse = await fetch(dealApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData),
      });

      const dealResult = await dealResponse.json();
      return dealResult;
      // Handle the deal response if necessary
    }
  } catch (error) {
    console.error('Error:', error);
  }
}