// permission code -> { action, subject }
export const PERM_TO_RULE = {
  // System
  'system.manage':        { action: 'manage', subject: 'all' },

  'user.view':            { action: 'read',   subject: 'User' },
  'user.create':          { action: 'create', subject: 'User' },
  'user.update':          { action: 'update', subject: 'User' },
  'user.delete':          { action: 'delete', subject: 'User' },
  'user.assignRole':      { action: 'assign', subject: 'User' },

  'role.view':            { action: 'read',   subject: 'Role' },
  'role.create':          { action: 'create', subject: 'Role' },
  'role.update':          { action: 'update', subject: 'Role' },
  'role.delete':          { action: 'delete', subject: 'Role' },
  'permission.view':      { action: 'read',   subject: 'Permission' },

  'audit.view':           { action: 'read',   subject: 'Audit' },
  'audit.export':         { action: 'export', subject: 'Audit' },

  'policy.manage':        { action: 'manage', subject: 'Policy' },
  'config.manage':        { action: 'manage', subject: 'Config' },

  // Content
  'news.view':            { action: 'read',   subject: 'News' },
  'news.create':          { action: 'create', subject: 'News' },
  'news.update':          { action: 'update', subject: 'News' },
  'news.delete':          { action: 'delete', subject: 'News' },
  'news.publish':         { action: 'publish',subject: 'News' },
  'news.import':          { action: 'import', subject: 'News' },
  'news.export':          { action: 'export', subject: 'News' },

  'event.view':           { action: 'read',   subject: 'Event' },
  'event.create':         { action: 'create', subject: 'Event' },
  'event.update':         { action: 'update', subject: 'Event' },
  'event.delete':         { action: 'delete', subject: 'Event' },
  'event.approve':        { action: 'approve',subject: 'Event' },
  'event.import':         { action: 'import', subject: 'Event' },
  'event.export':         { action: 'export', subject: 'Event' },

  'category.view':        { action: 'read',   subject: 'Category' },
  'category.create':      { action: 'create', subject: 'Category' },
  'category.update':      { action: 'update', subject: 'Category' },
  'category.delete':      { action: 'delete', subject: 'Category' },

  'tag.view':             { action: 'read',   subject: 'Tag' },
  'tag.create':           { action: 'create', subject: 'Tag' },
  'tag.update':           { action: 'update', subject: 'Tag' },
  'tag.delete':           { action: 'delete', subject: 'Tag' },

  'comment.moderate':     { action: 'moderate', subject: 'Comment' },

  // Standards / benefits
  'standard.view':        { action: 'read',   subject: 'Standard' },
  'standard.export':      { action: 'export', subject: 'Standard' },
  'standard.generateWord':{ action: 'generate',subject: 'Standard' },

  // Members & blue tick
  'member.view':          { action: 'read',   subject: 'Member' },
  'member.approve':       { action: 'approve',subject: 'Member' },
  'member.reject':        { action: 'reject', subject: 'Member' },
  'member.export':        { action: 'export', subject: 'Member' },

  'memberType.view':      { action: 'read',   subject: 'MemberType' },
  'memberType.create':    { action: 'create', subject: 'MemberType' },
  'memberType.update':    { action: 'update', subject: 'MemberType' },
  'memberType.delete':    { action: 'delete', subject: 'MemberType' },

  'package.view':         { action: 'read',   subject: 'Package' },
  'package.create':       { action: 'create', subject: 'Package' },
  'package.update':       { action: 'update', subject: 'Package' },
  'package.delete':       { action: 'delete', subject: 'Package' },

  'fee.notify':           { action: 'notify', subject: 'Fee' },
  'fee.view':             { action: 'read',   subject: 'Fee' },
  'fee.export':           { action: 'export', subject: 'Fee' },

  'alert.manage':         { action: 'manage', subject: 'Alert' },
  'limit.notify':         { action: 'notify', subject: 'Limit' },
  'renewal.notify':       { action: 'notify', subject: 'Renewal' },

  // Payments
  'payment.view':         { action: 'read',   subject: 'Payment' },
  'payment.export':       { action: 'export', subject: 'Payment' },
  'payment.process':      { action: 'process',subject: 'Payment' },

  // Trade
  'company.view':         { action: 'read',   subject: 'Company' },
  'company.create':       { action: 'create', subject: 'Company' },
  'company.update':       { action: 'update', subject: 'Company' },
  'company.delete':       { action: 'delete', subject: 'Company' },
  'company.verify':       { action: 'verify', subject: 'Company' },

  'offer.view':           { action: 'read',   subject: 'Offer' },
  'offer.create':         { action: 'create', subject: 'Offer' },
  'offer.update':         { action: 'update', subject: 'Offer' },
  'offer.delete':         { action: 'delete', subject: 'Offer' },
  'offer.export':         { action: 'export', subject: 'Offer' },

  'tradeConnect.view':        { action: 'read',   subject: 'TradeConnect' },
  'tradeConnect.autoConnect': { action: 'manage', subject: 'TradeConnect' },
  'tradeConnect.configure':   { action: 'configure', subject: 'TradeConnect' },
  'tradeConnect.export':      { action: 'export', subject: 'TradeConnect' },
  'tradeConnect.monitor':     { action: 'monitor',subject: 'TradeConnect' },

  // Investment
  'investor.view':        { action: 'read',   subject: 'Investor' },
  'investor.create':      { action: 'create', subject: 'Investor' },
  'investor.update':      { action: 'update', subject: 'Investor' },
  'investor.delete':      { action: 'delete', subject: 'Investor' },

  'investConnect.view':       { action: 'read',   subject: 'InvestConnect' },
  'investConnect.autoConnect':{ action: 'manage', subject: 'InvestConnect' },
  'investConnect.export':     { action: 'export', subject: 'InvestConnect' },

  // Technology transfer
  'tech.view':            { action: 'read',   subject: 'Tech' },
  'tech.create':          { action: 'create', subject: 'Tech' },
  'tech.update':          { action: 'update', subject: 'Tech' },
  'tech.delete':          { action: 'delete', subject: 'Tech' },

  'techConnect.view':         { action: 'read',   subject: 'TechConnect' },
  'techConnect.autoMonitor':  { action: 'manage', subject: 'TechConnect' },
  'techConnect.export':       { action: 'export', subject: 'TechConnect' },

  // Reports
  'report.view':          { action: 'read',   subject: 'Report' },
  'report.export':        { action: 'export', subject: 'Report' },

  // API
  'api.member':           { action: 'use',    subject: 'ApiMember' },
  'api.transport':        { action: 'use',    subject: 'ApiTransport' },
  'api.trace':            { action: 'use',    subject: 'ApiTrace' },
  'api.payment':          { action: 'use',    subject: 'ApiPayment' },
}
