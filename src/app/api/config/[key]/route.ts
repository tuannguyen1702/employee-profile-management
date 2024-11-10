// app/api/configs/route.js
import { environments } from '@/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    // Fetch dữ liệu từ API bên ngoài
    console.log(`params`, params)
    const response = await fetch(`${environments.apiEndpointURL}/config/${params.key}`);

    // Kiểm tra nếu response không thành công
    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch data' }, { status: response.status });
    }

    // Chuyển đổi dữ liệu sang JSON
    const data = await response.json();

    // Trả về dữ liệu
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Xử lý yêu cầu PATH
export async function PATCH(request: NextRequest, { params }: { params: { key: string } }) {
  try {
    const body = await request.json();
    console.log(`body`, body)


    // Gửi dữ liệu đến API bên ngoài
    const response = await fetch(`${environments.apiEndpointURL}/config/${params.key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`response`, response)

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to create config' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 }); // Trả về dữ liệu mới được tạo
  } catch (error) {
    console.error('Error creating config:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
