import { prisma } from '@/lib/prisma'

interface CategoryFormValues{
    name: string
    description: string
    image: string   
    slug: string
}
export const CategoryService = {
  async getAllCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return categories.map(category => ({
      ...category,
      postsCount: category._count.posts
    }))
  },

  async createCategory(data: CategoryFormValues) {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        slug: data.slug
      }
    })
    return category
  },

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    await prisma.category.delete({
      where: { id }
    })
    return category
  },

  async getAllPublicCategories() {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      return categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        slug: category.slug,
        postsCount: category._count.posts
      }));
    } catch (error) {
      console.error("[GET_ALL_PUBLIC_CATEGORIES_ERROR]", error);
      throw error;
    }
  },

  async getCategoryBySlug(slug: string, page: number = 1, limit: number = 10) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      });

      if (!category) return null;

      const posts = await prisma.categoriesOnPosts.findMany({
        where: {
          category: { slug },
          post: {
            status: 'APPROVED'
          }
        },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
              seo_slug: true,
              createdAt: true,
              author: {
                select: {
                  name: true,
                  image: true
                }
              },
              destinations: {
                select: {
                  destination: {
                    select: {
                      name: true,
                      slug: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          post: {
            createdAt: 'desc'
          }
        },
        skip: (page - 1) * limit,
        take: limit
      });

      return {
        ...category,
        posts: posts.map(p => p.post),
        pagination: {
          total: category._count.posts,
          pages: Math.ceil(category._count.posts / limit),
          currentPage: page,
          perPage: limit
        }
      };
    } catch (error) {
      console.error("[GET_CATEGORY_BY_SLUG_ERROR]", error);
      throw error;
    }
  }
} 