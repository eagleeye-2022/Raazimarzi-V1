// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Contact from "@/models/contact";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     await Contact.create(body);

//     return NextResponse.json(
//       { message: "Contact saved successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
