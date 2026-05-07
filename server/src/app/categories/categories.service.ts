import { prisma } from "@/lib/db/db";
import AppError from "@/helpers/errors/AppError";
import httpStatus from "http-status";
import { slugify } from "@/utils/slug";

export const CategoriesService = {
  async list(filter: { featured?: boolean }) {
    return prisma.category.findMany({
      where: {
        isDeleted: false,
        ...(filter.featured !== undefined ? { isFeatured: filter.featured } : {}),
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
  },

  async get(idOrSlug: string) {
    const category = await prisma.category.findFirst({
      where: {
        isDeleted: false,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });
    if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found.");
    return category;
  },

  async create(input: {
    name: string;
    nameArabic?: string;
    description?: string;
    descriptionArabic?: string;
    icon?: string;
    order?: number;
    isFeatured?: boolean;
  }) {
    let slug = slugify(input.name);
    let n = 1;
    while (await prisma.category.findUnique({ where: { slug } })) {
      n++;
      slug = `${slugify(input.name)}-${n}`;
    }
    return prisma.category.create({
      data: {
        slug,
        name: input.name,
        nameArabic: input.nameArabic || "",
        description: input.description || "",
        descriptionArabic: input.descriptionArabic || "",
        icon: input.icon || "",
        order: input.order ?? 0,
        isFeatured: input.isFeatured ?? false,
      },
    });
  },

  async update(
    id: string,
    input: Partial<{
      name: string;
      nameArabic: string;
      description: string;
      descriptionArabic: string;
      icon: string;
      order: number;
      isFeatured: boolean;
    }>,
  ) {
    return prisma.category.update({
      where: { id },
      data: input,
    });
  },

  async remove(id: string): Promise<void> {
    await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
