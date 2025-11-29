import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'

// Import schemas
import {schemaTypes} from './schemas'

// Project configuration
// Hardcoded to ensure correct project connection (uye9uitb)
// Environment variables can override, but this ensures correct default
const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID || 
                  import.meta.env.VITE_SANITY_PROJECT_ID || 
                  'uye9uitb' // Force correct project ID

// Use the dataset created by CLI (car-inventory) or from env
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 
                import.meta.env.VITE_SANITY_DATASET || 
                'car-inventory' // Force correct dataset

export default defineConfig({
  name: 'jdm-heaven',
  title: 'JDM Heaven CMS',
  
  projectId: projectId,
  dataset: dataset,
  
  basePath: '/studio',
  
  plugins: [
    deskTool(),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
})

