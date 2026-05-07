import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { hashPassword } from "@/utils/password";

const PROFILE_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      fullName: true,
      country: true,
      profile: true,
      preferredLocale: true,
      role: true,
      status: true,
      isEmailVerified: true,
      createdAt: true,
    },
  },
} as const;

export const InstructorsService = {
  async list(filter: { featured?: boolean }) {
    return prisma.instructorProfile.findMany({
      where: {
        ...(filter.featured !== undefined ? { isFeatured: filter.featured } : {}),
        user: { isDeleted: false, status: "ACTIVE" },
      },
      include: PROFILE_INCLUDE,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  },

  async get(id: string) {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id },
      include: PROFILE_INCLUDE,
    });
    if (!profile) throw new AppError(httpStatus.NOT_FOUND, "Instructor not found.");
    return profile;
  },

  async create(input: {
    email: string;
    fullName: string;
    password: string;
    country?: string;
    preferredLocale?: "en" | "ar";
    profile?: string;
    headline?: string;
    headlineArabic?: string;
    bio?: string;
    bioArabic?: string;
    expertise?: string[];
    twitterUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    isFeatured?: boolean;
  }) {
    const existing = await prisma.user.findFirst({
      where: { email: input.email, isDeleted: false },
    });
    if (existing) {
      throw new AppError(httpStatus.CONFLICT, "A user with that email already exists.");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        fullName: input.fullName,
        password: passwordHash,
        role: "INSTRUCTOR",
        status: "ACTIVE",
        authType: "EMAIL_PASSWORD",
        isEmailVerified: true,
        country: input.country || "",
        preferredLocale: input.preferredLocale || "en",
        profile: input.profile || "",
        instructorProfile: {
          create: {
            headline: input.headline || "",
            headlineArabic: input.headlineArabic || "",
            bio: input.bio || "",
            bioArabic: input.bioArabic || "",
            expertise: input.expertise || [],
            twitterUrl: input.twitterUrl || "",
            linkedinUrl: input.linkedinUrl || "",
            websiteUrl: input.websiteUrl || "",
            isFeatured: input.isFeatured ?? false,
          },
        },
      },
      include: { instructorProfile: true },
    });

    if (!user.instructorProfile) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Instructor creation failed.");
    }

    return InstructorsService.get(user.instructorProfile.id);
  },

  async update(
    id: string,
    input: Partial<{
      fullName: string;
      country: string;
      preferredLocale: "en" | "ar";
      profile: string;
      headline: string;
      headlineArabic: string;
      bio: string;
      bioArabic: string;
      expertise: string[];
      twitterUrl: string;
      linkedinUrl: string;
      websiteUrl: string;
      isFeatured: boolean;
    }>,
  ) {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!profile) throw new AppError(httpStatus.NOT_FOUND, "Instructor not found.");

    const userPatch: Record<string, unknown> = {};
    if (input.fullName !== undefined) userPatch.fullName = input.fullName;
    if (input.country !== undefined) userPatch.country = input.country;
    if (input.preferredLocale !== undefined) userPatch.preferredLocale = input.preferredLocale;
    if (input.profile !== undefined) userPatch.profile = input.profile;

    const profilePatch: Record<string, unknown> = {};
    (
      [
        "headline",
        "headlineArabic",
        "bio",
        "bioArabic",
        "expertise",
        "twitterUrl",
        "linkedinUrl",
        "websiteUrl",
        "isFeatured",
      ] as const
    ).forEach((k) => {
      if (input[k] !== undefined) profilePatch[k] = input[k] as never;
    });

    await prisma.$transaction([
      ...(Object.keys(userPatch).length
        ? [prisma.user.update({ where: { id: profile.userId }, data: userPatch })]
        : []),
      ...(Object.keys(profilePatch).length
        ? [prisma.instructorProfile.update({ where: { id }, data: profilePatch })]
        : []),
    ]);

    return InstructorsService.get(id);
  },

  async remove(id: string): Promise<void> {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id },
      select: { userId: true, courses: { where: { isDeleted: false }, select: { id: true } } },
    });
    if (!profile) throw new AppError(httpStatus.NOT_FOUND, "Instructor not found.");
    if (profile.courses.length > 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Instructor still has active courses. Reassign or delete them first.",
      );
    }

    await prisma.$transaction([
      prisma.refreshToken.updateMany({
        where: { userId: profile.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: profile.userId },
        data: { isDeleted: true, status: "DELETED" },
      }),
    ]);
  },
};
