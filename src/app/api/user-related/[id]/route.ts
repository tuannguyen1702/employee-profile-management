// app/api/configs/route.js
import { environments } from '@/config';
import { NextRequest, NextResponse } from 'next/server';

// // Xử lý yêu cầu PATH
// export async function PATCH(request: NextRequest, { params }: { params: { key: string } }) {
//   try {
//     const body = await request.json();
//     console.log(`body`, body)


//     // Gửi dữ liệu đến API bên ngoài
//     const response = await fetch(`${environments.apiEndpointURL}/config/${params.key}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     console.log(`response`, response)

//     if (!response.ok) {
//       return NextResponse.json({ message: 'Failed to create config' }, { status: response.status });
//     }

//     const data = await response.json();
//     return NextResponse.json(data, { status: 200 }); // Trả về dữ liệu mới được tạo
//   } catch (error) {
//     console.error('Error creating config:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }

// Xử lý yêu cầu PATH
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    // Gửi dữ liệu đến API bên ngoài
    const response = await fetch(`${environments.apiEndpointURL}/user-related/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });


    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to update client' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 }); // Trả về dữ liệu mới được tạo
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

