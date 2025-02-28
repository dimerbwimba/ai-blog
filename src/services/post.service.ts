import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { Post, PostStatus, Prisma } from '@prisma/client'

interface CreatePostDTO {
  title: string
  content: string
  slug: string
  description: string
  image: string
  status: PostStatus
  featured: boolean
  destinations?: string[]
  categories?: string[]
  tags?: string[]
  keywords?: string[]
  authorId: string
  faqs: { question: string; answer: string }[]
}

interface UpdatePostDTO extends CreatePostDTO {
  id: string
}

export const PostService = {
  async getUserPosts(userId: string) {
    return await prisma.post.findMany({
      where: {
        authorId: userId
       },
      include: {
        author: true,
        destinations: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getFeaturedPosts() {
    return await prisma.post.findMany({
      where: { 
        status:"PUBLISHED",
        featured: true 
      },
      include: {
        author: true,
        destinations: true,
        categories: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async createPost(data: CreatePostDTO): Promise<Post> {
    try {
      const createInput: Prisma.PostCreateInput = {
        title: data.title,
        content: data.content,
        slug: slugify(data.title),
        seo_slug: slugify(data.slug),
        description: data.description,
        image: data.image,
        status: data.status,
        featured: data.featured,
        tags: data.tags || [],
        keywords: data.keywords || [],
        author: {
          connect: { id: data.authorId }
        },
        categories: data.categories ? {
          create: data.categories.map((id: string) => ({
            category: {
              connect: { id }
            }
          }))
        } : undefined,
        destinations: data.destinations ? {
          create: data.destinations.map((destinationId: string) => ({
            destination: {
              connect: { id: destinationId }
            }
          }))
        } : undefined,
      }

      const post = await prisma.post.create({
        data: createInput,
        include: {
          author: true,
          destinations: true,
          categories: true,
        }
      })
      
      await prisma.fAQ.createMany({
        data: data.faqs.map(faq => ({
          question: faq.question,
          answer: faq.answer,
          postId: post.id,
          authorId: data.authorId,
        }))
      })

      return post
    } catch (error) {
      console.error("[CREATE_POST_ERROR]", error)
      throw new Error("Failed to create post")
    }
  },

  async validateSlug(slug: string): Promise<boolean> {
    try {
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      })
      return !existingPost
    } catch (error) {
      console.error("[VALIDATE_SLUG_ERROR]", error)
      throw new Error("Failed to validate slug")
    }
  },

  async deletePost(id: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id }
      })

      if (!post) {
        throw new Error('Post not found')
      }

      // Delete all relations first
      await prisma.$transaction([
        prisma.categoriesOnPosts.deleteMany({
          where: { postId: id }
        }),
        prisma.destinationOnPosts.deleteMany({
          where: { postId: id }
        }),
        prisma.comment.deleteMany({
          where: { postId: id }
        }),
        prisma.fAQ.deleteMany({
          where: { postId: id }
        }),
        prisma.post.delete({
          where: { id }
        })
      ])

      return post
    } catch (error) {
      console.error("[DELETE_POST_ERROR]", error)
      throw new Error("Failed to delete post")
    }
  },

  async updatePost({ id, ...data }: UpdatePostDTO): Promise<Post> {
    try {
      const updateInput: Prisma.PostUpdateInput = {
        title: data.title,
        content: data.content,
        slug: slugify(data.title),
        seo_slug: slugify(data.slug),
        description: data.description,
        image: data.image,
        status: data.status,
        featured: data.featured,
        tags: data.tags,
        keywords: data.keywords,
        updatedAt: new Date(),
      }

      // Delete existing FAQs
      await prisma.fAQ.deleteMany({
        where: { postId: id }
      })

      // Handle categories update
      if (data.categories) {
        await prisma.categoriesOnPosts.deleteMany({
          where: { postId: id }
        })
      }

      // Handle destinations update
      if (data.destinations) {
        await prisma.destinationOnPosts.deleteMany({
          where: { postId: id }
        })
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          ...updateInput,
          categories: data.categories ? {
            create: data.categories.map((categoryId: string) => ({
              category: {
                connect: { id: categoryId }
              }
            }))
          } : undefined,
          destinations: data.destinations ? {
            create: data.destinations.map((destinationId: string) => ({
              destination: {
                connect: { id: destinationId }
              }
            }))
          } : undefined,
          faqs: data.faqs ? {
            create: data.faqs.map(faq => ({
              question: faq.question,
              answer: faq.answer,
              author: {
                connect: { id: data.authorId }
              }
            }))
          } : undefined
        },
        include: {
          author: true,
          destinations: true,
          categories: true,
          faqs: true,
        }
      })

      return post
    } catch (error) {
      console.error("[UPDATE_POST_ERROR]", error)
      throw new Error("Failed to update post")
    }
  },

  async getPostById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        destinations: true,
        categories: true,
        faqs: {
          select: {
            question: true,
            answer: true,
          }
        },
      },
    })
  },

  async publishPost(id: string): Promise<Post> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          destinations: true,
          categories: true,
          faqs: true
        }
      })

      if (!post) {
        throw new Error("Post not found")
      }

      // Validate post has required fields before publishing
      if (!post.destinations.length || !post.categories.length || !post.faqs.length) {
        throw new Error("Post must have destinations, categories and FAQs before publishing")
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          updatedAt: new Date()
        },
        include: {
          author: true,
          destinations: true,
          categories: true
        }
      })

      return updatedPost
    } catch (error) {
      console.error("[PUBLISH_POST_ERROR]", error)
      throw new Error(error instanceof Error ? error.message : "Failed to publish post")
    }
  },
  async getPublicPostBySlug(slug: string) {
    try {
      const post = await prisma.post.findFirst({
        where: { 
          seo_slug: slug,
          status: "APPROVED" 
        },
        select: {
          id: true,
          title: true,
          content: true,
          description: true,
          image: true,
          seo_slug: true,
          createdAt: true,
          updatedAt: true,
          tags: true,
          keywords: true,
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
                  slug: true,
                  image: true
                }
              }
            }
          },
          categories: {
            select: {
              category: {
                select: {
                  name: true,
                  slug: true
                }
              }
            },
          },
          faqs: {
            select: {
              question: true,
              answer: true
            }
          },
          views: {
            select: {
              id: true
            }
          }
        }
      })

      if (!post) return null

      return {
        ...post,
        author: {
          name: post.author.name,
          image: post.author.image
        },
        destinations: post.destinations.map(d => ({
          name: d.destination.name,
          slug: d.destination.slug,
          image: d.destination.image
        })),
        categories: post.categories.map(c => ({
          name: c.category.name,
          slug: c.category.slug
        })),
        views: post.views.length
      }
    } catch (error) {
      console.error("[GET_PUBLIC_POST_ERROR]", error)
      throw new Error("Failed to get post")
    }
  },

  async getPublicPosts({ page = 1, limit = 9 }) {
    try {
      const skip = (page - 1) * limit
  
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            status: "APPROVED",
          },
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            slug: true,
            seo_slug: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true,
              }
            },
            destinations: {
              select: {
                destination: {
                  select: {
                    name: true,
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          skip,
          take: limit,
        }),
        prisma.post.count({
          where: {
            status: "APPROVED",
          }
        })
      ])
  
      return {
        posts,
        total,
      }
    } catch (error) {
      console.error("[GET_PUBLIC_POST_ERROR]", error)
      throw new Error("Failed to get post")
    }
  },

  async getPublicTravelGuides(page: number = 1, limit: number = 10) {
    try {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: {
            status: 'APPROVED',
            categories: {
              some: {
                category: {
                  slug: {
                    contains: 'travel-guides',
                    mode: 'insensitive'
                  }
                }
              }
            }
          },
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            seo_slug: true,
            createdAt: true,
            faqs: true,
            author: {
              select: {
                name: true,
                image: true
              }
            },
            destinations: {
              select:{
                destination: {
                  select: {
                    name: true,
                    slug: true
                  }
                }
              }
            },
            categories: {
              include: {
                category: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.post.count({
          where: {
            status: 'APPROVED',
            categories: {
              some: {
                category: {
                  slug: {
                    contains: 'travel-guides',
                    mode: 'insensitive'
                  }
                }
              }
            }
          }
        })
      ]);

      return {
        posts: posts.map(post => ({
          ...post,
          categories: post.categories.map(c => c.category)
        })),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit
        }
      };
    } catch (error) {
      console.error("[GET_PUBLIC_TRAVEL_GUIDES_ERROR]", error);
      throw error;
    }
  },

  async getLatestPosts(limit: number = 3) {
    try {
      const posts = await prisma.post.findMany({
        where: {
          status: "APPROVED",
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          seo_slug: true,
          image: true,
          createdAt: true,
        }
      })

      return {
        success: true,
        data: posts
      }
    } catch (error) {
      console.error('[GET_LATEST_POSTS_ERROR]', error)
      return {
        success: false,
        error: 'Failed to fetch latest posts'
      }
    }
  }
} 