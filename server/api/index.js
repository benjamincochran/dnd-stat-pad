import { Router } from 'express'

import campaigns from './campaigns'
import characters from './characters'

const router = Router()

// Add USERS Routes
router.use(campaigns)
router.use(characters)

export default router
