import request from '@/utils/request'

export function uploadFile(formData, folder) {
  return request({
    url: `/files/upload?folder=${folder}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getDownloadUrl(folder, filename) {
  return `/api/files/download/${folder}/${filename}`
}
