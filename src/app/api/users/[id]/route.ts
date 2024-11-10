// app/api/users/route.js
import { environments } from "@/config";
import { NextResponse } from "next/server";


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    // Gửi dữ liệu đến API bên ngoài
    const response = await fetch(`${environments.apiEndpointURL}/users/${params.id}`, {
      method: "PATCH",
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
