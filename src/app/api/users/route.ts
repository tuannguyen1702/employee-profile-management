// app/api/users/route.js
import { environments } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch dữ liệu từ API bên ngoài
    const response = await fetch(`${environments.apiEndpointURL}/users`);
    // Kiểm tra nếu response không thành công
    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch data" },
        { status: response.status }
      );
    }

    // Chuyển đổi dữ liệu sang JSON
    const data = await response.json();
    // Trả về dữ liệu
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Xử lý yêu cầu POST
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Gửi dữ liệu đến API bên ngoài
    const response = await fetch(`${environments.apiEndpointURL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 }); // Trả về dữ liệu mới được tạo
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
