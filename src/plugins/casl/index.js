import { createMongoAbility } from '@casl/ability'
import { abilitiesPlugin } from '@casl/vue'

// 👉 ability cho phép tất cả
const allowAllRules = [{ action: 'manage', subject: 'all' }]

export default function (app) {
  const ability = createMongoAbility(allowAllRules)
  app.use(abilitiesPlugin, ability, { useGlobalProperties: true })
}
