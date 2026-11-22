export default async function sitemap() {
  const baseUrl = 'https://bagasramandani.net'
  
  // Data proyek (bisa diambil dari database atau API)
  const projects = [
    {
      name: 'XL & AXIS Kuota Checker',
      url: 'https://myxl.bagasramandani.web.id',
      lastModified: '2024-01-01'
    },
    {
      name: 'Tiktok Downloader Video',
      url: 'https://tiktok-downloader.bagasramandani.web.id',
      lastModified: '2024-01-01'
    }
  ]
  
  // Routes statis
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#home`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
  
  // Routes untuk proyek eksternal
  const projectRoutes = projects.map((project) => ({
    url: project.url,
    lastModified: project.lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  
  return [...routes, ...projectRoutes]
}
