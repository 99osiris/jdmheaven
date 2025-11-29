export default {
  name: 'featuredCar',
  title: 'Featured Cars',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'make',
      title: 'Make',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1960).max(new Date().getFullYear())
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0)
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
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
      description: 'The reference ID of the car in the Supabase database',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'make',
      media: 'image'
    },
    prepare({title, subtitle, media}: any) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle,
        media: media
      }
    }
  }
}

