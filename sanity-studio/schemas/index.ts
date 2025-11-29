// Export all schemas
import post from './post'
import featuredCar from './featuredCar'
import blockContent from './blockContent'
import author from './author'
import category from './category'
import {car} from './carInventory/car'

export const schemaTypes = [
  // Car Inventory
  car,
  
  // Core content types
  post,
  featuredCar,
  
  // Supporting types
  author,
  category,
  blockContent,
]

