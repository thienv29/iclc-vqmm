async function addOrUpdateContact(order) {
  const baseApiUrl = 'https://anhnguiclc.com/rest/1/z6j1e8kdzjcjegok'
  const searchApiUrl = `${baseApiUrl}/crm.contact.list.json`
  const addApiUrl = `${baseApiUrl}/crm.contact.add.json`
  const updateApiUrl = `${baseApiUrl}/crm.contact.update.json`

  const query = {
    FILTER: {
      // Ưu tiên tìm theo email, nếu không có thì theo phone
      [order.email ? 'EMAIL' : 'PHONE']: order.email || order.phone,
    },
  }

  // Tìm contact đã tồn tại
  const searchRes = await fetch(searchApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })
  const searchData = await searchRes.json()

  const contactFields = {
    TITLE: `Contact created or updated via API 
    
    from ${window.location.hostname}`,
    NAME: order.fullName,
    LAST_NAME: '',
    EMAIL: [{ VALUE: order.email, VALUE_TYPE: 'WORK' }],
    PHONE: [{ VALUE: order.phone, VALUE_TYPE: 'WORK' }],
  }

  if (searchData?.result?.length > 0) {
    // Contact đã tồn tại -> cập nhật
    const contactId = searchData.result[0].ID
    await fetch(updateApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ID: contactId,
        FIELDS: contactFields,
      }),
    })
    return { ...searchData.result[0], updated: true }
  } else {
    // Chưa có -> tạo mới
    const addRes = await fetch(addApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ FIELDS: contactFields }),
    })
    const addData = await addRes.json()
    return { ID: addData.result, created: true }
  }
}

addOrUpdateContact({
  fullName: 'Nguyen Van A',
  email: 'nguyenvana@gmail.com',
  phone: '0123456789',
}).then(result => {
  if (result.created) {
    console.log('Contact created successfully:', result);
  } else if (result.updated) {
    console.log('Contact updated successfully:', result);
  } else {
    console.error('Failed to add or update contact:', result);
  }
}
).catch(error => {
  console.error('Error during contact add/update:', error);
}
);