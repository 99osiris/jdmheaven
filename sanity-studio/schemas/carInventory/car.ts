import {defineType, defineField} from 'sanity'

export const car = defineType({
  name: 'car',
  title: 'Car Inventory',
  type: 'document',
  fields: [
    // BASIC INFO
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'Full car title (e.g., "1999 Nissan Skyline GT-R R34")'
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 96)
      },
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'stockNumber',
      title: 'Stock Number',
      type: 'string',
      description: 'Internal stock/reference number'
    }),

    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Car manufacturer (e.g., Nissan, Toyota, Mazda)'
    }),

    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Car model name'
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
      description: 'Manufacturing year'
    }),

    defineField({
      name: 'vin',
      title: 'VIN (Vehicle Identification Number)',
      type: 'string',
      validation: (Rule) => Rule.max(17),
      description: '17-character VIN'
    }),

    defineField({
      name: 'chassisCode',
      title: 'Chassis Code',
      type: 'string',
      description: 'Chassis code (e.g., R34, FD3S, A80)'
    }),

    defineField({
      name: 'bodyType',
      title: 'Body Type',
      type: 'string',
      options: {
        list: [
          {title: 'Coupe', value: 'coupe'},
          {title: 'Sedan', value: 'sedan'},
          {title: 'Hatchback', value: 'hatchback'},
          {title: 'Convertible', value: 'convertible'},
          {title: 'Wagon', value: 'wagon'},
          {title: 'SUV', value: 'suv'},
          {title: 'Pickup', value: 'pickup'},
          {title: 'Van', value: 'van'}
        ]
      }
    }),

    defineField({
      name: 'exteriorColor',
      title: 'Exterior Color',
      type: 'string',
      description: 'Exterior paint color'
    }),

    defineField({
      name: 'interiorColor',
      title: 'Interior Color',
      type: 'string',
      description: 'Interior upholstery color'
    }),

    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Used', value: 'used'},
          {title: 'Restored', value: 'restored'},
          {title: 'Modified', value: 'modified'},
          {title: 'Project', value: 'project'}
        ]
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'used'
    }),

    // STATUS & LOCATION
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Reserved', value: 'reserved'},
          {title: 'Sold', value: 'sold'}
        ]
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'available'
    }),

    defineField({
      name: 'importStatus',
      title: 'Import Status',
      type: 'string',
      options: {
        list: [
          {title: 'In Transit', value: 'inTransit'},
          {title: 'Landed', value: 'landed'},
          {title: 'Available', value: 'available'},
          {title: 'Custom Order', value: 'customOrder'}
        ]
      },
      initialValue: 'available'
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Current location of the vehicle'
    }),

    defineField({
      name: 'auctionGrade',
      title: 'Auction Grade',
      type: 'string',
      description: 'Japanese auction grade (e.g., 4.5, 5, R)'
    }),

    defineField({
      name: 'previousOwners',
      title: 'Previous Owners',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(20),
      description: 'Number of previous owners'
    }),

    defineField({
      name: 'registrationStatus',
      title: 'Registration Status',
      type: 'string',
      description: 'Vehicle registration status'
    }),

    // MEDIA
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for SEO and accessibility'
            }),
            defineField({
              name: 'isPrimary',
              title: 'Primary Image',
              type: 'boolean',
              initialValue: false
            })
          ]
        })
      ],
      validation: (Rule) => Rule.min(1).error('At least one image is required')
    }),

    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or other video platform URL'
    }),

    defineField({
      name: 'spin360Url',
      title: '360° Spin URL',
      type: 'url',
      description: 'URL to 360-degree view/interactive spin'
    }),

    defineField({
      name: 'inspectionReport',
      title: 'Inspection Report',
      type: 'file',
      description: 'PDF or document file of inspection report'
    }),

    // DESCRIPTION
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      description: 'Detailed description of the vehicle'
    }),

    defineField({
      name: 'maintenanceRecords',
      title: 'Maintenance Records',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'maintenanceRecord',
          title: 'Maintenance Record',
          fields: [
            defineField({
              name: 'date',
              title: 'Date',
              type: 'datetime',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'cost',
              title: 'Cost',
              type: 'number',
              validation: (Rule) => Rule.min(0),
              description: 'Cost in your base currency'
            })
          ],
          preview: {
            select: {
              date: 'date',
              description: 'description',
              cost: 'cost'
            },
            prepare({date, description, cost}: any) {
              return {
                title: description || 'Maintenance Record',
                subtitle: date ? new Date(date).toLocaleDateString() : '',
                media: undefined
              }
            }
          }
        }
      ]
    }),

    // SPECS
    defineField({
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      fields: [
        defineField({
          name: 'engine',
          title: 'Engine',
          type: 'string',
          description: 'Engine name/code (e.g., RB26DETT, 2JZ-GTE)'
        }),
        defineField({
          name: 'displacement',
          title: 'Displacement',
          type: 'number',
          description: 'Engine displacement in liters (e.g., 2.6)'
        }),
        defineField({
          name: 'induction',
          title: 'Induction',
          type: 'string',
          options: {
            list: [
              {title: 'Turbo', value: 'turbo'},
              {title: 'Naturally Aspirated', value: 'na'}
            ]
          }
        }),
        defineField({
          name: 'power',
          title: 'Power (HP)',
          type: 'number',
          description: 'Horsepower'
        }),
        defineField({
          name: 'torque',
          title: 'Torque (Nm)',
          type: 'number',
          description: 'Torque in Newton-meters'
        }),
        defineField({
          name: 'zeroToHundred',
          title: '0-100 km/h',
          type: 'string',
          description: 'Acceleration time (e.g., "4.2s")'
        }),
        defineField({
          name: 'topSpeed',
          title: 'Top Speed',
          type: 'string',
          description: 'Top speed (e.g., "180 km/h")'
        }),
        defineField({
          name: 'weight',
          title: 'Weight (kg)',
          type: 'number',
          description: 'Curb weight in kilograms'
        }),
        defineField({
          name: 'drivetrain',
          title: 'Drivetrain',
          type: 'string',
          options: {
            list: [
              {title: 'RWD', value: 'rwd'},
              {title: 'FWD', value: 'fwd'},
              {title: 'AWD', value: 'awd'},
              {title: '4WD', value: '4wd'}
            ]
          }
        }),
        defineField({
          name: 'transmission',
          title: 'Transmission',
          type: 'string',
          description: 'Transmission type (e.g., 6-speed manual, 5-speed automatic)'
        }),
        defineField({
          name: 'fuelType',
          title: 'Fuel Type',
          type: 'string',
          options: {
            list: [
              {title: 'Petrol', value: 'petrol'},
              {title: 'Diesel', value: 'diesel'},
              {title: 'Electric', value: 'electric'},
              {title: 'Hybrid', value: 'hybrid'}
            ]
          }
        }),
        defineField({
          name: 'fuelConsumption',
          title: 'Fuel Consumption',
          type: 'string',
          description: 'Fuel consumption (e.g., "10.5 L/100km")'
        })
      ]
    }),

    // PRICING
    defineField({
      name: 'basePrice',
      title: 'Base Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Base price before taxes and shipping'
    }),

    defineField({
      name: 'importTax',
      title: 'Import Tax',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Import tax amount'
    }),

    defineField({
      name: 'shippingCost',
      title: 'Shipping Cost',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Shipping cost'
    }),

    defineField({
      name: 'finalPrice',
      title: 'Final Price',
      type: 'number',
      validation: (Rule) => Rule.min(0),
      description: 'Final price including all costs'
    }),

    defineField({
      name: 'negotiable',
      title: 'Price Negotiable',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the price is negotiable'
    }),

    // FLAGS
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Feature this car on the homepage'
    }),

    defineField({
      name: 'hotImport',
      title: 'Hot Import',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as hot/trending import'
    }),

    defineField({
      name: 'freshArrival',
      title: 'Fresh Arrival',
      type: 'boolean',
      initialValue: false,
      description: 'Recently arrived vehicle'
    }),

    defineField({
      name: 'rareUnit',
      title: 'Rare Unit',
      type: 'boolean',
      initialValue: false,
      description: 'Mark as rare/limited edition'
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom SEO title (defaults to car title if empty)',
      validation: (Rule) => Rule.max(60)
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Meta description for search engines',
      validation: (Rule) => Rule.max(160)
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Social media preview image (defaults to primary car image if empty)',
      options: {
        hotspot: true
      }
    })
  ],

  preview: {
    select: {
      title: 'title',
      brand: 'brand',
      model: 'model',
      year: 'year',
      status: 'status',
      media: 'images.0'
    },
    prepare({title, brand, model, year, status, media}) {
      const subtitle = [brand, model, year].filter(Boolean).join(' ')
      return {
        title: title || 'Untitled Car',
        subtitle: `${subtitle}${status ? ` • ${status}` : ''}`,
        media: media
      }
    }
  },

  orderings: [
    {
      title: 'Year, New',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}]
    },
    {
      title: 'Year, Old',
      name: 'yearAsc',
      by: [{field: 'year', direction: 'asc'}]
    },
    {
      title: 'Price, High',
      name: 'priceDesc',
      by: [{field: 'finalPrice', direction: 'desc'}]
    },
    {
      title: 'Price, Low',
      name: 'priceAsc',
      by: [{field: 'finalPrice', direction: 'asc'}]
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}]
    }
  ]
})

