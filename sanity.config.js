/**
 * This is a client-side configuration file for Sanity Studio.
 * It's not used in the main application, but is included for reference.
 * 
 * To set up Sanity Studio:
 * 1. Install the Sanity CLI: npm install -g @sanity/cli
 * 2. Create a new project: sanity init
 * 3. Use this configuration as a reference
 */

export default {
  projectId: 'aoh6qdxm',
  dataset: 'production',
  title: 'JDM HEAVEN CMS',
  apiVersion: '2023-05-03',
  basePath: '/admin',
  plugins: [
    '@sanity/vision',
    '@sanity/dashboard',
  ],
  schema: {
    types: [
      // Document types
      {
        name: 'post',
        title: 'Blog Posts',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
              source: 'title',
              maxLength: 96
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: {type: 'author'}
          },
          {
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
              hotspot: true
            }
          },
          {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{type: 'reference', to: {type: 'category'}}]
          },
          {
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime'
          },
          {
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            description: 'A short summary of the blog post'
          },
          {
            name: 'body',
            title: 'Body',
            type: 'blockContent'
          }
        ],
        preview: {
          select: {
            title: 'title',
            author: 'author.name',
            media: 'mainImage'
          },
          prepare(selection) {
            const {author} = selection
            return {...selection, subtitle: author && `by ${author}`}
          }
        }
      },
      
      // Other document types
      {
        name: 'author',
        title: 'Authors',
        type: 'document',
        fields: [
          {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true
            }
          },
          {
            name: 'bio',
            title: 'Bio',
            type: 'array',
            of: [
              {
                title: 'Block',
                type: 'block',
                styles: [{title: 'Normal', value: 'normal'}],
                lists: []
              }
            ]
          }
        ],
        preview: {
          select: {
            title: 'name',
            media: 'image'
          }
        }
      },
      
      {
        name: 'category',
        title: 'Categories',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text'
          }
        ]
      },
      
      {
        name: 'galleryImage',
        title: 'Gallery Images',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text'
          },
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
              list: [
                {title: 'Cars', value: 'cars'},
                {title: 'Events', value: 'events'},
                {title: 'Showroom', value: 'showroom'},
                {title: 'Imports', value: 'imports'}
              ]
            }
          },
          {
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0
          }
        ],
        preview: {
          select: {
            title: 'title',
            media: 'image'
          }
        }
      },
      
      {
        name: 'testimonial',
        title: 'Testimonials',
        type: 'document',
        fields: [
          {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'role',
            title: 'Role',
            type: 'string'
          },
          {
            name: 'quote',
            title: 'Quote',
            type: 'text',
            validation: Rule => Rule.required()
          },
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true
            }
          },
          {
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0
          }
        ],
        preview: {
          select: {
            title: 'name',
            subtitle: 'role',
            media: 'image'
          }
        }
      },
      
      {
        name: 'featuredCar',
        title: 'Featured Cars',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'make',
            title: 'Make',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'model',
            title: 'Model',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'year',
            title: 'Year',
            type: 'number',
            validation: Rule => Rule.required().min(1960).max(new Date().getFullYear())
          },
          {
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: Rule => Rule.required().min(0)
          },
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text'
          },
          {
            name: 'specs',
            title: 'Specifications',
            type: 'array',
            of: [{type: 'string'}]
          },
          {
            name: 'referenceId',
            title: 'Reference ID',
            type: 'string',
            description: 'The reference ID of the car in the database',
            validation: Rule => Rule.required()
          },
          {
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0
          }
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'make',
            media: 'image'
          },
          prepare({title, subtitle, media}) {
            return {
              title: title || 'Untitled',
              subtitle: subtitle,
              media: media
            }
          }
        }
      },
      
      {
        name: 'jdmLegend',
        title: 'JDM Legends',
        type: 'document',
        fields: [
          {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required()
          },
          {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'year',
            title: 'Year',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'specs',
            title: 'Specifications',
            type: 'array',
            of: [{type: 'string'}],
            validation: Rule => Rule.required().min(1)
          },
          {
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0
          }
        ],
        preview: {
          select: {
            title: 'name',
            media: 'image'
          }
        }
      },
      
      {
        name: 'service',
        title: 'Services',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required()
          },
          {
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {
              list: [
                {title: 'Truck', value: 'truck'},
                {title: 'Document', value: 'fileText'},
                {title: 'Shield', value: 'shield'},
                {title: 'Clock', value: 'clock'},
                {title: 'Wrench', value: 'wrench'},
                {title: 'Users', value: 'users'},
                {title: 'Car', value: 'car'},
                {title: 'Tool', value: 'tool'}
              ]
            },
            validation: Rule => Rule.required()
          },
          {
            name: 'order',
            title: 'Order',
            type: 'number',
            initialValue: 0
          }
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'icon'
          }
        }
      },
      
      {
        name: 'hero',
        title: 'Hero Section',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
            validation: Rule => Rule.required()
          },
          {
            name: 'backgroundImage',
            title: 'Background Image',
            type: 'image',
            options: {
              hotspot: true
            }
          },
          {
            name: 'ctaPrimary',
            title: 'Primary CTA Text',
            type: 'string'
          },
          {
            name: 'ctaSecondary',
            title: 'Secondary CTA Text',
            type: 'string'
          },
          {
            name: 'ctaPrimaryLink',
            title: 'Primary CTA Link',
            type: 'string'
          },
          {
            name: 'ctaSecondaryLink',
            title: 'Secondary CTA Link',
            type: 'string'
          }
        ],
        preview: {
          select: {
            title: 'title',
            media: 'backgroundImage'
          }
        }
      },
      
      // Block content type for rich text
      {
        name: 'blockContent',
        title: 'Block Content',
        type: 'array',
        of: [
          {
            title: 'Block',
            type: 'block',
            styles: [
              {title: 'Normal', value: 'normal'},
              {title: 'H1', value: 'h1'},
              {title: 'H2', value: 'h2'},
              {title: 'H3', value: 'h3'},
              {title: 'H4', value: 'h4'},
              {title: 'Quote', value: 'blockquote'}
            ],
            lists: [{title: 'Bullet', value: 'bullet'}, {title: 'Number', value: 'number'}],
            marks: {
              decorators: [
                {title: 'Strong', value: 'strong'},
                {title: 'Emphasis', value: 'em'}
              ],
              annotations: [
                {
                  name: 'link',
                  title: 'Link',
                  type: 'object',
                  fields: [
                    {
                      name: 'href',
                      title: 'URL',
                      type: 'url'
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'image',
            options: {
              hotspot: true
            },
            fields: [
              {
                name: 'caption',
                type: 'string',
                title: 'Caption',
                options: {
                  isHighlighted: true
                }
              },
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative text',
                description: 'Important for SEO and accessibility',
                options: {
                  isHighlighted: true
                }
              }
            ]
          }
        ]
      }
    ]
  }
}