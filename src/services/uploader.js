// src/services/uploader.js
import api from '@/services/api'

export async function uploadImagePortal(file) {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await api.post('/portal/uploads/images', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data // {url, path, message}
}
