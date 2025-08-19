function WheelInfo() {
  return (
    <div className='w-full max-w-lg'>
      <h2 className='text-2xl font-semibold mb-3 text-[#16177b]'>📌 Lưu ý</h2>
      <div className='w-full bg-gray-50 shadow-lg p-5 mt-3 rounded-lg border border-gray-200'>
        <ul className='space-y-2 text-gray-700'>
          <li className=''>
            <span className='mr-2'>✅</span> Mỗi số điện thoại chỉ được
            quay&nbsp;<b>01 lần</b>.
          </li>
          <li className=''>
            <span className='mr-2'>📧</span> Quà tặng&nbsp;<b>E-voucher</b>
            &nbsp;sẽ nhận qua email.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default WheelInfo
