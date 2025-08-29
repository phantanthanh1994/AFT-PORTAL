// src/ability/defineAbilities.js
import { PERM_TO_RULE } from './permissionMap'

export function buildAbilityRules(user) {
  if (!user) return []

  const roles = Array.isArray(user.roles) ? user.roles : []
  let perms = Array.isArray(user.permissions) ? user.permissions : []

  // Nếu backend trả permissions là object, chuẩn hóa sang code string
  if (perms.length && typeof perms[0] === 'object') {
    perms = perms.map(p => p.name || p.code).filter(Boolean)
  }

  // SuperAdmin => full
  if (roles.includes('SuperAdmin') || roles.some(r => (r.name ?? r) === 'SuperAdmin')) {
    return [{ action: 'manage', subject: 'all' }]
  }

  const rules = []

  // Map từng permission sang rule CASL
  perms.forEach(code => {
    const m = PERM_TO_RULE[code]
    if (m) rules.push(m)
  })

  // Fallback nếu rỗng: cho xem public
  if (rules.length === 0) {
    rules.push({ action: 'read', subject: 'Dashboard' }) // cho phép xem dashboard
    rules.push({ action: 'read', subject: 'Public' })
  }

  return rules
}
