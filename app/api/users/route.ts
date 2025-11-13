import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "createdAt";
  const direction = searchParams.get("direction") || "desc";
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { role: { equals: search.toUpperCase() as any } },
          ],
        }
      : {};

    let users;
    let totalUsers;

    if (all === "true") {
      users = await prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          [sort]: direction,
        },
      });
      totalUsers = users.length; // If fetching all, totalUsers is simply the count of fetched users
    } else {
      users = await prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: {
          [sort]: direction,
        },
        skip: offset,
        take: limit,
      });
      totalUsers = await prisma.user.count({ where });
    }

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({ users, totalPages, totalUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Name, email, role, and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
